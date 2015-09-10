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
    handleSubmit: function(e){
        if (e.keyCode != undefined && e.keyCode != 13 ) {
            return ;
        }
        e.preventDefault();
        var user = React.findDOMNode(this.refs.username).value.toLowerCase();
        var password = React.findDOMNode(this.refs.password).value;
        console.log('Logging in: ' + user);
        $.ajax({
            async: true,
            processData: true,
            url: '/api/authenticate',
            data: {username: user, password: password, 'springRememberMe': true},
            method: 'post',
            success: function (d) {
                DataStore.setUser(d);
                //DataStore.init();
                if (this.isActive('login')) {
                    this.transitionTo('home', null, null);
                }
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('authenticate', status, err.toString());
                this.transitionTo('login',null,{error: 'true'});
            }.bind(this)
        });
    },
    render: function () {
        DataStore.setLoaded(false);
        DataStore.setLoading(false);
        DataStore.resetAuth();
        var errorMsg = null;
        if (this.getQuery().error == 'true') {
            errorMsg = <div className="form-group alert alert-danger" role="alert">Your username or password was incorrect.</div>;
        }

        if (this.getQuery().expired == 'true') {
            errorMsg = <div className="form-group alert alert-danger" role="alert">Session Expired. Please login again.</div>;
        }
        return (
            <div onKeyDown={this.handleSubmit} id="login-app" className="login-container well col-lg-5 col-md-5 col-sm-6">
                <form id='login' className="login-form form-signin">
                        <h2 className="form-signin-heading">Please Log In</h2>
                        <div className="form-field form-group">
                            <div  className="form-group">
                                <input ref='username' id="username" type="input" name="username" placeholder="enter email" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <input ref='password' id="password" ref='password' type='password' name='password' placeholder='enter password'className="form-control" > </input>
                            </div>
                             <input type="hidden" value="true" name="springRememberMe" />
                            {errorMsg}
                        </div>
                        <div className="row">
                            <div className="btn-group col-lg-6 col-md-7 col-sm-12 col-xs-12 login-options">
                                <button onKeyDown={this.handleSubmit} id="submit" type="button"   onClick={this.handleSubmit} className="btn btn-sm btn-primary btn-responsive">
                                    <b>Login</b>
                                </button>
                                <Link to='register'  >
                                <button type="button" className="btn btn-sm btn-default btn-responsive">
                                        <b>Register</b>
                                </button>
                                </Link>
                            </div>
                            
                            <div className="col-lg-6 col-md-5 col-sm-12 col-xs-12">
                                <Link to='reset'>
                                    <button type="button" className="btn btn-sm btn-default btn-responsive pull-right">
                                        <b>Forgot Password?</b>
                                    </button>
                                </Link>
                            </div>
                        </div>
                </form>
            </div>
        );
    }
});


module.exports = LoginApp;
