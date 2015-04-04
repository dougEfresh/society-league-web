var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
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
    set: function(user) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USER_SET,
            user: user
        });
    },

    /**
      * View the website wth this user instead of logged in user
     * a param of null disable viewing user
     * @param  {object} user
     */
    setViewer: function(user) {
        AppDispatcher.dispatch({
            actionType: UserConstants.USER_VIEW_SET,
            user: user
        });
    },

};

module.exports = UserActions;