var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var UserConstants = require('../constants/UserConstants.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';

var _store = {};

function createStore(url) {
    _store[url] = {};
    var Store = assign({}, EventEmitter.prototype, {
        emitChange: function() {
            this.emit(CHANGE_EVENT);
        },
        addChangeListener: function(callback) {
            this.on(CHANGE_EVENT, callback);
        },
        removeChangeListener: function(callback) {
            this.removeListener(CHANGE_EVENT, callback);
        },
        getFromServer: function() {
            console.log('getting ' + url);
            $.ajax({
                url: url,
                dataType: 'json',
                statusCode: {
                    401: function () {
                    console.log('I Need to Authenticate');
                }.bind(this)
            },
            success: function (d) {
                _store[url] = d;
                Store.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                console.log('Redirecting to error');
                //this.redirect('error');
            }.bind(this)
        });
    },
        get: function(id) {
            return _store[url][id];
        },
        getAll: function() {
            return _store[url];
        }
    });
    return Store;
}

module.exports = {
    divisions: createStore('/api/divisions'),
    teams: createStore('/api/teams'),
    players: createStore('/api/players'),
    seasons: createStore('/api/seasons'),
    users: createStore('/api/users')
};
