// Функция слайдер фотографий
// Принимает параметр с массивом данных по точке
function slider(imagesArray) {
    const width = window.getComputedStyle(document.querySelector(".modal__image-wrapper")).width,
          nextButton = document.querySelector(".modal__next"),
          backButton = document.querySelector(".modal__back"),
          modalImageInner = document.querySelector(".modal__image-inner"),
          modalDate = document.querySelector(".modal__date");

    nextButton.classList.remove("hide");
    backButton.classList.remove("hide");
    let offset = +width.slice(0, width.length - 2) * (imagesArray.length - 1);
    let imageId = 0;
    modalImageInner.style.transform = `translateX(-${offset}px)`;
    nextButton.addEventListener("click", () => {
        modalImageInner.style.transition = "0.5s all";
        if (+offset.toFixed(1) == +(+width.slice(0, width.length - 2) * (imagesArray.length - 1)).toFixed(1)) {
            offset = 0;
            imageId = imagesArray.length - 1;
        } else {
            offset += +width.slice(0, width.length - 2);
            imageId -= 1;
        }
        
        modalImageInner.style.transform = `translateX(-${offset}px)`;
        modalDate.textContent = imagesArray[imageId].description;
    });
    backButton.addEventListener("click", () => {
        modalImageInner.style.transition = "0.5s all";
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (imagesArray.length - 1);
            imageId = 0;
        } else {
            offset -= +width.slice(0, width.length - 2);
            imageId += 1;
        }

        modalImageInner.style.transform = `translateX(-${offset}px)`;
        modalDate.textContent = imagesArray[imageId].description;
    });
}

export default slider;