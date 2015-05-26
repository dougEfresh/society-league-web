var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var ChallengeConstants = require('../constants/ChallengeConstants.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';
var ChallengeActions = require('../actions/ChallengeActions.jsx');
var ChallengeStore = require('../stores/ChallengeStore.jsx');
var DataStore = require('../stores/DataStore.jsx');
var Status = require('../../lib/Status');

var ChallengeGroupStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },
    _sendRequest: function(url,data) {
        console.log('Sending to ' + url);
        console.log('Sending data: ' + JSON.stringify(data));
         $.ajax({
            async: true,
            processData: false,
            url: url,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            method: 'post',
            statusCode: {
                401: function () {
                    console.log('I Need to Authenticate');
                    //this.redirect('login');
                }
            },
            success: function (d) {
                DataStore.replaceUser(d);
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                //this.redirect('error');
            }.bind(this)
        });
    },

    acceptChallenge: function(userId,challengeGroup) {
        var challenge = {id : 0};
        challengeGroup.challenges.forEach(function(c) {
            if (c.slot.id== challengeGroup.selectedSlot.id &&
                    c.game == challengeGroup.selectedGame) {
                challenge = {id: c.id};
            }
        });
        if (challenge.id == 0) {
            console.error('!!Could not find Challenge!!');
            return;
        }

        this._sendRequest('/api/challenge/accepted/' + userId,challenge);
    },

      cancelChallenge: function(userId,challengeGroup) {
        var request = {
            challenger: null,
            opponent: null,
            challenges: []
        };
        challengeGroup.challenges.forEach(function(c) {
            request.challenges.push({id: c.id});
        });
        this._sendRequest('/api/challenge/' + Status.CANCELLED.toLowerCase() + '/' + userId,request);
    },

    selectChallengeGroupGame: function(challengeGroup,game) {
        challengeGroup.selectedGame = game;
        DataStore.emitChange();
    },
    selectChallengeGroupSlot: function(challengeGroup,slotId) {
        var slots = DataStore.getSlots();
        var selected;
        for(var i = 0 ; i< slots.length; i++) {
            if (slotId == slots[i].id) {
                selected = slots[i]
            }
        }

        challengeGroup.selectedSlot = selected;
        DataStore.emitChange();
    },

   newStatus: function() {
       console.log('New Status');
       _lastStatusChange = ChallengeStatus.REQUEST;
       _lastStatusAction = ChallengeStatus.SENT;
       ChallengeGroupStore.emitChange();
   }
});

AppDispatcher.register(function(action) {

     switch(action.actionType) {
         case ChallengeConstants.SELECT_REQUEST_GAME:
             ChallengeGroupStore.selectChallengeGroupGame(action.challengeGroup,action.game);
             ChallengeGroupStore.emitChange();
             break;

          case ChallengeConstants.SELECT_REQUEST_SLOT:
              ChallengeGroupStore.selectChallengeGroupSlot(action.challengeGroup,action.slot);
              ChallengeGroupStore.emitChange();
             break;

         case ChallengeConstants.CANCEL:
             ChallengeGroupStore.cancelChallenge(action.userId,action.challengeGroup);
             break;

         case ChallengeConstants.ACCEPT:
             ChallengeGroupStore.acceptChallenge(action.userId,action.challengeGroup);
             break;

         case ChallengeConstants.NEW:
             ChallengeGroupStore.newStatus();
             break;

         default:
     }
});

module.exports = ChallengeGroupStore;
