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

function slider(data, modalDate) {
    const width = window.getComputedStyle(document.querySelector(".modal__image-wrapper")).width,
          nextButton = document.querySelector(".modal__next"),
          backButton = document.querySelector(".modal__back"),
          modalImageInner = document.querySelector(".modal__image-inner");

    let offset = +width.slice(0, width.length - 2) * (data.length - 1);
    let imageId = data.length - 1;
    modalImageInner.style.transform = `translateX(-${offset}px)`;
    nextButton.addEventListener("click", () => {
        modalImageInner.style.transition = "0.5s all";
        if (offset == (+width.slice(0, width.length - 2) * (data.length - 1))) {
            offset = 0;
            imageId = data.length - 1;
        } else {
            offset += +width.slice(0, width.length - 2);
            imageId -= 1;
        }

        modalImageInner.style.transform = `translateX(-${offset}px)`;
        modalDate.textContent = data[imageId].description;
    });
    backButton.addEventListener("click", () => {
        modalImageInner.style.transition = "0.5s all";
        if (offset == 0) {
            offset = +width.slice(0, width.length - 2) * (data.length - 1);
            imageId = 0;
        } else {
            offset -= +width.slice(0, width.length - 2);
            imageId += 1;
        }

        modalImageInner.style.transform = `translateX(-${offset}px)`;
        modalDate.textContent = data[imageId].description;
    });
}

function renderImageModal(pointsArray, pointId, data) {
    const modalText = document.querySelector(".modal__text"),
          modalTitle = document.querySelector(".modal__title"),
          modalDate = document.querySelector(".modal__date"),
          modalImageInner = document.querySelector(".modal__image-inner"),
          imagesPromiseArray = [];

    clearImages();
    modalText.classList.add("hide");
    modalTitle.textContent = pointsArray[pointId-1].title;
    modalDate.textContent = data[0].description;
    modalImageInner.style.width = `${data.length * 100}%`;
    if (data.length > 1) {
        data.forEach((el, index) => {
            imagesPromiseArray.push(createImage(data[index].url, modalImageInner));
        });
        Promise.all(imagesPromiseArray)
        .then(promiseArray => {
            openModal('.modal');
            slider(data, modalDate);
        });
    }
}

function pointClickTrigger(pointsArray, planSelector, pointSelector) {
    const plan = document.querySelector(planSelector);
    plan.addEventListener('click', (event) => {
        const pointId = +event.target.getAttribute("data-id");
        console.log(event.target);
        if (event.target && event.target.className === pointSelector) {
            let formData = new FormData();
            formData.append("id", pointId);
            fetch('select_images_archive.php', {
                method: 'POST',
                body: formData
            })
            .then(data => data.json())
            .then(data => {
                data.push({
                    url: pointsArray[pointId-1].url,
                    description: pointsArray[pointId-1].date
                });
                renderImageModal(pointsArray, pointId, data.reverse());
            });
        }
    });
    // pointArray.forEach((element, index) => {
    //     element.addEventListener("mouseenter", () => {
    //         modalDialog.next.removeEventListener("click", nextButtonClick);
    //         modalDialog.back.removeEventListener("click", backButtonClick);
    //         data.forEach((el) => {
    //             if ((el.id - 1) === index) {
    //                 let formData = new FormData();
    //                 formData.append("id", el.id);
    //                 fetch('select_images_archive.php', {
    //                     method: 'POST',
    //                     body: formData
    //                 }).then(data => data.json())
    //                 .then(data => {
    //                     data.push({
    //                         url: el.url,
    //                         description: el.date
    //                     });
    //                     modalDialog.title.textContent = el.title;
    //                     modalDialog.date.textContent = data[data.length - 1].description;
    //                     if (data.length > 1) {
    //                         modalDialog.images = [];
    //                         data.forEach((el) => {
    //                             modalDialog.images.push(document.createElement("img"));
    //                         });
    //                         modalDialog.images.forEach((el, index) => {
    //                             el.classList.add('modal__img');
    //                             modalDialog.imageWrapper.prepend(el);
    //                             el.setAttribute("src", `${data[index].url}`);
    //                         });
    //                         let arrIndex = {
    //                             index: data.length - 1
    //                         };
    //                         modalDialog.next.addEventListener("click", nextButtonClick);
    //                         modalDialog.next.data = data;
    //                         modalDialog.next.arrIndex = arrIndex;
    //                         modalDialog.back.addEventListener("click", backButtonClick);
    //                         modalDialog.back.data = data;
    //                         modalDialog.back.arrIndex = arrIndex;
    //                     } else {
    //                         modalDialog.images = [];
    //                         modalDialog.images.push(document.createElement("img"));
    //                         modalDialog.images[0].classList.add('modal__img');
    //                         modalDialog.imageWrapper.prepend(modalDialog.images[0]);
    //                         modalDialog.images[0].setAttribute("src", `${data[0].url}`);
    //                         modalDialog.next.remove();
    //                         modalDialog.back.remove();
    //                     }
    //                 });
    //             }
    //         });
    //     });
    //     element.addEventListener("click", (event) => {
    //         if (isUpdatePoint) {
    //             event.preventDefault();
    //             if (confirm("Обновить точку?")) {
    //                 const description = prompt("Введите дату фото", "Дата съемки: dd.mm.yyyy");
    //                 const pointImgUrl = prompt("Введите путь к фото", "images/photo_dd_mm_yy/.jpg");
    //                 if (description === null || pointImgUrl === null) {
    //                     return;
    //                 }
    //                 // Продолжить код с обновлением точки
    //                 let request = new XMLHttpRequest();
    //                 request.open('POST', 'update_point.php');
    //                 let formData = new FormData();
    //                 formData.append("id", index + 1);
    //                 formData.append("description", description);
    //                 formData.append("url", pointImgUrl);
    //                 request.send(formData);
    //                 request.onload = () => {
    //                     if (request.response === "1") {
    //                         console.log("Точка обновлена!");
    //                     }
    //                 };
    //             }
    //         } else {
    //             openModal();
    //         }
    //     });
    // });
}

fetch('select_points.php', {
    method: 'POST'
})
.then(data => data.json())
.then(data => {
    renderPoints(data, '.plan');
    pointClickTrigger(data, '.plan', 'plan__point');
});

// plan.addEventListener("click", (event) => {
//     if (isAddPoint) {
//         if (confirm("Добавить новую точку на план?")) {
//             const top = event.offsetY - 10, left = event.offsetX - 10;
//             const pointName = prompt("Введите имя для точки", "имя точки");
//             const pointTitle = prompt("Введите название для фото", "название фото");
//             const pointDate = prompt("Введите дату фото","Последняя дата съемки: dd.mm.yyyy");
//             const pointImgUrl = prompt("Введите путь к фото","images/.jpg");
//             if (pointName === null || pointTitle === null || pointDate === null || pointImgUrl === null) {
//                 return;
//             }
//             let request = new XMLHttpRequest();
//             request.open('POST', 'add_point.php');
//             let formData = new FormData();
//             formData.append("x", left);
//             formData.append("y", top);
//             formData.append("name", pointName);
//             formData.append("title", pointTitle);
//             formData.append("date", pointDate);
//             formData.append("url", pointImgUrl);
//             request.send(formData);
//             request.onload = () => {
//                 if (request.response === "1") {
//                     console.log("Точка добавлена!");
//                     plan.insertAdjacentHTML(
//                         "beforeend",
//                         `<a href="#" data-modal>
//                             <div class="plan__point" style="top: ${top}px;left: ${left}px">
//                                 <span>${pointName}</span>
//                             </div>
//                         </a>`
//                     );
//                 }
//             };
//         }
//     }
// });

fetch('get_table.php', {
    method: 'POST'
})
.then(data => data.json())
.then(data => {
    data.reverse().forEach((el, index) => {
        const report = (el.reportBool) ? `<a href="#" data-modal>Открыть</a>` : ``;
        const tr = `<tr>
                        <td>${el.date}</td>
                        <td>${el.numberObject}</td>
                        <td>${el.description}</td>
                        <td>${el.secondName}</td>
                        <td>${report}</td>
                    </tr>`;
        tbody.insertAdjacentHTML('beforeend', tr);

        if (el.reportBool) {
            tbody.children[index].children[4].children[0].addEventListener("mouseenter", () => {
                modalDialog.createReportDialog();
                modalDialog.title.textContent = 'Отчет';
                modalDialog.text.textContent = el.reportText;
            });
        }
    });
    const modalTrigger = document.querySelector('[data-modal]');

    modalTrigger.addEventListener('click', function() {
        openModal(".modal");
    });
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
}

// Функция, которая включает обновление точек на плане
function updatePointToggle() {
    isUpdatePoint = (isUpdatePoint) ? false : true;
}