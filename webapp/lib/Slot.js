function Slot(id,date,allocated) {
    this.id = id;
    this.date = date;
    this.allocated = allocated;
}

Slot.prototype.id = function() {return this.id;};
Slot.prototype.date = function() {return this.date;};
Slot.prototype.allocated = function() {return this.allocated;};
Slot.prototype.getTime = function() {
     var time = this.date.split('T')[1].substr(0,5).split(":");
     var min = (time[0] % 12);
    if (min < 9) {
        min = "0" + min;
    }
    if (min == "00") {
        min = "12";
    }
    return min + ":" + time[1];
};
Slot.prototype.getDate = function() {
    return this.date.split('T')[0];
};
Slot.prototype.getFullDate = function() {return this.getDate() + ' ' + this.getTime()};
Slot.prototype.getRawDate = function() {return this.getDate() + ' ' + this.date.split("T")[1]};

module.exports = Slot;
