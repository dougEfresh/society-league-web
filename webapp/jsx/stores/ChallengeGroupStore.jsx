var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var ChallengeConstants = require('../constants/ChallengeConstants.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var assign = require('object-assign');
var UserStore = require('./UserStore.jsx');
var CHANGE_EVENT = 'change';
var ChallengeActions = require('../actions/ChallengeActions.jsx');

var _challengeGroup = [];
var ChallengeGroupStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        _challengeGroup = [];
        this.removeListener(CHANGE_EVENT, callback);
    },

    setChallengeGroups: function(challengeGroups) {
        _challengeGroup = challengeGroups;
    },

    acceptChallenge: function(challengeGroup) {

    },

    _cancelOrNotifyChallenge: function(type,userId,challengeGroup) {
           //TODO Move this to lib
        var request = {
            challenger: null,
            opponent: null,
            challenges: []
        };
        challengeGroup.challenges.forEach(function(c) {
            request.challenges.push({id: c.id});
        });

        $.ajax({
            async: true,
            processData: false,
            url: '/api/challenge/' + type + '/' + userId,
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
                _challengeGroup = d;
                ChallengeActions.setChallenges(d);
                ChallengeGroupStore.emitChange();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('cancel', status, err.toString());
                //this.redirect('error');
            }.bind(this)
        });
    },

   cancelChallenge: function(userId,challengeGroup) {
        this._cancelOrNotifyChallenge('cancel',userId,challengeGroup);
    },

    notifyChallenge: function(userId,challengeGroup) {
        this._cancelOrNotifyChallenge('notify',userId,challengeGroup);
    },

    modifyChallenge: function() {

    },

    selectChallengeGroupGame: function(challengeGroup,game) {
        var id =  challengeGroup.challenges[0].id;
        for (var type in _challengeGroup) {
            _challengeGroup[type].forEach(function(group) {
                group.challenges.forEach(function(c) {
                    if (c.id == id) {
                        group.selectedGame = game;
                    }
                });
            });
        }
    },

    selectChallengeGroupSlot: function(id,slot) {
        for (var type in _challengeGroup) {
            _challengeGroup[type].forEach(function(group) {
                group.challenges.forEach(function(c) {
                    if (c.id == id) {
                        group.selectedSlot = slot;
                    }
                });
            });
        }
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
             ChallengeGroupStore.notifyChallenge(action.userId,action.challengeGroup);
             break;

         default:
     }
});

module.exports = ChallengeGroupStore;
