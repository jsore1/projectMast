import slider from './slider';
import {createImage, clearImages} from './image';
import {openModal} from './modal';

// Функция отрисовки точек на странице
// Принимает два параметра:
// pointsArray - Массив с точками
// planSelector - Селектор элемента, на котором будут отрисовываться точки
function renderPoints(pointsArray, planSelector){
    if (pointsArray.length > 0) {
        const plan = document.querySelector(planSelector);
        pointsArray.forEach((point) => {
            plan.insertAdjacentHTML(
                "beforeend",
                `<div class="plan__point" style="top: ${point.y}px;left: ${point.x}px" data-id="${point.id}">
                    ${point.name}
                </div>`
            );
        });
    }
}

// Функция отрисовки модального окна с данными точки
// Принимает 3 параметра:
// pointsArray - Массив с точками
// pointId - id точки
// imagesArray - Массив с данными по конкретной точке
function renderImageModal(pointsArray, pointId, imagesArray) {
    const modalText = document.querySelector(".modal__text"),
          modalTitle = document.querySelector(".modal__title"),
          modalDate = document.querySelector(".modal__date"),
          modalImageInner = document.querySelector(".modal__image-inner"),
          nextButton = document.querySelector(".modal__next"),
          backButton = document.querySelector(".modal__back"),
          loader = document.querySelector(".loader"),
          imagesPromiseArray = [];

    clearImages();
    modalText.classList.add("hide");
    modalTitle.textContent = pointsArray[pointId-1].title;
    modalDate.textContent = imagesArray[0].description;
    modalImageInner.style.width = `${imagesArray.length * 100}%`;
    loader.classList.add("show");
    if (imagesArray.length > 1) {
        imagesArray.forEach((el, index) => {
            imagesPromiseArray.push(createImage(imagesArray[index].url, modalImageInner));
        });
        Promise.all(imagesPromiseArray)
        .then(() => {
            loader.classList.remove("show");
            openModal('.modal');
            slider(imagesArray);
        });
    } else {
        createImage(imagesArray[0].url, modalImageInner)
        .then(() => {
            modalImageInner.style.transform = 'none';
            nextButton.classList.add("hide");
            backButton.classList.add("hide");
            loader.classList.remove("show");
            openModal('.modal');
        });
    }
}

export {renderPoints, renderImageModal};