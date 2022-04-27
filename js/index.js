let isAddPoint = false;
let isUpdatePoint = false;

const imageWindowImg = document.querySelector(".image-window").children[0];
const imageWindowTitle = document.querySelector(".image-window__title");
const imageWindowDate = document.querySelector(".image-window__date");
const tbody = document.querySelector(".main-table").children[0].children[1];
const reportWindowPanel = document.querySelector(".report-window__panel").children[1];
const plan = document.querySelector(".plan");

let requestSelect = new XMLHttpRequest();
requestSelect.open('POST', 'select_points.php');
requestSelect.responseType = 'json';
requestSelect.send();
requestSelect.onload = () => {
    const array = requestSelect.response;
    if (array.length > 0) {
        array.forEach((el) => {
            plan.insertAdjacentHTML("beforeend",`<a href="#image-window"><div class="plan__point" style="top: ${el.y}px;left: ${el.x}px"><span>${el.name}</span></div></a>`);
        });
        const pointArray = document.querySelectorAll(".plan__point");
        pointArray.forEach((element, index) => {
            element.addEventListener("mouseenter", () => {
                array.forEach((el) => {
                    if ((el.id - 1) === index) {
                        imageWindowImg.src = el.url;
                        imageWindowTitle.innerText = el.title;
                        imageWindowDate.innerText = el.date;
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
                        }
                    }
                }
            });
        });
    }
}


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
                    plan.insertAdjacentHTML("beforeend",`<a href="#image-window"><div class="plan__point" style="top: ${top}px;left: ${left}px"><span>${pointName}</span></div></a>`);
                }
            }
        }
    }
});

//const requestUrl = `https://jsore-games.ru/imagesWindow.json`;

//let obj;

//let request = new XMLHttpRequest();
//request.open('GET', requestUrl);
//request.responseType = 'json';
//request.send();
//request.onload = () => {
    //obj = request.response;
//}

let requestTable = new XMLHttpRequest();
requestTable.open('GET', `table.json`);
requestTable.responseType = 'json';
requestTable.send();
requestTable.onload = () => {
    const obj = requestTable.response;

    obj.table.forEach((el, index) => {
        const report = (el.report) ? `<a href="#report-window">Открыть</a>` : ``;
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
                reportWindowPanel.innerText = el.reportText;
            });
        }
    });
}

function addPointToggle() {
    isAddPoint = (isAddPoint) ? false : true;
}

function updatePointToggle() {
    isUpdatePoint = (isUpdatePoint) ? false : true;
}