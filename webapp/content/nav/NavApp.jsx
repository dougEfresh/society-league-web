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
            this.setState({toggleSide: false});
            e.preventDefault();
            if (!this.state.mobile)
                this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id + '/' + this.getUser().id);
            else
                this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id);
            //this.setState({activeTeam: t, activeUser: null, activeSeason: t.season, show: 'standings'});
            console.log('Going  team to ' + t.name);
        }.bind(this);
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
    render: function () {
        if (this.getUser().id == "0") {
            return null;
        }
        var active = 'home';
        if (this.props.location.pathname.indexOf('/app/home') > 0) {

        }
        var challengeNav = null;
        //if (this.getUser().challenge) {
        challengeNav = <li className={'notActive dropdown'}>
            <a href="#/app/challenge">Top Gun</a>
        </li>;
        //}

        var teamNav =  [];
        this.state.teams.forEach(function(t) {
            var cls = t.active ? "active" : "notactive";
            teamNav.push(
                <li className={cls} key={t.id}>
                    <a onClick={this.changeTeam(t)} href="#">{t.name}</a>
                </li>);

        }.bind(this));

        var seasonNav =  [];
        this.getUser().handicapSeasons.forEach(function(s) {
            if (!s.season.active) {
                return;
            }
            seasonNav.push(
                <li className="" key={s.season.id}>
                    <a onClick={this.toggleDivision(s)} href="#">{s.season.displayName}<span className="fa arrow"></span></a>
                    <ul className={"nav nav-third-level collapse" + (s.toggle ? " in" : "")} aria-expanded="true">
                    <li>
                        <a href="#">Schedule</a>
                    </li>
                    <li>
                        <a href="#">Standings</a>
                    </li>
                    <li>
                        <a href="#">Leaders</a>
                    </li>
                </ul>
                </li>
            );
            //

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
                                    <a href="#"><i className="fa fa-fw fa-user"></i> Profile</a>
                                </li>
                                <li>
                                    <a href="#"><i className="fa fa-fw fa-gear"></i> Settings</a>
                                </li>
                                <li className="divider"></li>
                                <li>
                                    <a href="#"><i className="fa fa-fw fa-power-off"></i> Log Out</a>
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
                                <a onClick={this.goHome}  href="#"><i className="fa fa-fw fa-home"></i> Home</a>
                            </li>
                            <li className={this.state.toggleTeam ? "active" : "notactive"}>
                                <a onClick={this.toggleTeam} href="#"><i className="fa fa-fw fa-users"></i> My Teams<span className="fa arrow"></span></a>
                                <ul className={"nav nav-second-level collapse " + (this.state.toggleTeam ? " in"  : "")}>
                                    {teamNav}
                                </ul>
                            </li>
                            <li className={this.state.toggleSeason ? "active" : "notactive"}>
                                <a onClick={this.toggleSeason} href="#">
                                    <i className="fa fa-fw fa-users"></i>Divisions<span className="fa arrow"></span></a>
                                <ul className={"nav nav-second-level collapse " + (this.state.toggleSeason ? "in" : "")}>
                                    {seasonNav}
                                </ul>
                            </li>
                            <li>
                                <a href="charts.html"><i className="fa fa-fw fa-bar-chart-o"></i>Stats</a>
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