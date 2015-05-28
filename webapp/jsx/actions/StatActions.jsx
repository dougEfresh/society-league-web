var AppDispatcher = require('../AppDispatcher.jsx');
var UserConstants = require('../constants/UserConstants.jsx');

var StatActions = {

    get: function() {
        AppDispatcher.dispatch({
            actionType: UserConstants.STATS
        });
    },

    changeView: function(id){
         AppDispatcher.dispatch({
            actionType: UserConstants.CHANGE_STAT_VIEW,
             id: id
        })
    }
};

module.exports = StatActions;