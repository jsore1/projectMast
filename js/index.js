class Modal {
    constructor() {
        this.modal = document.createElement('div');
        document.body.append(this.modal);
        this.modal.classList.add('modal');
        this.dialog = document.createElement('div');
        this.modal.append(this.dialog);
        this.dialog.classList.add('modal__dialog');
        this.content = document.createElement('div');
        this.dialog.append(this.content);
        this.content.classList.add('modal__content');
        this.close = document.createElement('div');
        this.content.append(this.close);
        this.close.dataset.close = true;
        this.close.classList.add('modal__close');
        this.close.innerHTML = '&times;';
        this.title = document.createElement('div');
        this.content.append(this.title);
        this.title.classList.add('modal__title');
    }
    
    createReportDialog() {
        if (this.image) {this.image.remove();}
        if (this.date) {this.date.remove();}
        if (this.text) {this.text.remove();}
        this.text = document.createElement('div');
        this.content.append(this.text);
        this.text.classList.add('modal__text');
    }

    createImageDialog() {
        if (this.text) {this.text.remove();}
        if (this.image) {this.image.remove();}
        if (this.date) {this.date.remove();}
        this.image = document.createElement('div');
        this.image.classList.add('modal__img');
        this.content.prepend(this.image);
        this.date = document.createElement('div');
        this.content.append(this.date);
        this.date.classList.add('modal__date');
    }
}
let isAddPoint = false;
let isUpdatePoint = false;

const modalDialog = new Modal();

const tbody = document.querySelector(".main-table").children[0].children[1],
    plan = document.querySelector(".plan");
let modalTrigger = document.querySelectorAll('[data-modal]');
let modalTriggerImg = document.querySelectorAll('[data-modal]');

let requestSelect = new XMLHttpRequest();
requestSelect.open('POST', 'select_points.php');
requestSelect.responseType = 'json';
requestSelect.send();
requestSelect.onload = () => {
    const array = requestSelect.response;
    if (array.length > 0) {
        array.forEach((el) => {
            plan.insertAdjacentHTML(
                "beforeend",
                `<a href="#" data-modal>
                    <div class="plan__point" style="top: ${el.y}px;left: ${el.x}px">
                        <span>${el.name}</span>
                    </div>
                </a>`
            );
        });
        const pointArray = document.querySelectorAll(".plan__point");
        pointArray.forEach((element, index) => {
            element.addEventListener("mouseenter", () => {
                modalDialog.createImageDialog();
                array.forEach((el) => {
                    if ((el.id - 1) === index) {
                        //modalDialog.image.src = `${el.url}`;
                        modalDialog.image.style.background = `url(${el.url}) center center/cover no-repeat`;
                        console.log("text");
                        modalDialog.title.textContent = el.title;
                        modalDialog.date.textContent = el.date;
                    }
                });
            });
            element.addEventListener("click", (event) => {
                if (isUpdatePoint) {
                    event.preventDefault();
                    if (confirm("Обновить точку?")) {
                        const pointDate = prompt("Введите дату фото","Последняя дата съемки: dd.mm.yyyy");
                        const pointImgUrl = prompt("Введите путь к фото","images/.jpg");
                        if (pointDate === null || pointImgUrl === null) {
                            return;
                        }
                        // Продолжить код с обновлением точки
                        let request = new XMLHttpRequest();
                        request.open('POST', 'update_point.php');
                        let formData = new FormData();
                        formData.append("id", index + 1);
                        formData.append("date", pointDate);
                        formData.append("url", pointImgUrl);
                        request.send(formData);
                        request.onload = () => {
                            if (request.response === "1") {
                                console.log("Точка обновлена!");
                            }
                        };
                    }
                }
            });
        });
        modalTriggerImg = document.querySelectorAll('[data-modal]');

        modalTriggerImg.forEach(btn => {
            btn.addEventListener('click', function() {
                modalDialog.modal.classList.add('show');
                modalDialog.modal.classList.remove('hide');
            });
        });
    }
};


plan.addEventListener("click", (event) => {
    if (isAddPoint) {
        if (confirm("Добавить новую точку на план?")) {
            const top = event.offsetY - 10, left = event.offsetX - 10;
            const pointName = prompt("Введите имя для точки", "имя точки");
            const pointTitle = prompt("Введите название для фото", "название фото");
            const pointDate = prompt("Введите дату фото","Последняя дата съемки: dd.mm.yyyy");
            const pointImgUrl = prompt("Введите путь к фото","images/.jpg");
            if (pointName === null || pointTitle === null || pointDate === null || pointImgUrl === null) {
                return;
            }
            let request = new XMLHttpRequest();
            request.open('POST', 'add_point.php');
            let formData = new FormData();
            formData.append("x", left);
            formData.append("y", top);
            formData.append("name", pointName);
            formData.append("title", pointTitle);
            formData.append("date", pointDate);
            formData.append("url", pointImgUrl);
            request.send(formData);
            request.onload = () => {
                if (request.response === "1") {
                    console.log("Точка добавлена!");
                    plan.insertAdjacentHTML(
                        "beforeend",
                        `<a href="#" data-modal>
                            <div class="plan__point" style="top: ${top}px;left: ${left}px">
                                <span>${pointName}</span>
                            </div>
                        </a>`
                    );
                }
            };
        }
    }
});

let requestTable = new XMLHttpRequest();
requestTable.open('GET', `table.json`);
requestTable.responseType = 'json';
requestTable.send();
requestTable.onload = () => {
    const obj = requestTable.response;

    obj.table.forEach((el, index) => {
        const report = (el.report) ? `<a href="#" data-modal>Открыть</a>` : ``;
        const tr = `<tr>
                        <td>${el.date}</td>
                        <td>${el.numberObj}</td>
                        <td>${el.descr}</td>
                        <td>${el.secondName}</td>
                        <td>${report}</td>
                    </tr>`;
        tbody.insertAdjacentHTML('beforeend', tr);

        if (el.report) {
            tbody.children[index].children[4].children[0].addEventListener("mouseenter", () => {
                modalDialog.createReportDialog();
                modalDialog.title.textContent = 'Отчет';
                modalDialog.text.textContent = el.reportText;
            });
        }
    });
    modalTrigger = document.querySelectorAll('[data-modal]');

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', function() {
            modalDialog.modal.classList.add('show');
            modalDialog.modal.classList.remove('hide');
        });
    });
};

// Функция, которая закрывает модальное окно
function closeModal() {
    modalDialog.modal.classList.add('hide');
    modalDialog.modal.classList.remove('show');
}

modalDialog.close.addEventListener('click', closeModal);

modalDialog.modal.addEventListener('click', (e) => {
    if (e.target === modalDialog.modal) {
        closeModal();
    }
});

function addPointToggle() {
    isAddPoint = (isAddPoint) ? false : true;
}

function updatePointToggle() {
    isUpdatePoint = (isUpdatePoint) ? false : true;
}