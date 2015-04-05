var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Label = Bootstrap.Label;

var UserActions = require('../actions/UserAction.jsx');

var Login = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            error: false,
            loggedIn: false
        };
    },
    handleSubmit: function(e){
        var router = this.context.router;
        e.preventDefault();
        var user = this.refs.username.getValue();
        var password = this.refs.password.getValue();
        console.log('Logging in: ' + user);
        $.ajax({
            async: true,
            processData: true,
            url: '/api/authenticate',
            data: {username: user, password: password},
            method: 'post',
            success: function (d) {
                console.log('Router ' +
                    JSON.stringify(router.getCurrentPath()) + ' ---- '+
                    JSON.stringify(router.getCurrentPathname()) + ' ---- '+
                    JSON.stringify(router.getCurrentParams()) + ' ---- ' +
                    JSON.stringify(router.getCurrentQuery())
                );
                UserActions.authenticated(router);
                //this.props.callback();
                //}app/home.html

            }.bind(this),
            error: function (xhr, status, err) {
                console.error('/authenticate', status, err.toString());
            }.bind(this)
        });

    },
    render: function () {
        var errors = this.state.error ? <p>Bad login information</p> : '';
        return (
            <div>
                <Label><Input type='text' ref='username' placeholder="username" defaultValue="login0"/></Label>
                <Label><Input type='text' ref='password' placeholder="password" defaultValue="login0"/></Label>
                <Button onClick={this.handleSubmit} type="submit">login</Button>
            </div>
        );
    }
});


module.exports = Login;
