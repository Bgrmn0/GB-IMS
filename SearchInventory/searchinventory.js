document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('searchQuery').value.toLowerCase();
    const inventoryItems = [
        { make: 'Kubota', model: 'BX2380', description: 'Compact tractor.', cost: '10000', status: 'inStock' },
        { make: 'Kubota', model: 'L4701', description: 'Standard tractor.', cost: '20000', status: 'inStock' }
    ];
    const results = inventoryItems.filter(item => item.make.toLowerCase().includes(query) || item.model.toLowerCase().includes(query));
    
    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = ''; // Clear previous results
    results.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `<strong>${item.make} ${item.model}</strong> - ${item.description} - $${item.cost} - ${item.status}`;
        searchResults.appendChild(itemDiv);
    });
});
