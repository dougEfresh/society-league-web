var DataStore = require('../jsx/stores/DataStore.jsx');

function getSlot(id) {
    var slots = DataStore.getSlots();
    for (var i = 0; i<slots.length; i++) {
        if (slots[i].id == id) {
            return slots[i];
        }
    }
    return undefined;
}

module.exports = {getSlot: getSlot()};