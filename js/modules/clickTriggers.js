import {renderImageModal} from './render';
import {closeModal} from './modal';

function mapClickTrigger(pointsArray, planSelector, pointSelector) {
    let isAddPoint = false;
    let isUpdatePoint = false;

    // Функция, которая включает добавление точек на план
    const addPointToggle = () => {
        isAddPoint = (isAddPoint) ? false : true;
        console.log(isAddPoint);
    };

    // Функция, которая включает обновление точек на плане
    const updatePointToggle = ()=> {
        isUpdatePoint = (isUpdatePoint) ? false : true;
    };

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

function modalCloseClickTrigger() {
    const modal = document.querySelector(".modal");
    const modalClose = document.querySelector(".modal__close");

    // Закрыть модальное окно, если кликнули на элемент крестик
    modalClose.addEventListener('click', () => closeModal(".modal"));

    // Закрыть модальное окно, если кликнули не на окно
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(".modal");
        }
    });
}

export {mapClickTrigger, modalCloseClickTrigger};