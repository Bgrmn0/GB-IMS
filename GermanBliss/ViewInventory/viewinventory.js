document.addEventListener('DOMContentLoaded', () => {
    fetch('/inventory')
      .then(response => response.json())
      .then(data => {
        const inventoryList = document.getElementById('inventoryList');
        if (data.length === 0) {
          inventoryList.innerHTML = '<p>No inventory items found.</p>';
          return;
        }
  
        data.forEach(item => {
          const itemDiv = document.createElement('div');
          itemDiv.innerHTML = `
            <strong>${item.make} ${item.model}</strong><br>
            ${item.description}<br>
            Cost: $${item.cost}<br>
            Quantity: ${item.quantity}<br>
            Status: ${item.status}<br><br>
          `;
          inventoryList.appendChild(itemDiv);
        });
      })
      .catch(error => {
        console.error('Error fetching inventory:', error);
        document.getElementById('inventoryList').innerText = 'Failed to load inventory.';
      });
  });
  