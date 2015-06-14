var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var User = require('../../lib/User');
var Util = require('../../jsx/util.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');

var CreateUserApp = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
    handleSubmit: function() {
        var fname =React.findDOMNode(this.refs.firstname).value;
        var lname =React.findDOMNode(this.refs.lastname).value;
        var email =React.findDOMNode(this.refs.email).value.toLowerCase();
        var u = new User(0,fname,lname);
        u.password = email;
        u.login = email;
        u.email = email;
        Util.sendData(u,'api/user/create/' + this.getUser().id,function(d){
            DataStore.replaceUser(d);
            this.transitionTo('createUserSuccess',null,{userId: d.userId});
        }.bind(this));
    },
    render: function() {
        return (
            <div id="create-user">
            <h2>Create User</h2>
                <form id='login' className="login-form form-signin">
                        <div className="form-field form-group">
                            <div className="form-group">
                                <input ref='firstname' id="firstname" type="input" name="firstname" placeholder="enter first name" className="form-control"/>
                                <input ref='lastname' id="lastname" type="input" name="lastname" placeholder="enter last" className="form-control"/>
                            </div>
                            <div className="form-group">
                                <input ref='email' id="email" type="input" name="email" placeholder="enter email" className="form-control"/>
                            </div>
                        </div>
                        <button id="submit" type="button" onClick={this.handleSubmit} className="btn btn-sm btn-primary">
                            <b>Create</b>
                        </button>
                </form>
            </div>

        );
    }
});

module.exports = CreateUserApp;