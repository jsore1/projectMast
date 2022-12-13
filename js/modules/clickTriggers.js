import {closeModal} from './modal';
import { selectArchiveImages, addPoint, updatePoint } from './requests';

// Функция обработки событий на плане местности
// Принимает 3 параметра:
// pointsArray - Массив с точками
// planSelector - Селектор плана
// pointSelector -  Селектор точек
function mapClickTrigger(pointsArray, planSelector, pointSelector) {
    let isAddPoint = false;
    let isUpdatePoint = false;
    const addCheckbox = document.getElementById("add-point");
    const updateCheckbox = document.getElementById("update-point");

    addCheckbox.addEventListener("change", () => {
        isAddPoint = addCheckbox.checked;
    });
    updateCheckbox.addEventListener("change", () => {
        isUpdatePoint = updateCheckbox.checked;
    });

    const plan = document.querySelector(planSelector);
    plan.addEventListener('click', (event) => {
        const pointId = +event.target.getAttribute("data-id");
        if (isUpdatePoint && (event.target && event.target.className === pointSelector)) {
            let currentDate = new Date();
            event.preventDefault();
            if (confirm("Обновить точку?")) {
                const description = prompt(
                    "Введите дату фото", 
                    `Дата съемки: ${currentDate.getDate()}.${+currentDate.getMonth()+1}.${currentDate.getFullYear()}`
                );
                const pointImgUrl = prompt(
                    "Введите путь к фото", 
                    `images/photo_${currentDate.getDate()}_${+currentDate.getMonth()+1}_${currentDate.getFullYear()}/`
                );
                if (description === null || pointImgUrl === null) {
                    return;
                }
                // Продолжить код с обновлением точки
                updatePoint(pointId, description, pointImgUrl);
            }
        } else if (isAddPoint && (event.target && event.target.tagName === "IMG")) {
            if (confirm("Добавить новую точку на план?")) {
                let currentDate = new Date();
                const top = event.offsetY - 10, left = event.offsetX - 10;
                const pointName = prompt("Введите имя для точки", "имя точки");
                const pointTitle = prompt("Введите название для фото", "название фото");
                const pointDate = prompt(
                    "Введите дату фото",
                    `Дата съемки: ${currentDate.getDate()}.${+currentDate.getMonth()+1}.${currentDate.getFullYear()}`
                );
                const pointImgUrl = prompt(
                    "Введите путь к фото",
                    `images/photo_${currentDate.getDate()}_${+currentDate.getMonth()+1}_${currentDate.getFullYear()}/`
                );
                if (pointName === null || pointTitle === null || pointDate === null || pointImgUrl === null) {
                    return;
                }

                addPoint(left, top, pointName, pointTitle, pointDate,pointImgUrl, plan);
                
            }
        } else {
            if (event.target && event.target.className === pointSelector) {
                selectArchiveImages(pointId, pointsArray);
            }
        }
    });
}

// Функция для обработки событий закрытия модального окна
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