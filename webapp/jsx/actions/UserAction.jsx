var AppDispatcher = require('../AppDispatcher.jsx');
var UserConstants = require('../constants/UserConstants.jsx');

var UserActions = {

    /**
     * @param  {object} user
     */
    create: function(user) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USER_CREATE,
            user: user
        });
    },

    /**
     * @param  {object} user
     */
    getInfo: function() {
        AppDispatcher.dispatch({
            actionType: UserConstants.INFO
        });
    },

    /**
     * @param  {object} user
     */
    set: function(user) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USER_SET,
            user: user
        });
    },

    /**
      * View the website wth this userId instead of logged in userId
     * a param of null disable viewing userId
     * @param  {object} user
     */
    setViewer: function(user) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USER_VIEW_SET,
            user: user
        });
    }
};

module.exports = UserActions;