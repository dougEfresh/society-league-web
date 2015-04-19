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
    selectRequestGame: function(id,game) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.SELECT_REQUEST_GAME,
            id: id,
            game: game
        });
    },

    /**
     * select the slot for a Requests
     * @param id
     * @param game
     */
    selectRequestSlot: function(id,slot) {
        AppDispatcher.dispatch({
            actionType: RequestConstants.SELECT_REQUEST_SLOT,
            id: id,
            slot: slot
        });
    },

    changeSlotState: function(slot){
         AppDispatcher.dispatch({
            actionType: RequestConstants.SLOT_CHANGE,
            slot: slot
         });
    },

    setChallenges: function(userId) {
         AppDispatcher.dispatch({
            actionType: RequestConstants.CHALLENGES,
            userId: userId
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
    }
};

module.exports = ChallengeActions;
