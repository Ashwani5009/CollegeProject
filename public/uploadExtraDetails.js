const fs = require('fs');
const axios = require('axios');

const PROBLEM_ID = '680e057d7f66ab7cb2398cfa'; // Replace with actual ID
const API_URL = `http://localhost:5000/api/problems/${PROBLEM_ID}/extra-details`;

fs.readFile('formatted.html', 'utf-8', async (err, data) => {
  if (err) {
    console.error('Failed to read HTML file:', err);
    return;
  }

  try {
    const response = await axios.put(API_URL, {
      extraDetailsHtml: data
    });

    console.log('Upload successful:', response.data.message);
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
  }
});
