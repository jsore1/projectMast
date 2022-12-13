//Главный скрипт

import {selectPoints, getTable} from './modules/requests';
import {modalCloseClickTrigger} from './modules/clickTriggers';

//Выполняем все после загрузки дерева DOM
window.addEventListener("DOMContentLoaded", () => {
    // Отрисовка точек на плане
    selectPoints();
    // Отрисовка таблицы с данными обходов
    getTable();
    // Обработчик событий закрытия модальных окон
    modalCloseClickTrigger();
});