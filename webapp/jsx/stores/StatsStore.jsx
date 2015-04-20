var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';

var _stats = null;

var StatStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    get: function() {
         $.ajax({
            url: '/api/stats',
            dataType: 'json',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                }.bind(this)
            },
            success: function (d) {
                _stats = d;
                StatStore.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('stats', status, err.toString());
                console.log('Redirecting to error');
                //this.redirect('error');
            }.bind(this)
        });

    },

    getStats: function(id) {
        return _stats[id];
    }
});

AppDispatcher.register(function(action) {

     switch(action.actionType) {
         case UserConstants.STATS:
             StatStore.get();
             break;
         default:
     }
});

module.exports = StatStore;
