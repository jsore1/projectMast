/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/clickTriggers.js":
/*!*************************************!*\
  !*** ./js/modules/clickTriggers.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "mapClickTrigger": () => (/* binding */ mapClickTrigger),
/* harmony export */   "modalCloseClickTrigger": () => (/* binding */ modalCloseClickTrigger)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./js/modules/render.js");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");



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
                    (0,_render__WEBPACK_IMPORTED_MODULE_0__.renderImageModal)(pointsArray, pointId, imagesArray.reverse());
                });
            }
        }
    });
}

function modalCloseClickTrigger() {
    const modal = document.querySelector(".modal");
    const modalClose = document.querySelector(".modal__close");

    // Закрыть модальное окно, если кликнули на элемент крестик
    modalClose.addEventListener('click', () => (0,_modal__WEBPACK_IMPORTED_MODULE_1__.closeModal)(".modal"));

    // Закрыть модальное окно, если кликнули не на окно
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            (0,_modal__WEBPACK_IMPORTED_MODULE_1__.closeModal)(".modal");
        }
    });
}



/***/ }),

/***/ "./js/modules/image.js":
/*!*****************************!*\
  !*** ./js/modules/image.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clearImages": () => (/* binding */ clearImages),
/* harmony export */   "createImage": () => (/* binding */ createImage)
/* harmony export */ });
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



/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "closeModal": () => (/* binding */ closeModal),
/* harmony export */   "openModal": () => (/* binding */ openModal)
/* harmony export */ });
// Функция, которая открывает модальное окно
function openModal(modalSelector) {
    document.querySelector(modalSelector).classList.add('show');
}

// Функция, которая закрывает модальное окно
function closeModal(modalSelector) {
    document.querySelector(modalSelector).classList.remove('show');
    document.querySelector(".modal__image-inner").style.transition = "none";
}



/***/ }),

/***/ "./js/modules/render.js":
/*!******************************!*\
  !*** ./js/modules/render.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderImageModal": () => (/* binding */ renderImageModal),
/* harmony export */   "renderPoints": () => (/* binding */ renderPoints)
/* harmony export */ });
/* harmony import */ var _slider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./slider */ "./js/modules/slider.js");
/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./image */ "./js/modules/image.js");
/* harmony import */ var _modal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modal */ "./js/modules/modal.js");




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

function renderImageModal(pointsArray, pointId, imagesArray) {
    const modalText = document.querySelector(".modal__text"),
          modalTitle = document.querySelector(".modal__title"),
          modalDate = document.querySelector(".modal__date"),
          modalImageInner = document.querySelector(".modal__image-inner"),
          nextButton = document.querySelector(".modal__next"),
          backButton = document.querySelector(".modal__back"),
          loader = document.querySelector(".loader"),
          imagesPromiseArray = [];

    (0,_image__WEBPACK_IMPORTED_MODULE_1__.clearImages)();
    modalText.classList.add("hide");
    modalTitle.textContent = pointsArray[pointId-1].title;
    modalDate.textContent = imagesArray[0].description;
    modalImageInner.style.width = `${imagesArray.length * 100}%`;
    loader.classList.add("show");
    if (imagesArray.length > 1) {
        imagesArray.forEach((el, index) => {
            imagesPromiseArray.push((0,_image__WEBPACK_IMPORTED_MODULE_1__.createImage)(imagesArray[index].url, modalImageInner));
        });
        Promise.all(imagesPromiseArray)
        .then(() => {
            loader.classList.remove("show");
            (0,_modal__WEBPACK_IMPORTED_MODULE_2__.openModal)('.modal');
            (0,_slider__WEBPACK_IMPORTED_MODULE_0__["default"])(imagesArray);
        });
    } else {
        (0,_image__WEBPACK_IMPORTED_MODULE_1__.createImage)(imagesArray[0].url, modalImageInner)
        .then(() => {
            modalImageInner.style.transform = 'none';
            nextButton.classList.add("hide");
            backButton.classList.add("hide");
            loader.classList.remove("show");
            (0,_modal__WEBPACK_IMPORTED_MODULE_2__.openModal)('.modal');
        });
    }
}



/***/ }),

/***/ "./js/modules/requests.js":
/*!********************************!*\
  !*** ./js/modules/requests.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getTable": () => (/* binding */ getTable),
/* harmony export */   "selectPoints": () => (/* binding */ selectPoints)
/* harmony export */ });
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./js/modules/render.js");
/* harmony import */ var _clickTriggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./clickTriggers */ "./js/modules/clickTriggers.js");



function selectPoints() {
    fetch('select_points.php', {
        method: 'POST'
    })
    .then(data => data.json())
    .then(pointsArray => {
        (0,_render__WEBPACK_IMPORTED_MODULE_0__.renderPoints)(pointsArray, '.plan');
        (0,_clickTriggers__WEBPACK_IMPORTED_MODULE_1__.mapClickTrigger)(pointsArray, '.plan', 'plan__point');
    });
}

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



/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
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

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (slider);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _modules_requests__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/requests */ "./js/modules/requests.js");
/* harmony import */ var _modules_clickTriggers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/clickTriggers */ "./js/modules/clickTriggers.js");



window.addEventListener("DOMContentLoaded", () => {
    (0,_modules_requests__WEBPACK_IMPORTED_MODULE_0__.selectPoints)();
    (0,_modules_requests__WEBPACK_IMPORTED_MODULE_0__.getTable)();
    (0,_modules_clickTriggers__WEBPACK_IMPORTED_MODULE_1__.modalCloseClickTrigger)();
});
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map