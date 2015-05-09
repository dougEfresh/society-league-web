var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var ChallengeConstants = require('../constants/ChallengeConstants.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var ADD_EVENT = 'add';
var ChallengeActions = require('../actions/ChallengeActions.jsx');
var ChallengeGroupStore = require('./ChallengeGroupStore.jsx');

var _challenges = {};
_challenges[ChallengeStatus.PENDING] = [];
_challenges[ChallengeStatus.NOTIFY] = [];
_challenges[ChallengeStatus.CANCELLED] = [];
_challenges[ChallengeStatus.SENT] = [];
_challenges[ChallengeStatus.ACCEPTED] = [];

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
