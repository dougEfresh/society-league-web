var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var PayApp = require('./PayApp.jsx');
var Util  = require('../../jsx/util.jsx');
var moment = require('moment');

var UserInfo = React.createClass({
    render: function() {
        var nextChallengeDate = Util.nextChallengeDate();
        var dates = [];
        // Add the next 4 weeks as options
        [0,1,2,3,4].forEach(function(i) {
            dates.push(moment(nextChallengeDate).add(i,'weeks').format('YYYY-MM-DD'));
        });

        var blockDates = [];
        dates.forEach(function(d) {
                blockDates.push(<BlockDate key={d} date={d} />);
            }.bind(this)
        );
        var blockTimes = [];
        var slots= DataStore.getSlots();
        slots.forEach(function(s){
            if (s.getDate() == nextChallengeDate) {
                blockTimes.push(<BlockTime time={s.getTime()} />);
            }
        }.bind(this));
        return (
            <div id="user-info-app">
                {blockDates}
                {blockTimes}
            </div>
        );
    }
});

var BlockDate = React.createClass({
    mixins: [Router.State,Router.Navigation],
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
        var selected = q.dates != undefined && q.dates[this.props.date] > 0;
        return (
            <button className={selected ? 'btn btn-success' : 'btn btn-default'}
                    onClick={this.onClick}>
                <span className={selected ? 'fa fa-check' : 'fa fa-times'}></span>
                {this.props.date.substr(5,5)}
            </button>
        );
    }
});

var BlockTime = React.createClass({
    mixins: [Router.State,Router.Navigation],
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
        var selected = q.times != undefined && q.times[this.props.time] > 0;
        return (
            <button className={selected ? 'btn btn-success' : 'btn btn-default'}
                    onClick={this.onClick}>
                <span className={selected ? 'fa fa-check' : 'fa fa-times'}></span>
                {this.props.time}
            </button>
        );
    }
});


module.exports=UserInfo;