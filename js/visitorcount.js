// Replace with your actual CountAPI URL
const apiUrl = 'https://api.countapi.xyz/get/arnav-saraf-official.github.io/visits';

// Function to format the number with the correct suffix
function getOrdinalSuffix(number) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const value = number % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
}

// Function to update the visitor count display
function updateVisitorCount(count) {
    const ordinal = getOrdinalSuffix(count); // Get the correct suffix
    document.getElementById('visit').textContent = `${count}${ordinal}`; // Update the span with count and suffix
}

// Fetch the visitor count from CountAPI
function getVisitorCount() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const count = data.value; // The visitor count returned by the API
            updateVisitorCount(count); // Update the display with the current count
        })
        .catch(error => {
            console.error('Error fetching visitor count:', error);
            document.getElementById('visit').textContent = 'Error loading count';
        });
}

// Function to increase the visitor count by 1
function increaseVisitorCount() {
    fetch('https://api.countapi.xyz/hit/arnav-saraf-official.github.io/visits', {
        method: 'POST', // Send a POST request to update the count
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) // Empty body for a simple increment
    })
    .then(response => response.json())
    .then(data => {
        const newCount = data.value; // Get the updated visitor count
        updateVisitorCount(newCount); // Update the display with the new count
    })
    .catch(error => {
        console.error('Error increasing visitor count:', error);
    });
}

// Initial fetch to display visitor count on page load
getVisitorCount();
