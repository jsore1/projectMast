const clientWidth = 1903;
const clientHeight = 557;
const rightArray = [335, 407, 468, 545, 583, 277, 310, 355, 398, 480, 545, 600];

const pointArray = document.querySelectorAll(".plan__point");
const imageWindowImg = document.querySelector(".image-window").children[0];
const imageWindowTitle = document.querySelector(".image-window__title");
const imageWindowDate = document.querySelector(".image-window__date");

const requestUrl = `https://jsore-games.ru/imagesWindow.json`;

let obj;

let request = new XMLHttpRequest();
request.open('GET', requestUrl);
request.responseType = 'json';
request.send();
request.onload = () => {
    obj = request.response;
    console.log(obj);
}

let requestTable = new XMLHttpRequest();
request.open('GET', `https://jsore-games.ru/table.json`);
request.responseType = 'json';
request.send();
request.onload = () => {
    const obj = request.response;
    //Продолжить заполнение таблицы
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
        console.log(element.style.right);
    });
});