document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value.toLowerCase();

    fetch(`/search-inventory?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = ''; // Clear previous results

            if (data.length === 0) {
                searchResults.innerHTML = '<p>No matching items found.</p>';
                return;
            }

            data.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.style.marginBottom = '15px';
                itemDiv.style.padding = '10px';
                itemDiv.style.border = '1px solid #ccc';
                itemDiv.style.borderRadius = '4px';
                itemDiv.style.backgroundColor = '#f9f9f9';
                itemDiv.innerHTML = `
                    <strong>${item.make} ${item.model}</strong><br>
                    Description: ${item.description}<br>
                    Cost: $${item.cost}<br>
                    Quantity: ${item.quantity}<br>
                    Status: ${item.status}
                `;
                searchResults.appendChild(itemDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching inventory:', error);
            document.getElementById('searchResults').innerHTML = '<p>Error loading results. Please try again later.</p>';
        });
});
