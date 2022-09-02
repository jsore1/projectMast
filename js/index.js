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
        this.next = document.createElement('div');
        this.content.append(this.next);
        this.next.dataset.next = true;
        this.next.classList.add('modal__next');
        this.back = document.createElement('div');
        this.content.append(this.back);
        this.back.dataset.back = true;
        this.back.classList.add('modal__back');
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
        this.image = document.createElement('img');
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

fetch('select_points.php', {
    method: 'POST'
}).then(data => data.json())
.then(data => {
    if (data.length > 0) {
        data.forEach((el) => {
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
        modalDialog.createImageDialog();
        const modalNextBtn = document.querySelector('[data-next]');
        const modalBackBtn = document.querySelector('[data-back]');
        modalNextBtn.removeEventListener("click", nextButtonClick);
        modalBackBtn.removeEventListener("click", backButtonClick);
        pointArray.forEach((element, index) => {
            element.addEventListener("mouseenter", () => {
                modalDialog.next.classList.add("hide");
                modalDialog.back.classList.add("hide");
                modalDialog.image.setAttribute("src", `images/icons/spinner.svg`);
                data.forEach((el) => {
                    if ((el.id - 1) === index) {
                        let formData = new FormData();
                        formData.append("id", el.id);
                        fetch('select_images_archive.php', {
                            method: 'POST',
                            body: formData
                        }).then(data => data.json())
                        .then(data => {
                            console.log(data);
                            data.push({
                                url: el.url,
                                description: el.date
                            });
                            modalDialog.image.setAttribute("src", `${data[data.length - 1].url}`);
                            modalDialog.title.textContent = el.title;
                            modalDialog.date.textContent = data[data.length - 1].description;
                            if (data.length > 1) {
                                modalDialog.next.classList.remove("hide");
                                modalDialog.back.classList.remove("hide");
                                let arrIndex = {
                                    index: data.length - 1
                                };
                                modalNextBtn.addEventListener("click", nextButtonClick);
                                modalNextBtn.data = data;
                                modalNextBtn.arrIndex = arrIndex;
                                modalBackBtn.addEventListener("click", backButtonClick);
                                modalBackBtn.data = data;
                                modalBackBtn.arrIndex = arrIndex;
                            }
                        });
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
});

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

function nextButtonClick(event) {
    modalDialog.image.setAttribute("src", `images/icons/spinner.svg`);
    const data = event.target.data;
    event.target.arrIndex.index = (event.target.arrIndex.index === data.length - 1) ? 
        0 : 
        event.target.arrIndex.index + 1;
    modalDialog.image.setAttribute("src", `${data[event.target.arrIndex.index].url}`);
    modalDialog.date.textContent = data[event.target.arrIndex.index].description;
}

function backButtonClick(event) {
    modalDialog.image.setAttribute("src", `images/icons/spinner.svg`);
    const data = event.target.data;
    event.target.arrIndex.index = (event.target.arrIndex.index === 0) ? 
        data.length - 1 : 
        event.target.arrIndex.index - 1;
    modalDialog.image.setAttribute("src", `${data[event.target.arrIndex.index].url}`);
    modalDialog.date.textContent = data[event.target.arrIndex.index].description;
}