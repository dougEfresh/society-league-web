var AppDispatcher = require('../AppDispatcher.jsx');
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
    }
};

module.exports = ChallengeActions;
