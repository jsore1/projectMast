// Модуль со всеми запросами к серверу

import { renderPoints, renderImageModal } from "./render";
import {mapClickTrigger} from "./clickTriggers";

// Запрос на сервер для выбора точек и отрисовки их на плане
function selectPoints() {
    fetch('select_points.php', {
        method: 'POST'
    })
    .then(data => data.json())
    .then(pointsArray => {
        // Отрисовка точек на странице
        renderPoints(pointsArray, '.plan');
        // Обработчик событий плана местности
        mapClickTrigger(pointsArray, '.plan', 'plan__point');
    });
}

// Запрос на сервер для отрисовки таблицы с данными по обходу
function getTable() {
    fetch('get_table.php', {
        method: 'POST'
    })
    .then(data => data.json())
    .then(data => {
        const tbody = document.querySelector(".main-table").children[0].children[1];
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
}

// Запрос на сервер для выборки архивный фото
function selectArchiveImages(pointId, pointsArray) {
    let formData = new FormData();
    formData.append("id", pointId);
    fetch('select_images_archive.php', {
        method: 'POST',
        body: formData
    })
    .then(data => data.json())
    .then(imagesArray => {
        imagesArray.reverse();
        imagesArray.push({
            url: pointsArray[pointId-1].url,
            description: pointsArray[pointId-1].date
        });
        // Отрисовка модального окна с данными точки
        renderImageModal(pointsArray, pointId, imagesArray.reverse());
    });
}

// Запрос на сервер для добавление точки в базу данных
function addPoint(left, top, pointName, pointTitle, pointDate,pointImgUrl, plan) {
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

// Запрос на сервер для обновление точки в базе данных
function updatePoint(pointId, description, pointImgUrl) {
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

export {selectPoints, getTable, selectArchiveImages, addPoint, updatePoint};