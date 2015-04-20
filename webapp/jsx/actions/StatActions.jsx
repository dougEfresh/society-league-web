var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var UserConstants = require('../constants/UserConstants.jsx');

var StatActions = {

    get: function() {
        AppDispatcher.dispatch({
            actionType: UserConstants.STATS
        });
    }
};

module.exports = StatActions;