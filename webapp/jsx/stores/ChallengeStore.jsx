var AppDispatcher = require('../AppDispatcher.jsx');
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
