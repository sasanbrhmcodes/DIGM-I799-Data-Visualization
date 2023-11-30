// Function to fetch and process JSON data
function fetchAndProcessJSON() {
    fetch('EnableDevs_7.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text(); // Read the response as text
        })
        .then(jsonText => {
            try {
                const data = JSON.parse(jsonText); // Parse the JSON data

                const playerSpeedList = document.getElementById('playerSpeedList');
                const timestampsList = document.getElementById('timestampsList');

                // Clear existing list items
                playerSpeedList.innerHTML = '';
                timestampsList.innerHTML = '';

                // Check if 'messages' property exists and is an array
                if (data && data.messages && Array.isArray(data.messages)) {
                    // Process entries
                    data.messages.forEach(entry => {
                        if (entry.key === 'Player Speed') {
                            const playerSpeedValue = entry.value.Value;
                            const listItem = document.createElement('li');
                            listItem.textContent = `Player Speed: ${playerSpeedValue}`;
                            playerSpeedList.appendChild(listItem);
                        }
                       // if (entry.hasOwnProperty === 'timeStamp') {
                            const timestampValue = entry.timeStamp;
                            const timestampDate = new Date(timestampValue);
                            const listItem = document.createElement('li');
                            listItem.textContent = `Timestamp: ${timestampDate.toISOString()}`;
                            timestampsList.appendChild(listItem);
                       // }
                    });
                } else {
                    console.error('JSON data does not contain the expected structure:', data);
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        })
        .catch(error => {
            console.error('Error reading JSON:', error);
        });
}

// Call the fetchAndProcessJSON function when the page loads
window.addEventListener('load', fetchAndProcessJSON);