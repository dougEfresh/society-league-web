var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('./../jsx/mixins/UserContextMixin.jsx');

var ResetApp = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {

            return ( <div id="reset-sent-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <h4>See email for a password reset link</h4>
            </div>);
        }
});


module.exports = ResetApp;
