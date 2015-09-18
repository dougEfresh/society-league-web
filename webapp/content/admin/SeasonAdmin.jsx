var Qs = require('qs');
var React = require('react/addons');
var moment = require('moment');
var Router = require('react-router')
    , History = Router.History
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');
var firstBy = require('../../lib/FirstBy.js');

var SeasonAdminApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            update: Date.now(),
            seasons: [],
            divisions: []
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
        var now = Date.now();
        if (now - this.state.update > 1000*60)
            this.getData();
    },
    onChange: function (e) {
        e.preventDefault();
        var q = this.props.location.query;
        q.season = {id: e.target.value};
        this.history.pushState(null, '/app/admin/seasons',q);
    },
    getData: function() {
        Util.getData('/api/season', function(d){
            this.setState({seasons: d});
        }.bind(this),null,'UserAdminApp');
        Util.getData('/api/season/divisions', function(d){
            this.setState({divisions: d});
        }.bind(this),null,'SeasonAdminApp');
    },
    render: function () {
        var seasons = this.state.seasons;
        if (seasons.length == 0) {
            return null;
        }
        var options = [];
        options.push(<option key={'-1'} value={'-1'}>{'New Season'}</option>);
        seasons  = seasons.sort(function(a,b){
            return b.startDate.localeCompare(a.startDate);
        });
        seasons.forEach(function(s) {
            options.push(<option key={s.id} value={s.id}>{s.name}</option>);
        });
        var selectedSeason = this.props.location.query.season;
        if (selectedSeason == undefined) {
            selectedSeason = {id: '-1'}
        }
        this.state.seasons.forEach(function(s){
            if (s.id == selectedSeason.id) {
                selectedSeason = s;
            }
        });
        var select = (
            <select ref='season' onChange={this.onChange}
                    className="form-control"
                    value={selectedSeason.id}
                    type={'select'}>
                {options}
            </select>);
        return (
            <div id="season-admin-app">
                {select}
                <SeasonModifyApp season={selectedSeason} divisions={this.state.divisions} />
            </div>
        );
    }
});

var SeasonModifyApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        var s = this.props.season;
        return {
            season : s,
            submitted: false
        }
    },
    componentWillReceiveProps: function (n) {
        if (n.season != undefined && n.season.id  != this.state.season.id) {
            this.setState({
                season: n.season
            })
        }
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
        Util.sendData(s,'/api/season/admin/' + type,function(d){
            this.setState({
                season: d,
                submitted: true
            });
        }.bind(this));
    },
    onChange(type){
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
        var s = this.state.season;
        var startDates = [];
        var now = moment();
        if (s.startDate == undefined) {
            s.startDate = now.format('YYYY-MM-DDThh:mm:ss');
        }
        if (s.year == undefined) {
            s.year = now.format('YYYY-MM-DD');
        }
        if (s.status == undefined) {
            s.status = 'INACTIVE';
        }
        startDates.push(<option key={s.startDate} value={s.startDate}>{s.startDate.split('T')[0]}</option>);
        for(var i = 1; i< 45; i++) {
            var future = now.add(1,'days').format();
            startDates.push(<option key={future} value={future}>{future.split('T')[0]}</option>);
        }
        var divisionOptions = [];
        divisionOptions.push(<option key={'UNKNOWN'} value={'UNKONWN'}>Unknown</option>);
        this.props.divisions.forEach(function(d){
            divisionOptions.push(<option key={d} value={d}>{d}</option>);
        });
        var header =  <h2><span className="fa fa-user-plus"></span>{s.name}</h2>;
        if (this.state.submitted) {
            setTimeout(function () {
                this.setState({
                    submitted: false
                })
            }.bind(this), 2000);
            header =  (
                <div className="alert alert-success" role="alert">
                    {'Modified Season! ' + s.name}
                </div>
            );
        }
        return (
           <div id="modify-user" className="panel panel-default">
               <div className="panel-heading">
                   {header}
               </div>
               <div className="panel-body">
                   <form id='login' className="login-form form-signin form-horizontal">
                       <div className="form-group">
                           <label htmlFor="year" className="col-sm-2 control-label">Year</label>
                           <div className="col-sm-10">
                               <select ref='year' onChange={this.onChange('year')} className="form-control" value={s.year}  type={'select'}>
                                   <option key={'2016'} value={'2016'}>2016</option>
                                   <option key={'2015'} value={'2015'}>2015</option>
                               </select>
                           </div>
                       </div>
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
                                   <option key={'UNKNOWN'} value={'UNKNOWN'}>Unknown</option>
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


module.exports = SeasonAdminApp;


