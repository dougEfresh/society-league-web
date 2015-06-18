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
            <div id="create-user" className="panel panel-default">
                <div className="panel-heading">
                    <h2><span className="fa fa-user-plus"></span>Create User</h2>
                </div>
                <div className="panel-body">
                    <form id='login' className="login-form form-signin form-horizontal">
                                <div className="form-group">
                                        <label for="firstname" className="col-sm-2 control-label">First Name</label>
                                    <div className="col-sm-10">
                                        <input ref='firstname' id="firstname" type="input" name="firstname" placeholder="enter first name" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                        <label for="lastname" className="col-sm-2 control-label">Last Name</label>
                                    <div className="col-sm-10">
                                        <input ref='lastname' id="lastname" type="input" name="lastname" placeholder="enter last" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                        <label for="email" className="col-sm-2 control-label">Email</label>
                                    <div className="col-sm-10">
                                        <input ref='email' id="email" type="input" name="email" placeholder="enter email" className="form-control" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-2 col-sm-10">
                                        <button id="submit" type="button" onClick={this.handleSubmit} className="btn btn-sm btn-primary btn-responsive">
                                            <b>Create</b>
                                        </button>
                                    </div>
                                </div>
                    </form>
                </div>
            </div>

        );
    }
});

module.exports = CreateUserApp;