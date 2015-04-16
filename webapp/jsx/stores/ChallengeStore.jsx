var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var ChallengeConstants = require('../constants/ChallengeConstants.jsx');
var assign = require('object-assign');
var Util = require('../util.jsx');
var UserStore = require('./UserStore.jsx');
var CHANGE_EVENT = 'change';
var ADD_EVENT = 'add';

/**
 * Returns the default game type, which is neither 9 or 8
 * @returns object
 */
function defaultGame() {
    return {
        nine:  {available: false, selected: false},
        eight: {available: false, selected: false}
    };
}

var _default = {
    date: Util.nextChallengeDate(),
    opponent: {user: {id: 0, name: '-----'}},
    slots: [],
    game: defaultGame()
};

var _challenge = _default;

var ChallengeStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    emitAdd: function() {
        this.emit(ADD_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    addListener: function(callback) {
        this.on(ADD_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeAddListener: function(callback) {
        this.removeListener(ADD_EVENT, callback);
    },

    create: function(request) {
        _challenge = _default;
        //TODO Move this to lib
        $.ajax({
            async: true,
            processData: false,
            url: '/api/challenge/request',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(request),
            method: 'post',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    //this.redirect('login');
                }
            },
            success: function (d) {
                console.log("Got " + JSON.stringify(d) + " back from server");
                ChallengeStore.emitAdd();
                ChallengeStore.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                //this.redirect('error');
            }.bind(this)
        });
    },

    changeDate : function(date) {
        _challenge.date = date;        
        _challenge.slots = [];
    },

    addSlots : function(slots) {
        //TODO Optimize
        slots.forEach(function(newSlot) {
            var found = false;
            _challenge.slots.forEach(function(s) {
                if (s.id == newSlot.id) {
                    found = true;
                }
            });
            if (!found) {
                _challenge.slots.push(newSlot);
            }
        });
    },

    removeSlot : function(slot) {
        var newSlots = [];
        _challenge.slots.forEach(function(s){
            if (s.id != slot.id) {
                newSlots.push(s);
            }
        });
        _challenge.slots = newSlots;
    },

    setOpponent: function(opponent) {
        _challenge.opponent = opponent;
        var g = defaultGame();
        if (opponent.nineBallPlayer) {
            g.nine.available = true;
        }
        if (opponent.eightBallPlayer) {
            g.eight.available = true;
        }
        _challenge.game = g;
    },

    setGame: function(game) {
        _challenge.game.nine.selected  = game.nine.selected;
        _challenge.game.eight.selected = game.eight.selected;
    },

    get: function() {
        return _challenge;
    },

    changeStatus: function(status) {
        console.log('Sending ' + JSON.stringify(status));
            //TODO Move this to lib
        $.ajax({
            async: true,
            processData: false,
            url: '/api/challenge/cancel',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(status),
            method: 'post',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    //this.redirect('login');
                }
            },
            success: function (d) {
                console.log("Got " + JSON.stringify(d) + " back from server");
                ChallengeStore.emitAdd();
                ChallengeStore.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                //this.redirect('error');
            }.bind(this)
        });
    }

});

AppDispatcher.register(function(action) {

     switch(action.actionType) {
         case ChallengeConstants.CHALLENGE_DATE_CHANGE:
             ChallengeStore.changeDate(action.date);
             ChallengeStore.emitChange();
             break;

         case ChallengeConstants.CHALLENGE_SLOTS_ADD:
             ChallengeStore.addSlots(action.slots);
             ChallengeStore.emitChange();
             break;

         case ChallengeConstants.CHALLENGE_SLOTS_REMOVE:
             ChallengeStore.removeSlot(action.slot);
             ChallengeStore.emitChange();
             break;

         case ChallengeConstants.OPPONENT_CHANGE:
             ChallengeStore.setOpponent(action.opponent);
             ChallengeStore.emitChange();
             break;

         case ChallengeConstants.CHALLENGE_GAME_CHANGE:
             ChallengeStore.setGame(action.game);
             ChallengeStore.emitChange();
             break;

         case ChallengeConstants.CREATE:
             ChallengeStore.create(action.request);
             break;

         case ChallengeConstants.CHANGE_STATUS:
             ChallengeStore.changeStatus(action.status);
             break;

         default:
     }
});

module.exports = ChallengeStore;
