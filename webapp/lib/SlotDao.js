function SlotDao(db) {
    this.db = db;
};

SlotDao.prototype.db = function() {return this.db;};

SlotDao.prototype.getSlot = function(id) {
    var slots = this.db.getSlots();
    for (var i = 0; i<slots.length; i++) {
        if (slots[i].id == id) {
            return slots[i];
        }
    }
    return undefined;
};

SlotDao.prototype.getSlots = function() {
    return this.db.getSlots();
};

module.exports = SlotDao;