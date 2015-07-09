function Slot(id,date,allocated) {
    this.id = id;
    this.date = date;
    this.allocated = allocated;
}

Slot.prototype.id = function() {return this.id;};
Slot.prototype.date = function() {return this.date;};
Slot.prototype.allocated = function() {return this.allocated;};
Slot.prototype.getTime = function() {return this.date.split('T')[1].substr(0,5);};
Slot.prototype.getDate = function() {return this.date.split('T')[0];};
Slot.prototype.getFullDate = function() {return this.getDate() + ' ' + this.getTime()};

module.exports = Slot;
