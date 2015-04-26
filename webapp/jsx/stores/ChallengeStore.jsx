var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var ChallengeConstants = require('../constants/ChallengeConstants.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var assign = require('object-assign');
var UserStore = require('./UserStore.jsx');
var CHANGE_EVENT = 'change';
var ADD_EVENT = 'add';
var ChallengeActions = require('../actions/ChallengeActions.jsx');
var ChallengeGroupStore = require('./ChallengeGroupStore.jsx');

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
function defaultOpponent() {return {user: {id: 0, name: '-----'}}}
function defaultRequest() {
    return  {
        date: undefined,
        opponent: defaultOpponent(),
        slots: [],
        game: defaultGame(),
        anySlot: false
    };
}

var _challenges = {};
_challenges[ChallengeStatus.PENDING] = [];
_challenges[ChallengeStatus.NOTIFY] = [];
_challenges[ChallengeStatus.CANCELLED] = [];
_challenges[ChallengeStatus.SENT] = [];
_challenges[ChallengeStatus.ACCEPTED] = [];

var _request = defaultRequest();

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
    addRequestListener: function(callback) {
        this.on(ADD_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeRequestListener: function(callback) {
        this.removeListener(ADD_EVENT, callback);
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
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    newChallenge: function(request) {
        //TODO Move this to lib
        //TODO ADD UserId to URL
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
                _challenges = d;
                _request.opponent = defaultOpponent();
                _request.anySlot = false;
                _request.slots.forEach(function(s) {
                    s.selected = false;
                });
                _request.game = defaultGame();
                ChallengeStore.emitAdd();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('/api/challenge/request', status, err.toString());
                //this.redirect('error');
            }.bind(this)
        });
    },

    changeDate : function(date) {
        _request.date = date;
        _request.slots = [];
        this.getSlots();
    },

    getSlots: function() {
        console.log("Getting data from " + window.location.origin + '/api/challenge/slot/');
        $.ajax({
            url: '/api/challenge/slots/' + _request.date,
            dataType: 'json',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                }.bind(this)
            },
            success: function (d) {
                d.forEach(function(s){
                    s.selected = false;
                });
                _request.slots = d;
                ChallengeStore.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('slots', status, err.toString());
                console.log('Redirecting to error');
                //this.redirect('error');
            }.bind(this)
        });
    },

    anySlot: function(anySlot,slots) {
        _request.anySlot = anySlot;
        slots.forEach(function(s) {
            s.selected = anySlot;
        })
    },

    getAllChallenges: function() {
        return _challenges;
    },

    getChallenges: function(type) {
        return _challenges[type];
    },

    initChallenges: function(userId) {
        console.log("Getting data from " + window.location.origin + '/api/challenge/' + userId);
         $.ajax({
            url: '/api/challenge/' + userId,
            dataType: 'json',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                }.bind(this)
            },
            success: function (d) {
                this._processChallenges(d);
                ChallengeStore.emitChange();
                //ChallengeGroupStore.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('slots', status, err.toString());
                console.log('Redirecting to error');
                //this.redirect('error');
            }.bind(this)
        });
    },

    setChallenges: function(challenges) {
        this._processChallenges(challenges);
    },

    _processChallenges: function(challenges) {
        // Set the selected game and slot to a default value
        _challenges = challenges;
        for (var t in _challenges) {
            _challenges[t].forEach(function(group) {
                //Set the Seleted Game
                var game =  group.selectedGame == undefined ? null : group.selectedGame;
                var slot = group.selectedSlot == null ||  group.selectedSlot == undefined ? 0 : group.selectedSlot;
                var anyTime = group.anyTime == null ||  group.anyTime == undefined ? false : group.anyTime;
                if (group.games.length == 1) {
                    game = group.games[0];
                }
                if (group.slots.length == 1) {
                    slot = group.slots[0].id;
                }
                group.selectedGame = game;
                group.selectedSlot = slot;
                group.anyTime = anyTime;
            });
        }
    },

    changeSlotStatus: function(slot) {
        _request.slots.forEach(function(s) {
            if (s.id == slot.id) {
                s.selected = slot.selected;
            }
        });
    }

});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case ChallengeConstants.DATE_CHANGE:
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
             ChallengeStore.newChallenge(action.request);
             break;

         case ChallengeConstants.SLOT_CHANGE:
             ChallengeStore.changeSlotStatus(action.slot);
             ChallengeStore.emitChange();
             break;

         case ChallengeConstants.SLOT_ANY:
             ChallengeStore.anySlot(action.anySlot,action.slots);
             ChallengeStore.emitChange();
             break;

         case ChallengeConstants.SET_CHALLENGES:
             ChallengeStore.setChallenges(action.challenges);
             ChallengeStore.emitChange();
             break;

          case ChallengeConstants.CHALLENGES:
             ChallengeStore.initChallenges(action.userId);
             break;

         default:
     }
});

module.exports = ChallengeStore;
