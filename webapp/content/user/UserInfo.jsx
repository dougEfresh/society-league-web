var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var PayApp = require('./PayApp.jsx');
var Util = require('../../jsx/util.jsx');

var UserInfo = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    _onChange: function(d) {
        console.log('onChange');
        DataStore.replaceUser(d);
        this.transitionTo('info');
    }, //
    challengeDates: function() {
        var dates = Util.getChallengeDates();
        var dateButtons = [];
        dates.forEach(function(d){
            dateButtons.push(<DateButton date={d} key={d} />);
        });
        return dateButtons;
    },
    challengeTimes: function() {
        var dates = Util.getChallengeDates();
        var timeButtons = [];
        var  times = [];
        var slots = DataStore.getSlots();
        slots = slots.sort(function(a,b){
            return a.getTime().localeCompare(b.getTime());
        });

        slots.forEach(function(s) {
            if (dates[0] == s.getDate()) {
                times.push(s.getTime());
            }
        });
        times.forEach(function(t){
            timeButtons.push(<TimeButton time={t} key={t} />);
        });
        return timeButtons;
    },
    onClickDates: function(e) {
        e.preventDefault();
        var profile = this.getUser().profile;
        var dates = this.getQuery().dates;
        if (dates == undefined) {
            return;
        }
        profile.blockDates = [];
        for(var d in dates) { profile.blockDates.push(d) }
        Util.sendData("/api/user/profile/modify", profile, this._onChange);
    },
    onClickTimes: function(e) {
        e.preventDefault();
    },
    render: function() {
         return (
             <div>
                 <div className="panel panel-success">
                     <div className="panel-heading" >
                         <span>Block out dates</span>
                     </div>
                     <div className="panel-body" >
                         <div className="page-elements">
                             <form id="request-app"  >
                                 <div className="btn-group select-time">
                                     {this.challengeDates()}
                                 </div>
                                 <button className={'btn btn-default'} onClick={this.onClickDates}>
                                     Submit
                                 </button>
                             </form>
                         </div>
                     </div>
                 </div>
                 <div className="panel panel-success">
                     <div className="panel-heading" >
                         <span>Block out times for all dates</span>
                     </div>
                     <div className="panel-body" >
                         <div className="page-elements">
                             <form id="request-app"  >
                                 <div className="btn-group select-time">
                                     {this.challengeTimes()}
                                 </div>
                                 <button className={'btn btn-default'} onClick={this.onClickTimes}>
                                     Submit
                                 </button>
                             </form>
                         </div>
                     </div>
                 </div>
             </div>
         );
    }
});

var DateButton = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    onClick: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        if (q.dates == undefined) {
            q.dates = {};
            q.dates[this.props.date] = 1;
            this.transitionTo('info',this.getParams(),q);
            return;
        }
        q.dates[this.props.date] =  q.dates[this.props.date] == 1 ? 0: 1;
        this.transitionTo('info',this.getParams(),q);
    },
    render: function() {
        var q = this.getQuery();
        var selected = (
            q.dates != undefined &&
            q.dates[this.props.date] > 0
        );
        return (
                <button className={selected ? 'btn btn-success' : 'btn btn-default'} onClick={this.onClick}>
                    <span className={selected ? 'fa fa-check' : 'fa fa-times'}></span>
                    {this.props.date.replace('2015-','').replace('-','/')}
                </button>
         );
    }
});

var TimeButton = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    onClick: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        if (q.times == undefined) {
            q.times = {};
            q.times[this.props.time] = 1;
            this.transitionTo('info',this.getParams(),q);
            return;
        }
        q.times[this.props.time] =  q.times[this.props.time] == 1 ? 0: 1;
        this.transitionTo('info',this.getParams(),q);
    },
    render: function() {
        var q = this.getQuery();
        var selected = (
            q.times != undefined &&
            q.times[this.props.time] > 0
        );
        return (
                <button className={selected ? 'btn btn-success' : 'btn btn-default'} onClick={this.onClick}>
                    <span className={selected ? 'fa fa-check' : 'fa fa-times'}></span>
                    {this.props.time}
                </button>
         );
    }
});
module.exports=UserInfo;