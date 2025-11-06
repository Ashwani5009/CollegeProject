const fs = require('fs');
const axios = require('axios');

const PROBLEM_ID = '68bd2d40549932519abd067d'; // Replace with actual ID
const API_URL = `https://collegeproject-fnkx.onrender.com/api/problems/${PROBLEM_ID}/extra-details`;

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
