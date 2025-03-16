const products = document.querySelectorAll(".product-image");

products.forEach(imageElement => {
    const images = JSON.parse(imageElement.getAttribute("data-images"));

    if (images.length > 1) {
        let currentIndex = 0;

        setInterval(() => {
            currentIndex = (currentIndex + 1) % images.length;
            imageElement.src = images[currentIndex];
        }, 4000);
    }
});
