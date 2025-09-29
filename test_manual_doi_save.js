// Test script to manually save DOI references
// Open browser console on your app and run this script

async function testSaveDOI() {
  const token = localStorage.getItem('token');
  const apiBase = 'http://localhost:5000';
  
  if (!token) {
    console.error('No token found. Please login first.');
    return;
  }
  
  console.log('Testing DOI save with token:', token.substring(0, 20) + '...');
  
  try {
    const response = await fetch(`${apiBase}/doi-references`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        doi: '10.1136/bmj.r1818',
        references: [
          {
            "title": "Test Reference 1",
            "author": "Test Author 1",
            "year": 2023
          },
          {
            "title": "Test Reference 2", 
            "author": "Test Author 2",
            "year": 2024
          }
        ]
      })
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (response.ok) {
      console.log('✅ Successfully saved DOI references!');
    } else {
      console.error('❌ Failed to save:', result);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

// Run the test
testSaveDOI();