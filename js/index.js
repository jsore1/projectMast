let isAddPoint = false;
let isUpdatePoint = false;

const tbody = document.querySelector(".main-table").children[0].children[1];
const modal = document.querySelector(".modal");
const modalClose = document.querySelector(".modal__close");

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

function clearImages() {
    const modalImageCards = document.querySelectorAll(".modal__image-card");
    modalImageCards.forEach((card) => {
        card.remove();
    });
}

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

function pointClickTrigger(pointsArray, planSelector, pointSelector) {
    const plan = document.querySelector(planSelector);
    plan.addEventListener('click', (event) => {
        const pointId = +event.target.getAttribute("data-id");
        if (isUpdatePoint && (event.target && event.target.className === pointSelector)) {
            event.preventDefault();
            if (confirm("Обновить точку?")) {
                const description = prompt("Введите дату фото", "Дата съемки: dd.mm.yyyy");
                const pointImgUrl = prompt("Введите путь к фото", "images/photo_dd_mm_yy/.jpg");
                if (description === null || pointImgUrl === null) {
                    return;
                }
                // Продолжить код с обновлением точки
                let formData = new FormData();
                formData.append("id", pointId);
                formData.append("description", description);
                formData.append("url", pointImgUrl);
                fetch('update_point.php', {
                    method: 'POST',
                    body: formData
                })
                .then(data => data.text())
                .then((response) => {
                    if (response === "1") {
                        console.log("Точка обновлена!");
                    }
                });
            }
        } else if (isAddPoint && (event.target && event.target.tagName === "IMG")) {
            if (confirm("Добавить новую точку на план?")) {
                const top = event.offsetY - 10, left = event.offsetX - 10;
                const pointName = prompt("Введите имя для точки", "имя точки");
                const pointTitle = prompt("Введите название для фото", "название фото");
                const pointDate = prompt("Введите дату фото","Последняя дата съемки: dd.mm.yyyy");
                const pointImgUrl = prompt("Введите путь к фото","images/.jpg");
                if (pointName === null || pointTitle === null || pointDate === null || pointImgUrl === null) {
                    return;
                }

                let formData = new FormData();
                formData.append("x", left);
                formData.append("y", top);
                formData.append("name", pointName);
                formData.append("title", pointTitle);
                formData.append("date", pointDate);
                formData.append("url", pointImgUrl);

                fetch("add_point.php", {
                    method: 'POST',
                    body: formData
                })
                .then(data => data.text())
                .then((response) => {
                    if (response === "1") {
                        console.log("Точка добавлена!");
                        // Добавить data-id из add_points.php
                        plan.insertAdjacentHTML(
                            "beforeend",
                            `<div class="plan__point" style="top: ${top}px;left: ${left}px" data-id="">
                                    <span>${pointName}</span>
                                </div>`
                        );
                    }
                });
            }
        } else {
            if (event.target && event.target.className === pointSelector) {
                let formData = new FormData();
                formData.append("id", pointId);
                fetch('select_images_archive.php', {
                    method: 'POST',
                    body: formData
                })
                .then(data => data.json())
                .then(imagesArray => {
                    imagesArray.push({
                        url: pointsArray[pointId-1].url,
                        description: pointsArray[pointId-1].date
                    });
                    renderImageModal(pointsArray, pointId, imagesArray.reverse());
                });
            }
        }
    });
}

fetch('select_points.php', {
    method: 'POST'
})
.then(data => data.json())
.then(pointsArray => {
    renderPoints(pointsArray, '.plan');
    pointClickTrigger(pointsArray, '.plan', 'plan__point');
});

fetch('get_table.php', {
    method: 'POST'
})
.then(data => data.json())
.then(data => {
    data.reverse().forEach((el, index) => {
        // const report = (el.reportBool) ? `<a href="#" data-modal>Открыть</a>` : ``;
        const tr = `<tr>
                        <td>${el.date}</td>
                        <td>${el.numberObject}</td>
                        <td>${el.description}</td>
                        <td>${el.secondName}</td>
                    </tr>`;
        tbody.insertAdjacentHTML('beforeend', tr);

        // if (el.reportBool) {
        //     tbody.children[index].children[4].children[0].addEventListener("mouseenter", () => {
        //         modalDialog.createReportDialog();
        //         modalDialog.title.textContent = 'Отчет';
        //         modalDialog.text.textContent = el.reportText;
        //     });
        // }
    });
    //const modalTrigger = document.querySelector('[data-modal]');

    //modalTrigger.addEventListener('click', function() {
        //openModal(".modal");
    //});
});

// Функция, которая открывает модальное окно
function openModal(modalSelector) {
    document.querySelector(modalSelector).classList.add('show');
}

// Функция, которая закрывает модальное окно
function closeModal(modalSelector) {
    document.querySelector(modalSelector).classList.remove('show');
    document.querySelector(".modal__image-inner").style.transition = "none";
}

// Закрыть модальное окно, если кликнули на элемент крестик
modalClose.addEventListener('click', () => closeModal(".modal"));

// Закрыть модальное окно, если кликнули не на окно
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal(".modal");
    }
});

// Функция, которая включает добавление точек на план
function addPointToggle() {
    isAddPoint = (isAddPoint) ? false : true;
    console.log(isAddPoint);
}

// Функция, которая включает обновление точек на плане
function updatePointToggle() {
    isUpdatePoint = (isUpdatePoint) ? false : true;
}