var React = require('react/addons');
var ReactRouter = require('react-router');
var History = ReactRouter.History;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoginApp = require('../login/LoginApp.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var TeamNav = require('./TeamNav.jsx');
var AdminNav = require('./AdminNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');
var HomeNav = require('./HomeNav.jsx');
var StatNav = require('./StatNav.jsx');
var ChallengeNav = require('./ChallengeNav.jsx');
var HomeApp = require('../home/HomeApp.jsx');
var Util = require('../../jsx/util.jsx');

var NavApp = React.createClass({
    mixins: [UserContextMixin, History],

    getInitialState: function () {
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return {
            user: DataStore.getUser(),
            toggleTeam: false,
            toggleSeason: false,
            toggleUser: false,
            toggleStats: false,
            teams: [],
            toggleTeamActive: {},
            seasons: [],
            mobile : width < 768,
            toggleSide : width > 768
        }
    },
    componentDidMount: function () {
        Util.getSomeData({
            url: '/api/user',
            callback: function (d) {
                DataStore.setUser(d);
                this.setState({
                    user: d
                });
                if (this.props.location.pathname == '/') {
                    this._onChange();
                    this.history.replaceState(null, '/app/home');
                    return
                }
            }.bind(this),
            router: this.props.history,
            module: 'NavApp',
            unAuthCallback: function () {
                this.history.pushState(null, '/login');
            }.bind(this)
        });

        Util.getSomeData({
            url: '/api/team/get/user',
            callback: function(d){ d.forEach(function(t) {t.active=true} ); this.setState({teams: d})}.bind(this),
            module: 'NavApp',
            router: this.props.history
        })
    },
    _onChange: function () {
        console.log('NavApp change: ' + this.getUser().id);
        this.setState({
            user: DataStore.getUser()
        });
    },
    changeTeam: function(t) {
        return function(e) {
            e.preventDefault();
            t.toggle = t.toggle == undefined ? true : !t.toggle;
            this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id + '/' + this.getUser().id );
        }.bind(this);

        /*
         return function(e) {
            this.setState({toggleSide: false});
            e.preventDefault();
            t.toggle = t.toggle == undefined ? true : !t.toggle;
            if (!this.state.mobile)
         this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id + '/' + this.getUser().id);
            else
                this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id);
            //this.setState({activeTeam: t, activeUser: null, activeSeason: t.season, show: 'standings'});
            console.log('Going  team to ' + t.name);
        }.bind(this);
        */

    },
    changeSeason: function(s) {
        return function(e) {
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/display/' + s.id);
            console.log('Going  season to ' + s.displayName);
        }.bind(this);
    },
    toggleTeam: function(e){
        e.preventDefault();
        this.setState({toggleTeam: !this.state.toggleTeam});
    },
    toggleSeason: function(e){
        e.preventDefault();
        this.setState({toggleSeason: !this.state.toggleSeason});
    },
    toggleDivision: function(s){
        return function(e) {
            e.preventDefault();
            s.toggle = s.toggle == undefined ? true : !s.toggle;
            this.setState({toggleSeason: this.state.toggleSeason});
        }.bind(this)
    },
    goHome: function(e) {
        e.preventDefault();
        this.closeSide(e);
        this.props.history.pushState(null,'/app/home');
    },
    closeSide: function(e) {
        e.preventDefault();
        this.setState({toggleSide: false});
    },
    sideOpenClose: function(e) {
        e.preventDefault();
        this.setState({toggleSide: !this.state.toggleSide});
    },
    goToSchedule: function(s){
        return function(e){
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/schedule/' + s.id);
        }.bind(this)
    },
    goToLeader: function(s){
        return function(e){
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/season/' + s.id + '/leaders');
        }.bind(this)
    },
    goToChallenge : function(s) {
        return function(e){
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/challenge');
        }.bind(this)
    },
    goToStandings: function(t) {
        return function(e){
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id + '/' + this.getUser().id );
        }.bind(this)
    },
    toggleStats: function(e) {
        e.preventDefault();
        this.props.history.pushState(null,'/app/stats/current');
    },
    render: function () {
        if (this.getUser().id == "0") {
            return null;
        }
        var active = 'home';
        if (this.props.location.pathname.indexOf('/app/home') > 0) {

        }
        var topGunNav = null;
        if (this.getUser().challenge) {
            var s = null;
            this.getUser().handicapSeasons.forEach(function(hs) {
                if (hs.season.challenge) {
                    s = hs.season;
                }
            });
            topGunNav = <li className={'not-active dropdown'}>
                  <a onClick={this.toggleDivision(s)} href="#">Top Gun<span className="fa arrow"></span></a>
                    <ul className={"nav nav-third-level collapse" + (s.toggle ? " selected in" : "")} aria-expanded="true">
                    <li>
                        <a onClick={this.goToChallenge(s)} href="#">Challenge</a>
                    </li>
                        <li>
                            <a onClick={this.goToSchedule(s)} href="#">Schedule</a>
                        </li>
                    <li className='selected'>
                        <a onClick={this.changeSeason(s)}href="#">Standings</a>
                    </li>
                    </ul>
            </li>;
        }

        var teamNav =  [];
        this.state.teams.forEach(function(t) {
            if (t.challenge)
                return;
            var s = t.season;
            var standingsClass = this.props.location.pathname.indexOf('display/') > 0 ? 'selected ' : "not-selected";
            var scheduleClass = this.props.location.pathname.indexOf('schedule/') > 0 ? 'selected ' : "not-selected";
            var leaderClass = this.props.location.pathname.indexOf('leader') > 0 ? 'selected ' : "not-selected";
            var toggle = t.toggle == undefined ? this.props.params.seasonId == t.season.id : t.toggle;
            teamNav.push(
                <li key={s.id}>
                    <a onClick={this.changeTeam(t)} href="#">{t.name}<span className="fa arrow"></span></a>
                    <ul className={"nav nav-third-level collapse" + (toggle ? " selected in" : "")} aria-expanded="true">
                    <li className={standingsClass}>
                        <a onClick={this.goToStandings(t)} href="#">Standings</a>
                    </li>
                    <li className={scheduleClass}>
                        <a onClick={this.goToSchedule(s)} href="#">Schedule</a>
                    </li>
                    <li className={leaderClass} >
                        <a onClick={this.goToLeader(s)} href="#">Division Leaders</a>
                    </li>
                    </ul>
                </li>
            );
        }.bind(this));

        var profilePic = <i className="fa fa-user profile"></i>;
        if (this.getUser().profile) {
            profilePic = <img className="profile" src={this.getUser().userProfile.imageUrl + '?width=20&height=20'}> </img>
        }
        return (
            <div id="wrapper">
                <nav className="navbar navbar-inverse navbar-static-top" role="navigation" style={{marginBottom: 0}}>
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" onClick={this.sideOpenClose}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand logo" href="http://www.societybilliards.com"></a>
                    </div>
                    <ul id="top-menu" className="nav navbar-top-links navbar-right">
                        <li className="dropdown">
                            <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                {profilePic}
                                {this.getUser().firstName} <b className="caret">
                                </b></a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a href="#"><i className="fa fa-fw fa-user"></i>Profile</a>
                                </li>
                                <li>
                                    <a href="#"><i className="fa fa-fw fa-gear"></i>Settings</a>
                                </li>
                                <li className="divider"></li>
                                <li>
                                    <a href="#"><i className="fa fa-fw fa-power-off"></i>Log Out</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div className={"navbar-default sidebar-nav navbar-collapse sidebar " + (this.state.toggleSide  ? " in " : " collapse") } role="navigation">
                        <ul className="nav" id="side-menu">
                            <li className="sidebar-search">
                                <div className="input-group custom-search-form">
                                    <input type="text" className="form-control" placeholder="Search..."/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-default" type="button">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </span>
                                </div>
                            </li>
                            <li >
                                <a onClick={this.goHome}  href="#"><i className="fa fa-fw fa-home"></i>Home</a>
                            </li>
                            <li className={this.state.toggleTeam ? "selected" : ""}>
                                <a onClick={this.toggleTeam} href="#"><i className="fa fa-fw fa-users"></i>My Teams<span className="fa arrow"></span></a>
                                <ul className={"nav nav-second-level collapse " + (this.state.toggleTeam ? " selected in"  : "")}>
                                    {teamNav}
                                </ul>
                            </li>
                            {topGunNav}
                            <li className={this.state.toggleStats ? "selected" : "not-selected"}>
                                <a onClick={this.toggleStats} href="charts.html"><i className="fa fa-fw fa-bar-chart-o"></i>Stats</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div id="page-wrapper">
                    {this.props.children}
                </div>
            </div>
        )
    }
});
module.exports = NavApp;