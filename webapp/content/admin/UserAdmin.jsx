var Qs = require('qs');
var React = require('react/addons');
var Router = require('react-router')
    , History = Router.History
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');
var firstBy = require('../../lib/FirstBy.js');

var UserAdminApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            update: Date.now(),
            users : [],
            seasons: [],
            handicaps: [],
            user: null,
        }
    },
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
        this.getData();
    },
    onChange: function (e) {
        e.preventDefault();
        if (e.target.value == '-1') {
            this.setState({user: null});
            return;
        }
        var user = null;
        this.state.users.forEach(function(u){
            if (u.id == e.target.value) {
                user = u;
            }
        });
        this.setState({user: user});
    },
    getData: function() {
        Util.getData('/api/user/all', function(d){
            this.setState({users: d});
        }.bind(this),null,'UserAdminApp');
        Util.getData('/api/season', function(d){
            this.setState({seasons: d});
        }.bind(this),null,'UserAdminApp');
          Util.getData('/api/season/handicaps', function(d){
            this.setState({handicaps: d});
        }.bind(this),null,'UserAdminApp');
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if (now - this.state.update > 1000*60)
            this.getData();
    },
    onSubmit: function(u) {
        this.getData();
        this.setState({
            user: u
        });
    },
    render: function () {
        if (!this.getUser().admin){
            return (
                <div className="alert alert-error" role="alert">
                <h3>Go away you plebian</h3>
            </div>);
        }
        var users = this.state.users;
        var handicaps = this.state.handicaps;
        if (users.length < 1 || handicaps.length < 1) {
            return null;
        }
        var options = [];
        options.push(<option key={'-1'} value={-1}>{'New User'}</option>);
        users.forEach(function(u) {
            options.push(<option key={u.id} value={u.id}>{u.name}</option>);
        });
        var select = (
            <select ref='user' onChange={this.onChange}
                    className="form-control"
                    value={this.state.user != null ? this.state.user.id : '-1' }
                    type={'select'}>
                {options}
            </select>);

        /*
        if (this.props.location.query.submitted == 'true') {
            var q = this.props.location.query;
            q.submitted = 'false';
            q = {user: Qs.stringify(selectedUser)};
            setTimeout(function() {
                this.history.pushState(null, '/app/admin/users',q);
                Util.getData('/api/user/all', function (d) {
                    this.setState({users: d});
                }.bind(this), null, 'UserAdminApp');
            }.bind(this),2000);
                return (
                    <div className="alert alert-success" role="alert">
                        {'Modified User! ' + selectedUser.name}
                    </div>
                );
        }
        */
            return (
                <div id="user-admin-app">
                    {select}
                    <UserModifyApp onSubmit={this.onSubmit} seasons={this.state.seasons} user={this.state.user ==  null  ? {} : this.state.user} handicaps={handicaps}/>
                </div>
            );
        }
});

var UserModifyApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            user: this.props.user,
            loading: false
        }
    },
    componentWillReceiveProps: function (n) {
        if (this.state.user.id != n.user.id) {
            this.setState({
                user: n.user
            })
        }
    },
    handleCreate: function() {
        this.handleSubmit('create');
    },
    handleModify: function(e) {
        e.preventDefault();
        var hs = [];
        this.state.user.handicapSeasons.forEach(function(h){
            if (h.handicap != 'NA')
                hs.push(h);
        });
        this.state.user.handicapSeasons = hs;
        this.setState({loading: true});
        setTimeout(function() {
            Util.postSomeData({
                url: '/api/user/admin/modify',
                data: this.state.user,
                callback: function (d) {
                    this.setState({user: d, loading: false});
                    if (this.props.onSubmit) {
                        this.props.onSubmit(d);
                    }
                }.bind(this),
                module: 'UserAdminApp'
            })
        }.bind(this),500);
    },
    handicapChange: function(hs) {
        return function(e) {
            e.preventDefault();
            var u = this.state.user;
            var newHandicap = e.target.value;
            u.handicapSeasons.forEach(function (old) {
                if (old.season.id == hs.season.id) {
                    old.handicap = newHandicap;
                }
            }.bind(this));

            this.forceUpdate();
        }.bind(this);
    },
    statusChange: function(e) {
        e.preventDefault();
        var u = this.state.user;
        u.status =  React.findDOMNode(this.refs.status).value;
        this.forceUpdate();
    },
    roleChange: function(e) {
        e.preventDefault();
        var u = this.state.user;
        u.role =  React.findDOMNode(this.refs.role).value;
        this.forceUpdate();
    },
    getHandicaps: function() {
        var seasons = [];
        if (this.state.user == null)
            return seasons;

        if (this.state.user.handicapSeasons == undefined) {
            this.state.user.handicapSeasons = [];
        }
        this.props.seasons.forEach(function(s){
            if (!s.active)
                return;

            var found = false;
            this.state.user.handicapSeasons.forEach(function (hs) {
                if (hs.season.id == s.id) {
                    found = true;
                }
            });
            if (found)
                return;
            this.state.user.handicapSeasons.push({handicap: 'NA', season: s});
        }.bind(this));

        this.state.user.handicapSeasons.forEach(function(hs) {
            if (!hs.season.active) {
                return;
            }
            var options = [];
            var s = hs.season;
            options.push(<option key={'NA-' + s.id} value={'NA'}>{'NA'}</option>);
            this.props.handicaps.forEach(function(h) {
                options.push(<option key={h + '-' + s.id} value={h}>{h}</option>);
            });
            var select = (
                <select ref={'handicap-'+ s.id} onChange={this.handicapChange(hs)}
                        className="form-control"
                        value={hs.handicap}
                        type={'select'}>
                    {options}
                </select>);

             seasons.push(
                 <div key={s.id} className="form-group">
                     <label htmlFor="season" className="col-sm-2 control-label">{s.displayName}</label>
                     <div className="col-sm-10">
                         {select}
                     </div>
                 </div>
             );
        }.bind(this));
        return seasons;
    },
    onChange: function(e) {
        e.preventDefault();
        var firstName =  React.findDOMNode(this.refs.firstName).value;
        var lastName =  React.findDOMNode(this.refs.lastName).value;
        var login =  React.findDOMNode(this.refs.email).value;
        this.state.user.firstName = firstName;
        this.state.user.lastName =  lastName;
        this.state.user.login = login;
    },
    reset: function() {
        var url = '/api/user/reset/request';
        $.ajax({
            async: true,
            processData: false,
              dataType: 'json',
              contentType: 'application/json',
            url: url,
            data: JSON.stringify({id: 0, login:  this.props.user.login}),
            method: 'post',
            success: function (d) {
                window.location = '#/notification';
            }.bind(this),
            error: function (xhr, status, err) {
                console.error('authenticate', status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        if (this.state.loading) {
            return <h2>Loading</h2>
        }
        var u = this.state.user;
        if (u == null) {
            u = {}
        }
        if (this.state.reset) {
            setTimeout(function () {
                this.setState({
                    reset: false
                });
            }.bind(this), 3000);
            return (
                <div className="alert alert-success" role="alert">
                    {'Sent Password Reset to ' + u.email}
                    <p>Please wait 3 seconds</p>
                </div>
            );
        }
        var userType = u.admin ? "fa fa-user-plus" : "fa fa-user";
        return (
           <div id="modify-user" className="panel panel-default">
               <div className="panel-heading">
                   <h2><span className={userType}></span>{u.name}</h2>
                   <button type="button" className="btn btn-sm btn-primary btn-responsive btn-send-reset" onClick={this.reset}>Send Password Reset</button>
               </div>
               <div className="panel-body">
                   <form id='login' className="login-form form-signin form-horizontal">
                       <div className="form-group">
                           <label htmlFor="firstName" className="col-sm-2 control-label">First Name</label>
                           <div className="col-sm-10">
                               <input ref='firstName' id="firstname"
                                      type="input" name="firstName"
                                      value = {this.state.user.firstName} onChange={this.onChange}
                                      className="form-control" />
                           </div>
                       </div>
                       <div className="form-group">
                           <label htmlFor="lastName" className="col-sm-2 control-label">Last Name</label>
                           <div className="col-sm-10">
                               <input ref='lastName' id="lastname" type="input" name="lastName"
                                      value = {this.state.user.lastName} onChange={this.onChange}
                                      className="form-control" />
                           </div>
                       </div>
                       <div className="form-group">
                           <label htmlFor="email" className="col-sm-2 control-label">Email</label>
                           <div className="col-sm-10">
                               <input ref='email' id="email" type="input" name="email"
                                      value = {this.state.user.login}
                                      onChange={this.onChange}
                                      className="form-control" />
                           </div>
                       </div>
                       <div className="form-group">
                           <label htmlFor="role" className="col-sm-2 control-label">Role</label>
                           <div className="col-sm-10">
                               <select ref='role' onChange={this.roleChange} className="form-control" value={u.role} type={'select'}>
                                   <option key={'PLAYER'} value={'PLAYER'}>Player</option>
                                   <option key={'ADMIN'} value={'ADMIN'}>Admin</option>
                               </select>
                           </div>
                       </div>
                         <div className="form-group">
                           <label htmlFor="status" className="col-sm-2 control-label">status</label>
                           <div className="col-sm-10">
                               <select ref='status' onChange={this.statusChange} className="form-control" value={u.status}  type={'select'}>
                                   <option key={'ACTIVE'} value={'ACTIVE'}>Active</option>
                                   <option key={'INACTIVE'} value={'INACTIVE'}>Disable</option>
                               </select>
                           </div>
                       </div>
                       {this.getHandicaps()}
                       <div className="form-group">
                           <div className="col-sm-offset-2 col-sm-10">
                               <button id="submit" type="button" onClick={this.handleModify} className="btn btn-sm btn-primary btn-responsive">
                                   <b>Modify</b>
                               </button>
                           </div>
                       </div>
                   </form>
               </div>
           </div>
           )
       }
});


module.exports = UserAdminApp;


