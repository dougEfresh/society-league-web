var Qs = require('qs');
var React = require('react/addons');
var moment = require('moment');
var Router = require('react-router')
    , History = Router.History
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');
var firstBy = require('../../lib/FirstBy.js');
var Select = require('react-super-select');

var TeamAdminApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            teams: [],
            users : [],
            selectedTeam: {id: '-1', name: 'New Team', season: {id: '-1'}}
        }
    },
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
    },
    onChange: function (e) {
        e.preventDefault();
        var t = null;
        this.state.teams.forEach(function(team){
            if (team.id == e.target.value) {
                t = team;
            }
        });
        this.setState({selectedTeam: t});
    },
    getData: function() {
        Util.getSomeData({
            url: '/api/team/active',
            callback: function(d){
                this.setState({teams: d.filter(function(e){ return !e.season.challenge})})}.bind(this),
            module: 'TeamAdminApp',
            router: this.props.history
        });
          Util.getSomeData({
            url: '/api/user/all',
            callback: function(d){
                this.setState({users: d})}.bind(this),
            module: 'TeamAdminApp',
            router: this.props.history
        });
    },
    render: function () {
        var teams = this.state.teams;
        if (teams.length == 0 || this.state.users.length == 0) {
            return null;
        }
        var options = [];
        options.push(<option key={'-1'} value={'-1'}>{'New Team'}</option>);
        teams  = teams.sort(function(a,b){
            return a.name.localeCompare(b.name);
        });
        teams.forEach(function(s) {
            options.push(<option key={s.id} value={s.id}>{s.name}</option>);
        });

        var select = (
            <select ref='season' onChange={this.onChange}
                    className="form-control"
                    value={this.state.selectedTeam.id}
                    type={'select'}>
                {options}
            </select>);
        return (
            <div id="season-admin-app">
                {select}
                <TeamModifyApp users={this.state.users} team={this.state.selectedTeam} />
            </div>
        );
    }
});



var TeamModifyApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            team : this.props.team,
            members: [],
            modifiedMembers: [],
            users: this.props.users
        }
    },
    componentWillReceiveProps: function (n) {
        if (n.team.id != '-1')
         Util.getSomeData(
            { url: '/api/stat/team/' + n.team.id + '/members',
                callback: function(d) {this.setState({members: d})}.bind(this),
                module: 'TeamStandings',
                router: this.props.history}
        );
        this.setState({team: n.team});
    },
    componentDidMount: function() {
        if (this.state.team && this.state.team.id != '-1')
         Util.getSomeData(
            { url: '/api/stat/team/' + this.state.team.id + '/members',
                callback: function(d) {this.setState({members: d})}.bind(this),
                module: 'TeamAdmin',
                router: this.props.history}
        );
    },
    handleCreate: function() {
        this.handleSubmit();
    },
    handleSubmit: function() {
        var t = {
            id: this.state.team.id,
            name: this.state.team.name,
            season: {id: this.state.team.season.id},
            members : {id: null, captain: null, members: []}
        };
        this.state.modifiedMembers.forEach(function(m) {
            t.members.members.push({id: m.id});
        }.bind(this));
        Util.postSomeData(
            {url: '/api/team/admin/modify',data: t,callback: function(d){this.setState({team: d}) ; this.componentDidMount()}.bind(this)
            });
    },
    onChange: function(e){
        e.preventDefault();
        this.state.team.name = e.target.value;
        this.forceUpdate();
    },
    getData: function() {
        var sel = [];
        this.props.users.forEach(function(m){
            if (!m.active)
                return;
            var hasSeason = false;
            m.handicapSeasons.forEach(function(hs) {
                if (hs.season.id == this.props.team.season.id)
                hasSeason = true;
            }.bind(this));

            if (hasSeason && m.id != undefined )
                sel.push({id: m.id, name: m.name, size:"small"});
        }.bind(this));
        return sel;
    },
    getMembers: function() {
        var mem = [];
      this.state.members.forEach(function(m) {
          if (m.user.real)
              mem.push({id: m.user.id, name: m.user.name, size: "small"});
      }.bind(this));
        return mem;
    },
    handleChange: function(option) {
        this.setState({modifiedMembers: option});
        console.log(JSON.stringify(option));
    },
    render: function () {
        if (!this.getUser().admin) {
            return (
                <div className="alert alert-error" role="alert">
                    <h3>Go away you plebian</h3>
                </div>
            );
        }
        var sel = <Select placeholder="Users"
                          dataSource={this.getData()}
                          initialValue={this.getMembers()}
                          tags={true}
                          onChange={this.handleChange}   />;
        return (
           <div id="modify-user" className="panel panel-default">
               <div className="panel-heading">
               </div>
               <div className="panel-body">
                   <form id='login' className="login-form form-signin form-horizontal">
                       <div className="form-group">
                            <label htmlFor="firstName" className="col-sm-2 control-label">Name</label>
                           <div className="col-sm-10">
                               <input ref='name' id="name"
                                      type="input" name="name"
                                      value={this.state.team.name}
                                      onChange={this.onChange}
                                      className="form-control" >
                               </input>
                           </div>
                       </div>
                       {sel}
                       <div className="form-group">
                           <div className="col-sm-offset-2 col-sm-10">
                                <button id="create" type="button" onClick={this.handleCreate} className="btn btn-sm btn-primary btn-responsive">
                                   <b>Create/Modify</b>
                               </button>
                           </div>
                       </div>
                   </form>
               </div>
           </div>
           )
       }
});

/*
                       <div className="form-group">
                           <label htmlFor="division" className="col-sm-2 control-label">Division</label>
                           <div className="col-sm-10">
                               <select ref='division' onChange={this.onChange('division')}  className="form-control" value={s.division}  type={'select'}>
                                   {divisionOptions}
                               </select>
                           </div>
                       </div>
                       <div className="form-group">
                           <label htmlFor="type" className="col-sm-2 control-label">Type</label>
                           <div className="col-sm-10">
                               <select ref='type' onChange={this.onChange('type')} className="form-control" value={s.type == undefined ? "UNKNOWN" : s.type}
                                       type={'select'}>
                                   <option key={'UNKNOWN'} value={'UNKNOWN'}>Choose Type</option>
                                   <option key={'WINTER'} value={'WINTER'}>Winter</option>
                                   <option key={'SPRING'} value={'SPRING'}>Spring</option>
                                   <option key={'SUMMER'} value={'SUMMER'}>Summer</option>
                               </select>
                           </div>
                       </div>
                       <div className="form-group">
                           <label htmlFor="startDate" className="col-sm-2 control-label">StartDate</label>
                           <div className="col-sm-10">
                                  <select ref='startDate' onChange={this.onChange('startDate')} className="form-control" value={s.startDate}  type={'select'}>
                                      {startDates}
                               </select>
                           </div>
                       </div>
                         <div className="form-group">
                           <label htmlFor="status" className="col-sm-2 control-label">status</label>
                           <div className="col-sm-10">
                               <select ref='status' onChange={this.onChange('status')} className="form-control" value={s.seasonStatus}  type={'select'}>
                                   <option key={'INACTIVE'} value={'INACTIVE'}>Disable</option>
                                   <option key={'ACTIVE'} value={'ACTIVE'}>Active</option>
                               </select>
                           </div>
                       </div>
 */

module.exports = TeamAdminApp;


