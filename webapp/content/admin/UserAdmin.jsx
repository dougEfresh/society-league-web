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
            handicaps: []
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
            this.history.pushState(null, '/app/admin/users');
            return;
        }
        var user = null;
        this.state.users.forEach(function(u){
            if (u.id == e.target.value) {
                user = u;
            }
        });
        var q = this.props.location.query;
        q.user = Qs.stringify(user);

        this.history.pushState(null, '/app/admin/users',q);
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
    render: function () {
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
        var selectedUser = Qs.parse(this.props.location.query.user);
        var select = (
            <select ref='user' onChange={this.onChange}
                    className="form-control"
                    value={selectedUser !=  undefined ? selectedUser.id : '-1' }
                    type={'select'}>
                {options}
            </select>);
        return (
            <div id="user-admin-app">
                {select}
                <UserModifyApp user={selectedUser} handicaps={handicaps}/>
            </div>
        );
    }
});

var UserModifyApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            handicapSeasons : []
        }
    },
    handleCreate: function() {

    },
    handleModify: function() {
        this.handleSubmit('modify');
    },
    handleSubmit: function(type) {
        var u = this.props.user;
        u.firstName =  React.findDOMNode(this.refs.firstName).value;
        u.lastName =  React.findDOMNode(this.refs.lastName).value;
        u.email =  React.findDOMNode(this.refs.email).value;
        if (u.handicapSeasons == undefined) {
            u.handicapSeasons = [];
        }
        u.handicapSeasons.forEach(function(hs){
            hs.season = {id: hs.season.id};
            hs.handicapDisplay = null;
        });
        Util.sendData(u,'/api/user/admin/' + type,function(d){
            var query = {user: Qs.stringify(d),submitted:true};
            this.history.pushState(null, '/app/admin/users', query);
        }.bind(this));
    },
    handicapChange: function(e) {
        e.preventDefault();
        var u = this.props.user;
        u.handicapSeasons.forEach(function(hs) {
            if (this.refs['handicap-' + hs.season.id] == undefined) {
                return ;
            }
            var handicapSeasonRef = React.findDOMNode(this.refs['handicap-' + hs.season.id]);
            if (handicapSeasonRef == undefined) {
                return;
            }
            var handicap = handicapSeasonRef.value.split("-")[0];
            var seasonId = handicapSeasonRef.value.split("-")[1];
            if (hs.season.id == seasonId) {
                hs.handicap = handicap;
            }
        }.bind(this));
        var query = {user: Qs.stringify(u)};
        this.history.pushState(null, '/app/admin/users', query);
    },
    statusChange: function(e) {
        e.preventDefault();
        var u = this.props.user;
        u.status =  React.findDOMNode(this.refs.status).value;
        var query = {user: Qs.stringify(u)};
        this.history.pushState(null, '/app/admin/users', query);
    },
    roleChange: function(e) {
        e.preventDefault();
        var u = this.props.user;
        u.role =  React.findDOMNode(this.refs.role).value;
        var query = {user: Qs.stringify(u)};
        this.history.pushState(null, '/app/admin/users', query);
    },
    getHandicaps: function() {
        var seasons = [];
        if (this.props.user.handicapSeasons == undefined || this.props.user.handicapSeasons.length == 0) {
            return null;
        }
        this.props.user.handicapSeasons.forEach(function(hs) {
            var options = [];
            var s = hs.season;
            this.props.handicaps.forEach(function(h) {
                options.push(<option key={h + '-' + s.id} value={h + '-' + s.id}>{h}</option>);
            });
            var select = (
                <select ref={'handicap-'+ s.id} onChange={this.handicapChange}
                        className="form-control"
                        value={hs.handicap + '-' + s.id}
                        type={'select'}>
                    {options}
                </select>);

             seasons.push(
                 <div key={s.id} className="form-group">
                     <label htmlFor="season" className="col-sm-2 control-label">{s.name.split(',')[2]}</label>
                     <div className="col-sm-10">
                         {select}
                     </div>
                 </div>
             );
        }.bind(this));
        return seasons;
    },
    render: function () {
        var u = this.props.user;
        if (u == undefined) {
            u = {}
        }
        return (
           <div id="modify-user" className="panel panel-default">
               <div className="panel-heading">
                   <h2><span className="fa fa-user-plus"></span>{u.name}</h2>
               </div>
               <div className="panel-body">
                   <form id='login' className="login-form form-signin form-horizontal">
                       <div className="form-group">
                           <label htmlFor="firstname" className="col-sm-2 control-label">First Name</label>
                           <div className="col-sm-10">
                               <input ref='firstName' id="firstname"
                                      type="input" name="firstName"
                                      placeholder={u.firstName == undefined ? "enter first name" : u.firstName}
                                      className="form-control" />
                           </div>
                       </div>
                       <div className="form-group">
                           <label htmlFor="lastname" className="col-sm-2 control-label">Last Name</label>
                           <div className="col-sm-10">
                               <input ref='lastName' id="lastname" type="input" name="lastName"
                                      placeholder={u.lastName == undefined ? "enter lastname name" : u.lastName}
                                      className="form-control" />
                           </div>
                       </div>
                       <div className="form-group">
                           <label htmlFor="email" className="col-sm-2 control-label">Email</label>
                           <div className="col-sm-10">
                               <input ref='email' id="email" type="input" name="email"
                                      placeholder={u.email == undefined ? "enter lastname name" : u.email}
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
                                <button style={{display: u.id == undefined ? 'inline' : 'none'}} id="submit" type="button" onClick={this.handleCreate} className="btn btn-sm btn-primary btn-responsive">
                                   <b>Create</b>
                               </button>
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

var UseHandicapSeasons = React.createClass({
     render: function () {
         var u = this.props.user;
         if (u == null || u == undefined || u.id == "-1") {
             return null;
         }

     }


});
module.exports = UserAdminApp;


