/*

function fetchAndProcessPlayerSpeedJSON() {
    fetch('EnableDevs_7.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Check if 'messages' property exists and is an array
            if (data.messages && Array.isArray(data.messages)) {
                const playerSpeedEntries = data.messages.filter(entry => entry.key === 'Player Speed');
                console.log('Player Speed Entries:', playerSpeedEntries);

                if (playerSpeedEntries.length > 0) {
                    const playerSpeedList = document.getElementById('playerSpeedList');
                    playerSpeedList.innerHTML = ''; // Clear existing list items

                    playerSpeedEntries.forEach(playerSpeedEntry => {
                        const playerSpeedValue = playerSpeedEntry.value.Value;
                        const listItem = document.createElement('li');
                        listItem.textContent = playerSpeedValue;
                        playerSpeedList.appendChild(listItem);
                    });
                } else {
                    document.getElementById('playerSpeedList').textContent = 'No Player Speed entries found';
                }
            } else {
                console.error('JSON data does not contain a "messages" array or it is not an array:', data);
            }
        })
        .catch(error => {
            console.error('Error reading JSON:', error);
        });
}

// Call the fetchAndProcessPlayerSpeedJSON function when the page loads
window.addEventListener('load', fetchAndProcessPlayerSpeedJSON);