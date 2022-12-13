// Функция для создания фотографии
function createImage(src, inner) {
    return new Promise((resolve, reject) => {
        const imgDiv = document.createElement("div");
        imgDiv.classList.add('modal__image-card');
        inner.prepend(imgDiv);
        const image = document.createElement("img");
        image.onload = () => resolve(image);
        image.classList.add('modal__img');
        imgDiv.prepend(image);
        image.setAttribute("src", src);
    });
}

// Функция для очистки фотографий
function clearImages() {
    const modalImageCards = document.querySelectorAll(".modal__image-card");
    modalImageCards.forEach((card) => {
        card.remove();
    });
}

export {createImage, clearImages};