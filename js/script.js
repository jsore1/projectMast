import {selectPoints, getTable} from './modules/requests';
import {modalCloseClickTrigger} from './modules/clickTriggers';

window.addEventListener("DOMContentLoaded", () => {
    selectPoints();
    getTable();
    modalCloseClickTrigger();
});