var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var TeamNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            toggleTeam: false,
            teams: []
        }
    },
    componentDidMount: function () {
        this.getData();
    },
    getData: function() {
        Util.getSomeData({
            url: '/api/team/get/user',
            callback: function(d){ d.forEach(function(t) {t.active=true} ); this.setState({teams: d})}.bind(this),
            module: 'NavApp',
            router: this.props.history
        });
    },
    componentWillReceiveProps: function(nextProps) {
        //this.getData();
    },
    toggleTeam: function(e){
        e.preventDefault();
        this.setState({toggleTeam: !this.state.toggleTeam});
    },
    goToSchedule: function(s){
        return function(e){
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.toggleSide(e);
            this.props.history.pushState(null,'/app/schedule/' + s.id);
        }.bind(this)
    },
    goToLeader: function(s){
        return function(e){
            this.props.toggleSide(e);
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/season/' + s.id + '/leaders');
        }.bind(this)
    },
    goToStandings: function(t) {
        return function(e){
            this.props.toggleSide(e);
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id + '/' + this.getUser().id );
        }.bind(this)
    },
    expandTeam: function(t) {
        return function(e) {
            //this.props.toggleSide(e);
            e.preventDefault();
            t.toggle = t.toggle == undefined ? true : !t.toggle;
            //this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id + '/' + this.getUser().id );
            this.setState({});
        }.bind(this);
    },

    render: function() {
        var teamNav =  [];
        if (this.state.teams.length == 0) {
        //    return null;
        }
        var teamCls = this.context.location.pathname.indexOf("/app/display") > 0 ? "active" : "not-active";
        this.state.teams.forEach(function(t) {
            if (t.challenge)
                return;
            var s = t.season;
            var standingsClass = this.context.location.pathname.indexOf('display/') > 0 ? 'selected ' : "not-selected";
            var scheduleClass = this.context.location.pathname.indexOf('schedule/') > 0 ? 'selected ' : "not-selected";
            var leaderClass = this.context.location.pathname.indexOf('leader') > 0 ? 'selected ' : "not-selected";
            var toggle = t.toggle == undefined ? this.props.params.seasonId == t.season.id : t.toggle;
            teamNav.push(
                <li className={toggle ? "active dropdown" : "dropdown"} key={s.id}>
                    <a onClick={this.expandTeam(t)} href="#">
                        {t.name}
                        <span className={"fa fa-caret-" + (toggle ? "down side-caret" : "left side-caret")}></span>
                    </a>
                    <ul className={"nav nav-third-level collapse" + (toggle ? " selected in" : "")} aria-expanded="true">
                    <li className={standingsClass}>
                        <a onClick={this.goToStandings(t)} href="#">Standings</a>
                    </li>
                    <li className={scheduleClass}>
                        <a onClick={this.goToSchedule(s)} href="#">{'Schedule & Results'}</a>
                    </li>
                    <li className={leaderClass} >
                        <a onClick={this.goToLeader(s)} href="#">Division Leaders</a>
                    </li>
                    </ul>
                </li>
            );
        }.bind(this));

        return(
            <li className={this.state.toggleTeam ? "selected dropdown " + teamCls : teamCls + " dropdown"}>
                <a onClick={this.toggleTeam} href="#">
                    <i className="fa fa-fw fa-users"></i> My Teams
                    <span className={"fa fa-caret-" + (this.state.toggleTeam ? "down side-caret" : "left side-caret")} ></span>
                </a>
                <ul className={"nav nav-second-level collapse " + (this.state.toggleTeam ? " selected in"  : "")}>
                    {teamNav}
                </ul>
            </li>
        );

    }
});

module.exports = TeamNav;