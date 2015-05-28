var AppDispatcher = require('../AppDispatcher.jsx');

var DataActions = {
    init: function() {
         AppDispatcher.dispatch({
            actionType: 'INIT'
        });
    },
    checkLogin: function() {
         AppDispatcher.dispatch({
            actionType: 'CHECK'
        });
    },
    challengeSignUp: function(id) {
         AppDispatcher.dispatch({
            actionType: 'CHALLENGE_SIGN_UP',
             id: id
        });
    }
};

module.exports = DataActions;