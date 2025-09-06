// Quantity buttons functionality
document.querySelectorAll('.cart-card').forEach(card => {
  let minus = card.querySelector('.minus');
  let plus = card.querySelector('.plus');
  let input = card.querySelector('input');
  let price = parseInt(card.querySelector('p').textContent.replace('Price: ₹',''));
  let total = card.querySelector('.item-total');

  function updateTotal() {
    let qty = parseInt(input.value);
    total.textContent = "Total: ₹" + (price * qty);
    updateSubtotal();
  }

  minus.addEventListener('click', () => {
    if (input.value > 1) {
      input.value--;
      updateTotal();
    }
  });

  plus.addEventListener('click', () => {
    input.value++;
    updateTotal();
  });

  input.addEventListener('change', updateTotal);
});

// Subtotal update
function updateSubtotal() {
  let subtotal = 0;
  document.querySelectorAll('.item-total').forEach(item => {
    subtotal += parseInt(item.textContent.replace('Total: ₹',''));
  });
  document.getElementById('subtotal').textContent = "₹" + subtotal;
}

// Initial subtotal calculation
updateSubtotal();

