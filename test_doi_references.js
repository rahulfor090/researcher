// Test script for DOI references functionality
// Run this in your browser console after adding an article with DOI

// Test DOI
const testDoi = "10.1136/bmj.r1818";

// Test fetching from Crossref API
fetch(`https://api.crossref.org/works/${testDoi}`)
  .then(response => response.json())
  .then(data => {
    console.log("Crossref API Response:", data);
    console.log("References found:", data.message?.reference?.length || 0);
    console.log("Sample references:", data.message?.reference?.slice(0, 3));
  })
  .catch(error => {
    console.error("Error fetching from Crossref:", error);
  });

// Test saving to your API (replace with actual token)
const token = localStorage.getItem('token');
if (token) {
  fetch('http://localhost:5000/v1/doi-references', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      doi: testDoi,
      references: [
        { "title": "Test Reference 1", "author": "Test Author" },
        { "title": "Test Reference 2", "author": "Another Author" }
      ]
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Save response:", data);
  })
  .catch(error => {
    console.error("Error saving references:", error);
  });
}