// Функция, которая открывает модальное окно
function openModal(modalSelector) {
    document.querySelector(modalSelector).classList.add('show');
}

// Функция, которая закрывает модальное окно
function closeModal(modalSelector) {
    document.querySelector(modalSelector).classList.remove('show');
    document.querySelector(".modal__image-inner").style.transition = "none";
}

export {openModal, closeModal};