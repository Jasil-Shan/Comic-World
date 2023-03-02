function updateQuantity(productId, action) {
    fetch(`/QuantityUpdate/${productId}?Add=${action}`, { method: 'PUT' })
        .then(data => {
            // Update the quantity input field with the new value
            document.querySelector(`#quantity-${productId}`).value = data.quantity;
        })
        .catch(error => {
            console.error(error);
            alert('Failed to update quantity');
        });
}

module.exports = updateQuantity