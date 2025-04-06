document.addEventListener('DOMContentLoaded', function() {
    const inventoryItems = [
        { make: 'Kubota', model: 'BX2380', description: 'Compact tractor.', cost: '10000', status: 'in Stock' },
        { make: 'Kubota', model: 'L4701', description: 'Standard tractor.', cost: '20000', status: 'in Stock' }
    ];

    const inventoryList = document.getElementById('inventoryList');
    inventoryItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `<strong>${item.make} ${item.model}</strong> - ${item.description} - $${item.cost} - ${item.status}`;
        inventoryList.appendChild(itemDiv);
    });
});
