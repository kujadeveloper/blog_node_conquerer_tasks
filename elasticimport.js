const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');

const indexName = 'posts'; // Replace with your desired index name
const filePath = './elasticdata/posts.json'; // Path to your JSON file
const client = new Client({ node: 'http://elasticsearch:9200' });

async function bulkIndexDocuments(item,id) {
  try {
    const bulkBody = [
      { index: { _index: indexName, _id: id } },
      item,
    ];

    const { body } = await client.bulk({ refresh: true, body: bulkBody });

    // Check the response for any errors
    if (body.errors) {
      console.error('Error occurred while performing bulk operation:', body.errors);
    } else {
      console.log('Bulk operation completed successfully.');
    }
  } catch (error) {
    console.error('Error occurred:', error);
  }
}



fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }

  try {
    const jsonData = JSON.parse(data);

    // Process the JSON data
    
    var id = 1
    jsonData.forEach(item => {
      // Do something with each item in the JSON data
      console.log(item);
      bulkIndexDocuments(item,id)
      id = id+1
    });
  } catch (error) {
    console.error('Error parsing JSON data:', error);
  }
});
