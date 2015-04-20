var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var RequestConstants = require('../constants/ChallengeConstants.jsx');

var ChallengeActions = {

    /**
     * @param  {date} string
     */
    changeDate: function(date) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.DATE_CHANGE,
            date: date
        });
    },

    /**
     *  Dupilcate slots will be ignored
     * @param slots
     */
    addSlots: function(slots) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.CHALLENGE_SLOTS_ADD,
            slots: slots
        });
    },

    /**
     * Remove a time slot
     * @param slot
     */
    removeSlot: function(slot) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.CHALLENGE_SLOTS_REMOVE,
            slot: slot
        });
    },

    /**
     * Set the opponent from the list of potentials
     * @param opponent
     */
    setOpponent: function(opponent) {
         AppDispatcher.dispatch({
            actionType: RequestConstants.OPPONENT_CHANGE,
            opponent: opponent
         });
    },

    /**
     * Set the game type (8 or 9)
     * @param game
     */
    setGame: function(game) {
         AppDispatcher.dispatch({
            actionType: RequestConstants.CHALLENGE_GAME_CHANGE,
            game: game
         });
    },

    /**
     * Send Challenge request
     * @param request
     */
    request: function(request) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.CREATE,
            request: request
        });
    },

    /**
     * Change the state of a challenge(s)
     * @param status
     */
    status: function(status) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.CHANGE_STATUS,
            status: status
        });
    },

    /**
     * select the game type for Requests
     * @param id
     * @param game
     */
    selectChallengeGroupGame: function(challengeGroup,game) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.SELECT_REQUEST_GAME,
            challengeGroup: challengeGroup,
            game: game
        });
    },

    /**
     * select the slot for a Requests
     * @param id
     * @param game
     */
    selectChallengeGroupSlot: function(challengeGroup,slot) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.SELECT_REQUEST_SLOT,
            challengeGroup: challengeGroup,
            slot: slot
        });
    },

    anySlot: function(anySlot,slots) {
           AppDispatcher.dispatch({
               actionType: RequestConstants.SLOT_ANY,
               anySlot: anySlot,
               slots: slots
           });
    },
    changeSlotState: function(slot){
         AppDispatcher.dispatch({
            actionType: RequestConstants.SLOT_CHANGE,
            slot: slot
         });
    },

    initChallenges: function(userId) {
         AppDispatcher.dispatch({
            actionType: RequestConstants.CHALLENGES,
            userId: userId
         });
    },

    setChallenges: function(challenges) {
         AppDispatcher.dispatch({
            actionType: RequestConstants.SET_CHALLENGES,
            challenges: challenges
         });
    },

    notifyChallenge: function(userId,challengeGroup) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.NOTIFY,
            userId: userId,
            challengeGroup: challengeGroup
        });
    },

    cancelChallenge: function(userId,challengeGroup) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.CANCEL,
            userId: userId,
            challengeGroup: challengeGroup
        });
    },

    acceptChallenge: function(userId,challengeGroup) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.ACCEPT,
            userId: userId,
            challengeGroup: challengeGroup
        });
    }
};

module.exports = ChallengeActions;
