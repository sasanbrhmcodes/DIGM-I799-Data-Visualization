/*

function fetchAndProcessTimestampsJSON() {
    fetch('EnableDevs_7.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Check if timestamps entries exist in the JSON data
            if (Array.isArray(data)) {
                const timestampEntries = data.filter(entry => entry.key === 'Timestamps');

                if (timestampEntries.length > 0) {
                    const timestampsList = document.getElementById('timestampsList');
                    timestampsList.innerHTML = ''; // Clear existing list items

                    timestampEntries.forEach(timestampEntry => {
                        const timestampValue = timestampEntry.value.Value;
                        const listItem = document.createElement('li');
                        listItem.textContent = timestampValue;
                        timestampsList.appendChild(listItem);
                    });
                } else {
                    document.getElementById('timestampsList').textContent = 'No Timestamps entries found';
                }
            } else {
                console.error('JSON data does not contain an array:', data);
            }
        })
        .catch(error => {
            console.error('Error reading JSON:', error);
        });
}

// Call the fetchAndProcessTimestampsJSON function when the page loads
window.addEventListener('load', fetchAndProcessTimestampsJSON);