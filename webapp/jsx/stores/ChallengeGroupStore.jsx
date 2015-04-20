var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var ChallengeConstants = require('../constants/ChallengeConstants.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var assign = require('object-assign');
var UserStore = require('./UserStore.jsx');
var CHANGE_EVENT = 'change';
var ChallengeActions = require('../actions/ChallengeActions.jsx');
var ChallengeStore = require('../stores/ChallengeStore.jsx');

var _type = null; //ChallengeStatus tytpe

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
    setType: function(type) {
        _type = type;
    },
    _sendRequest: function(url,data,status) {
        console.log('Sending to ' + url);
        console.log('Sending  data: ' + JSON.stringify(data));
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
                ChallengeActions.setChallenges(d);
                ChallengeGroupStore.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(url, status, err.toString());
                //this.redirect('error');
            }.bind(this)
        });
    },

    acceptChallenge: function(userId,challengeGroup) {
        var originalStatus = challengeGroup.status;
        var challenge = {id : 0};
        challengeGroup.challenges.forEach(function(c) {
            if (c.slot.id == challengeGroup.selectedSlot &&
                    c.opponent.division.type == challengeGroup.selectedGame) {
                challenge = {id: c.id};
            }
        });
        if (challenge.id == 0) {
            console.error('!!Could not find Challenge!!');
            return;
        }

        this._sendRequest('/api/challenge/accepted/' + userId,challenge,originalStatus);
    },

    _cancelOrNotifyChallenge: function(type,userId,challengeGroup) {
        //TODO Move this to lib
        var originalStatus = challengeGroup.status;
        var request = {
            challenger: null,
            opponent: null,
            challenges: []
        };
        challengeGroup.challenges.forEach(function(c) {
            request.challenges.push({id: c.id});
        });
        this._sendRequest('/api/challenge/' + type.toLowerCase() + '/' + userId,request,originalStatus);
    },

    cancelChallenge: function(userId,challengeGroup) {
        this._cancelOrNotifyChallenge(ChallengeStatus.CANCELLED,userId,challengeGroup);
    },

    notifyChallenge: function(userId,challengeGroup) {
        this._cancelOrNotifyChallenge(ChallengeStatus.NOTIFY,userId,challengeGroup);
    },

    modifyChallenge: function() {

    },
    selectChallengeGroupGame: function(challengeGroup,game) {
        var id =  challengeGroup.challenges[0].id;
        ChallengeStore.getChallenges(_type).forEach(function(g) {
            g.challenges.forEach(function(c) {
                if (c.id == id) {
                    g.selectedGame = game;
                }
            })
        });

    },

    selectChallengeGroupSlot: function(challengeGroup,slot) {
        var id =  challengeGroup.challenges[0].id;
        ChallengeStore.getChallenges(_type).forEach(function(g) {
            g.challenges.forEach(function(c) {
                if (c.id == id) {
                    g.selectedSlot = slot;
                }
            })
        });
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

         case ChallengeConstants.NOTIFY:
             ChallengeGroupStore.notifyChallenge(action.userId,action.challengeGroup);
             break;

         case ChallengeConstants.ACCEPT:
             ChallengeGroupStore.acceptChallenge(action.userId,action.challengeGroup);
             break;

         default:
     }
});

module.exports = ChallengeGroupStore;
