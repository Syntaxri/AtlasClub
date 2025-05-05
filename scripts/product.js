document.addEventListener('DOMContentLoaded', async () => {
    // Function to extract product ID from URL
    function getProductSlug() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    const productSlug = getProductSlug();

    // If there's no product ID, display a message and exit
    if (!productSlug) {
        document.body.innerHTML = '<p>Product not specified. Please select a product from the shop.</p>';
        return;
    }

    try {
        // Fetch product data from JSON (assuming this is your data source)
        const response = await fetch('/data/products.json');
        const products = await response.json();

        // Find the specific product using the ID
        const product = products[productSlug];

        // If product is not found, display a message and exit
        if (!product) {
            document.body.innerHTML = '<p>Product not found.</p>';
            return;
        }

        // Populate the page with the product data
        document.querySelector('.product-title').textContent = product.title;
        document.querySelector('.product-description').textContent = product.description;
        document.querySelector('.product-price').textContent = `$${product.price.toFixed(2)}`;

        const mainImage = document.getElementById('mainImage');
        mainImage.src = product.images[0];
        mainImage.alt = product.title;

        // Add thumbnail images
        const thumbnailsDiv = document.getElementById('thumbnails');
        product.images.forEach((imgSrc, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgSrc;
            thumb.alt = `${product.title} thumbnail ${index + 1}`;
            thumb.style.width = '50px'; // Adjust size as needed
            thumb.style.margin = '5px';
            thumb.addEventListener('click', () => {
                document.getElementById('mainImage').src = imgSrc;
            });
            thumbnailsDiv.appendChild(thumb);
        });

    } catch (error) {
        console.error('Error loading product data:', error);
        document.body.innerHTML = '<p>Failed to load product data.</p>';
    }
    
});