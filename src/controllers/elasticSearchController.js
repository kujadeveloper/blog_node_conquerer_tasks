const jwt = require('../utils/jwt');
const { Client } = require('@elastic/elasticsearch');
const response = require('../utils/response');

const client = new Client({ node: 'http://elasticsearch:9200' });

exports.getCategory = async (req, res) => {
  try {
    const { body } = await client.search({
      index: 'posts',
      body: {
        "size": 0,
        "aggs": {
          "category_percentages": {
            "terms": {
              "field": "category.keyword",
              "size": 4
            }
          }
        }
      }
    });

    total = 0;
    for(var i in body.aggregations.category_percentages.buckets)
    {
      total = total+body.aggregations.category_percentages.buckets[i].doc_count
    }

    for(var i in body.aggregations.category_percentages.buckets)
    {
      body.aggregations.category_percentages.buckets[i]['percent'] = (body.aggregations.category_percentages.buckets[i].doc_count/(total/100)).toFixed(2)
    }

    res.status(200).json(response.getAll(body.aggregations.category_percentages));
  } catch (error) {
    console.log(error)
    res.status(500).json(response.error(error));
  }
};


exports.getUserBloger = async (req, res) => {
  try {

    let { body } = await client.search({
      index: 'posts',
      body: {
        size: 0,
        aggs: {
          total_users: {
            value_count: {
              field: 'profile.username.keyword',
            },
          },
          bloggers: {
            filter: {
              exists: {
                field: 'title',
              },
            },
            aggs: {
              blogger_count: {
                cardinality: {
                  field: 'profile.username.keyword',
                },
              },
            },
          },
          readers: {
            filter: {
              bool: {
                must_not: [
                  { exists: { field: 'title' } },
                ],
              },
            },
            aggs: {
              reader_count: {
                cardinality: {
                  field: 'profile.username.keyword',
                },
              },
            },
          },
        },
      },
    });

    const totalUsers = body.aggregations.total_users.value;
    const bloggerCount = body.aggregations.bloggers.blogger_count.value;
    const readerCount = body.aggregations.readers.reader_count.value;

    body = await client.count({ index:'user'});
    console.log(body.body.count)

    res.status(200).json(response.getAll({total:body.body.count, blogger:bloggerCount, reader:body.body.count-bloggerCount}));
  } catch (error) {
    console.log(error)
    res.status(500).json(response.error(error));
  }
};





exports.getByrange= async (req, res) => {
  const {timerange } = req.query;
  try {
    let interval, format, minRange;
    const maxRange = "now/d";

    switch (timerange) {
      case "week":
        interval = "day";
        format = "yyyy-MM-dd";
        minRange = "now-7d/d";
        break;
      case "month":
        interval = "week";
        format = "yyyy-MM-dd";
        minRange = "now-30d/d";
        break;
      case "year":
        interval = "month";
        format = "yyyy-MM";
        minRange = "now-365d/d";
        break;
      default:
        throw new Error("Invalid time range specified.");
    }

    const { body } = await client.search({
      index: "posts",
      body: {
        size: 0,
        aggs: {
          time_range_distribution: {
            date_histogram: {
              field: "createdAt",
              calendar_interval: interval,
              format: format,
              extended_bounds: {
                min: minRange,
                max: maxRange
              }
            },
            aggs: {
              category_distribution: {
                terms: {
                  field: "category.keyword",
                  size: 10
                }
              }
            }
          }
        }
      }
    });

    const distributionBuckets = body.aggregations.time_range_distribution.buckets;
    distributionBuckets.forEach(bucket => {
      console.log(`Date: ${bucket.key_as_string}`);
      bucket.category_distribution.buckets.forEach(categoryBucket => {
        console.log(`- Category: ${categoryBucket.key}, Count: ${categoryBucket.doc_count}`);
      });
    });
    res.status(200).json(response.getAll(distributionBuckets));
  } catch (error) {
    console.log(error)
    res.status(500).json(response.error(error));
  }
};