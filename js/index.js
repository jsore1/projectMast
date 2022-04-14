const clientWidth = 1903;
const clientHeight = 557;
const rightArray = [335, 407, 468, 545, 583, 277, 310, 355, 398, 480, 545, 600];

const pointArray = document.querySelectorAll(".plan__point");

window.addEventListener("resize", () => {
    pointArray.forEach((element, index) => {
        element.style.right = rightArray[index] + (document.documentElement.clientWidth - clientWidth)/4 + "px";
        console.log(element.style.right);
    });
});