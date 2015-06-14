var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var login = require('../../lib/Login');

var LoginApp = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    contextTypes: {
        router: React.PropTypes.func
    },
    getInitialState: function () {
        return {
            error: false,
            loggedIn: false
        };
    },
    handleReset: function(e){
        this.transitionTo('reset', null, null);
    },
    handleSubmit: function(e){
        e.preventDefault();
        var user = React.findDOMNode(this.refs.username).value.toLowerCase();
        var password = React.findDOMNode(this.refs.password).value;
        console.log('Logging in: ' + user);
        $.ajax({
            async: true,
            processData: true,
            url: window.location.pathname + 'api/authenticate',
            data: {username: user, password: 'password'},
            method: 'post',
            success: function (d) {
                DataStore.setUser(d);
                //DataStore.init();
                if (this.isActive('login')) {
                    this.transitionTo('home', null, null);
                }
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({error: true});
                console.error('authenticate', status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div id="login-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form id='login' className="login-form form-signin">
                        <h2 className="form-signin-heading">Please Log In</h2>
                        <div className="form-field form-group">
                            <div className="form-group">
                                <input ref='username' id="username" type="input" name="username" placeholder="enter user name" className="form-control"/>
                            </div>
                            <div className="form-group">
                            <input ref='password' id="password" ref='password' type='password' name='password' placeholder='enter password'className="form-control" > </input>
                            </div>
                        </div>
                
                        <button id="submit" type="button" onClick={this.handleSubmit} className="btn btn-sm btn-default">
                            <b>Login</b>
                        </button>
                    <Link to='reset'>
                        <button type="button" className="btn btn-sm btn-default pull-right">
                            <b>Forgot Password?</b>
                        </button>
                    </Link>
                </form>
            </div>
        );
    }
});


module.exports = LoginApp;
