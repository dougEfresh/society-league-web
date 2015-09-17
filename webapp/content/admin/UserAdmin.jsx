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
        return (
            <div id="user-admin-app">
                {select}
                <UserModifyApp  seasons={this.state.seasons} user={selectedUser} handicaps={handicaps}/>
            </div>
        );
    }
});

var UserModifyApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        var u = this.props.user;
        return {
            id: u.id,
            firstName: u.firstName,
            lastName: u.lastName,
            email: u.email
        }
    },
    componentWillReceiveProps: function (n) {
        if (this.state.id != n.user.id) {
            this.setState({
                id: n.user.id,
                firstName: n.user.firstName,
                lastName: n.user.lastName,
                email: n.user.email
            })
        }
    },
    handleCreate: function() {
        this.handleSubmit('create');
    },
    handleModify: function() {
        this.handleSubmit('modify');
    },
    handleSubmit: function(type) {
        var u = this.props.user;
        u.firstName =  React.findDOMNode(this.refs.firstName).value.length > 1 ? React.findDOMNode(this.refs.firstName).value : u.firstName;
        u.lastName =  React.findDOMNode(this.refs.lastName).value.length > 1 ? React.findDOMNode(this.refs.lastName).value : u.lastName;
        u.email =  React.findDOMNode(this.refs.email).value .length > 1 ?  React.findDOMNode(this.refs.email).value : u.email;

        if (u.handicapSeasons == undefined) {
            u.handicapSeasons = [];
        }
        var handicapSeasons = [];
        u.handicapSeasons.forEach(function(hs){
            if (hs.handicap != 'NA') {
                hs.season = {id: hs.season.id};
                hs.handicapDisplay = null;
                handicapSeasons.push(hs);
            }
        });
        u.handicapSeasons = handicapSeasons;
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
        if (this.props.user.handicapSeasons == undefined) {
            this.props.user.handicapSeasons = [];
        }
        this.props.seasons.forEach(function(s){
            if (!s.active)
                return;

            var found = false;
            this.props.user.handicapSeasons.forEach(function (hs) {
                if (hs.season.id == s.id) {
                    found = true;
                }
            });
            if (found)
                return;

            this.props.user.handicapSeasons.push({handicap: 'NA', season: s});
        }.bind(this));

        this.props.user.handicapSeasons.forEach(function(hs) {
            if (!hs.season.active) {
                return;
            }
            var options = [];
            var s = hs.season;
            options.push(<option key={'NA-' + s.id} value={'NA-' + s.id}>{'NA'}</option>);
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
    onChange: function(e) {
        e.preventDefault();
        var firstName =  React.findDOMNode(this.refs.firstName).value;
        var lastName =  React.findDOMNode(this.refs.lastName).value;
        var email =  React.findDOMNode(this.refs.email).value;
        this.setState({
            firstName: firstName,
            lastName: lastName,
            email: email
        })

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
                           <label htmlFor="firstName" className="col-sm-2 control-label">First Name</label>
                           <div className="col-sm-10">
                               <input ref='firstName' id="firstname"
                                      type="input" name="firstName"
                                      value = {this.state.firstName} onChange={this.onChange}
                                      className="form-control" />
                           </div>
                       </div>
                       <div className="form-group">
                           <label htmlFor="lastName" className="col-sm-2 control-label">Last Name</label>
                           <div className="col-sm-10">
                               <input ref='lastName' id="lastname" type="input" name="lastName"
                                      value = {this.state.lastName} onChange={this.onChange}
                                      className="form-control" />
                           </div>
                       </div>
                       <div className="form-group">
                           <label htmlFor="email" className="col-sm-2 control-label">Email</label>
                           <div className="col-sm-10">
                               <input ref='email' id="email" type="input" name="email"
                                      value = {this.state.email}
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
                                <button style={{display: u.id == undefined ? 'inline' : 'none'}} id="create" type="button" onClick={this.handleCreate} className="btn btn-sm btn-primary btn-responsive">
                                   <b>Create</b>
                               </button>
                               <button  style={{display: u.id == undefined ? 'none' : 'inline'}} id="submit" type="button" onClick={this.handleModify} className="btn btn-sm btn-primary btn-responsive">
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


