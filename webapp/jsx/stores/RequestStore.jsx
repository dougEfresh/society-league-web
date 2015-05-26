var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var ChallengeConstants = require('../constants/ChallengeConstants.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var ADD_EVENT = 'add';
var ChallengeActions = require('../actions/ChallengeActions.jsx');
var ChallengeGroupStore = require('./ChallengeGroupStore.jsx');
var DataStore = require('../stores/DataStore.jsx');
var ChallengeGroup = require('../../lib/ChallengeGroup');
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
    var cg = new ChallengeGroup();
    cg.selectedSlots = [];
    cg.selectedGames = [];
    cg.date = '-';
    cg.anySlot = false;
    return cg;
}
var _request = defaultRequest();

var RequestStore = assign({}, EventEmitter.prototype, {

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
                _request.opponent = defaultOpponent();
                _request.anySlot = false;
                _request.slots.forEach(function(s) {
                    s.selected = false;
                });
                _request.game = defaultGame();
                DataStore.replaceUser(d);
                RequestStore.emitAdd();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('/api/challenge/request', status, err.toString());
                //this.redirect('error');
            }.bind(this)
        });
    },

    changeDate : function(date) {
        _request.date = date;
        var slots = DataStore.getSlots();
        _request.selectedSlots = [];
        _request.slots = [];
        slots.forEach(function(s){
            if (s.getDate() == date)
                _request.slots.push(s);
        });
    },

    anySlot: function(anySlot) {
        _request.anySlot = anySlot;
        if (anySlot) {
            _request.selectedSlots = _request.slots;
        } else {
            _request.selectedSlots = [];
        }
    },

    setOpponent: function(opponent) {
        _request.opponent = opponent;
    },

    setGame: function(game) {
        var found = false;
        _request.selectedGames.forEach(function(g){
            if (g == game) {
                found = true;
            }
        });
        if (found) {
            var newGames = [];
            _request.selectedGames.forEach(function(g){
                if (g != game) {
                    newGames.push(g);
                }
            });
            _request.selectedGames = newGames;
            return;
        }

        _request.selectedGames.push(game);
    },
    get: function() {
        return _request;
    },
    
    changeSlotStatus: function(slot) {
        var newSlots = [];
        var found = false;
        for(var i = 0 ; i < _request.selectedSlots.length; i++) {
            if (_request.selectedSlots[i].id == slot.id) {
                found = true;
            }
        }
        if (found) {
            for(var i = 0 ; i < _request.selectedSlots.length; i++) {
                if (_request.selectedSlots[i].id != slot.id) {
                    newSlots.push(_request.selectedSlots[i]);
                }
            }
            _request.selectedSlots = newSlots;
            return;
        }
         _request.selectedSlots.push(slot);
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case ChallengeConstants.DATE_CHANGE:
             RequestStore.changeDate(action.date);
             RequestStore.emitChange();
             break;

         case ChallengeConstants.OPPONENT_CHANGE:
             RequestStore.setOpponent(action.opponent);
             RequestStore.emitChange();
             break;

         case ChallengeConstants.CHALLENGE_GAME_CHANGE:
             RequestStore.setGame(action.game);
             RequestStore.emitChange();
             break;

         case ChallengeConstants.CREATE:
             RequestStore.newChallenge(action.request);
             break;

         case ChallengeConstants.SLOT_CHANGE:
             RequestStore.changeSlotStatus(action.slot);
             RequestStore.emitChange();
             break;

         case ChallengeConstants.SLOT_ANY:
             RequestStore.anySlot(action.anySlot,action.slots);
             RequestStore.emitChange();
             break;

         default:
     }
});

module.exports = RequestStore;
