var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');

var DataActions = {
    init: function() {
         AppDispatcher.dispatch({
            actionType: 'INIT'
        });
    }
};

module.exports = DataActions;