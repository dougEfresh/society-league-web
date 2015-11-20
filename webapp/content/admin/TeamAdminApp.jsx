var Qs = require('qs');
var React = require('react/addons');
var moment = require('moment');
var Router = require('react-router')
    , History = Router.History
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');
var firstBy = require('../../lib/FirstBy.js');

var TeamAdminApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            teams: [],
            selectedTeam: {id: '-1', name: 'New Team'}
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
    },
    render: function () {
        var teams = this.state.teams;
        if (teams.length == 0) {
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
                <TeamModifyApp team={this.state.selectedTeam} />
            </div>
        );
    }
});

var TeamModifyApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            team : this.props.team
        }
    },
    componentWillReceiveProps: function (n) {
        this.setState({team: n.team});
    },
    handleCreate: function() {
        if (this.state.season.id == undefined || this.state.season.id == '-1') {
            this.state.season.id = null;
            this.handleSubmit('create');
            return;
        }
        this.handleSubmit('modify');
    },
    handleSubmit: function(type) {
        var s = this.props.season;
        Util.sendData('/api/season/admin/' + type,s,function(d){
            this.setState({
                season: d,
                submitted: true
            });
        }.bind(this),
            function () { this.history.pushState(null, '/app/error');}
        ).bind(this);
    },
    onChange: function(type){
        return function() {
            if (!this.refs.hasOwnProperty(type)) {
                console.warn('Could not find prop ' + type + ' on refs');
                return;
            }
            this.state.season[type] = React.findDOMNode(this.refs[type]).value;
            this.setState({
                season:  this.state.season,
                changed: true
            });
        }.bind(this)
    },
    render: function () {
        if (!this.getUser().admin) {
            return (
                <div className="alert alert-error" role="alert">
                    <h3>Go away you plebian</h3>
                </div>
            );
        }
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
                                      className="form-control" >
                               </input>
                           </div>
                       </div>
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


