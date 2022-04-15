const clientWidth = 1903;
const clientHeight = 557;
const rightArray = [335, 407, 468, 545, 583, 277, 310, 355, 398, 480, 545, 600];

const pointArray = document.querySelectorAll(".plan__point");
const imageWindowImg = document.querySelector(".image-window").children[0];
const imageWindowTitle = document.querySelector(".image-window__title");
const imageWindowDate = document.querySelector(".image-window__date");
const tbody = document.querySelector(".main-table").children[0].children[1];
const reportWindowPanel = document.querySelector(".report-window__panel").children[1];

const requestUrl = `https://jsore-games.ru/imagesWindow.json`;

let obj;

let request = new XMLHttpRequest();
request.open('GET', requestUrl);
request.responseType = 'json';
request.send();
request.onload = () => {
    obj = request.response;
}

let requestTable = new XMLHttpRequest();
requestTable.open('GET', `https://jsore-games.ru/table.json`);
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

pointArray.forEach((element, index) => {
    element.addEventListener("mouseenter", () => {
        obj.imagesWindow.forEach((el) => {
            if (el.id === index) {
                imageWindowImg.src = el.urlImage;
                imageWindowTitle.innerText = el.title;
                imageWindowDate.innerText = el.date;
            }
        });
    });
});

window.addEventListener("resize", () => {
    pointArray.forEach((element, index) => {
        element.style.right = rightArray[index] + (document.documentElement.clientWidth - clientWidth)/4 + "px";
    });
});