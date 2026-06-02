async function loadProducts() {

    const res = await fetch('/api/products');
    const data = await res.json();

    let container = document.getElementById('products');

    container.innerHTML = "";

    data.forEach(product => {

        container.innerHTML += `
            <div class="card">
                <img src="${product.image}" width="100">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
            </div>
        `;
    });
}

loadProducts();