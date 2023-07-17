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