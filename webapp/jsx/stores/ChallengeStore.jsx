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

var _challenge = {
    date: Util.nextChallengeDate(),
    opponent: {user: {id: 0, name: '-----'}},
    slots: [],
    game: defaultGame()
};

var _pending = {

};

var ChallengeStore =  assign({}, EventEmitter.prototype, {

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

    create: function() {

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

    getPending: function() {
        _pending = Util.getData('/api/challenges/pending/' + UserStore.get().id)
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

         case ChallengeConstants.CHALLENGE_OPPONENT_CHANGE:
             ChallengeStore.setOpponent(action.opponent);
             ChallengeStore.emitChange();
             break;

         case ChallengeConstants.CHALLENGE_GAME_CHANGE:
             ChallengeStore.setGame(action.game);
             ChallengeStore.emitChange();
             break;

         case ChallengeConstants.CHALLENGE_CREATE:
             ChallengeStore.create();
             ChallengeStore.emitAdd();
             break;

         default:
     }
});

module.exports = ChallengeStore;
