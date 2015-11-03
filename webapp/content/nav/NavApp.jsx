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
var HomeApp = require('../home/HomeApp.jsx');
var Util = require('../../jsx/util.jsx');
var TopGunNav = require('./TopGun.jsx');

var NavApp = React.createClass({
    mixins: [UserContextMixin, History],

    getInitialState: function () {
        var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
        return {
            user: DataStore.getUser(),
            mobile : width < 768,
            toggleSide : width > 768,
            toggleProfile : false
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
    closeSide: function(e) {
        e.preventDefault();
        console.log('closing side');
        this.setState({toggleSide: false});
    },
    sideOpenClose: function(e) {
        e.preventDefault();
        this.setState({toggleSide: !this.state.toggleSide});
    },
    toggleProfile: function(e){
        e.preventDefault();
        this.setState({toggleProfile: !this.state.toggleProfile});
    },
    goToProfile : function(e){
        e.preventDefault();
        this.state.toggleProfile = false;
        this.props.history.pushState(null,'/app/profile');
    },
    goToLogin : function(e){
        e.preventDefault();
        this.state.toggleProfile = false;
        this.props.history.pushState(null,'/login');
    },
    render: function () {
        if (this.getUser().id == "0") {
            return null;
        }
        var profilePic = <i className="fa fa-user profile"></i>;
        if (this.getUser().profile) {
            profilePic = <img className="profile" src={this.getUser().userProfile.imageUrl + '?width=20&height=20'}> </img>
        }
        return (
            <div id="wrapper">
                <nav className="navbar navbar-inverse navbar-static-top" style={{marginBottom: 0}}>
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
                        <li className={"dropdown" + (this.state.toggleProfile ? " open" : "")}>
                            <a onClick={this.toggleProfile} href="#" className="dropdown-toggle" >
                                {profilePic}
                                <b className="caret"></b>
                            </a>
                            <ul className="profile-menu dropdown-menu">
                                <li>
                                    <a onClick={this.goToProfile} href="#"><i className="fa fa-fw fa-gear"></i> Profile</a>
                                </li>
                                <li className="divider"></li>
                                <li>
                                    <a onClick={this.goToLogin} href="#"><i className="fa fa-fw fa-power-off"></i> Log Out</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <div className={"navbar-default sidebar-nav navbar-collapse sidebar " + (this.state.toggleSide  ? " in " : " collapse") }>
                        <ul className="nav" id="side-menu">
                            <HomeNav    toggleSide={this.closeSide} params={this.props.params} history={this.props.history} location={this.props.location} />
                            <TeamNav    toggleSide={this.closeSide}  params={this.props.params} history={this.props.history} />
                            <TopGunNav  toggleSide={this.closeSide}  params={this.props.params} history={this.props.history} />
                            <AdminNav   toggleSide={this.closeSide}  params={this.props.params} history={this.props.history} />
                        </ul>
                    </div>
                </nav>
                <div id="page-wrapper">
                    {this.props.children}
                </div>
                <div id="footer">
                    
                </div>
            </div>
        )
    }
});
//   <StatNav />
/* <li className="sidebar-search">
                                <div className="input-group custom-search-form">
                                    <input type="text" className="form-control" placeholder="Search..."/>
                                    <span className="input-group-btn">
                                        <button className="btn btn-default" type="button">
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </span>
                                </div>
                            </li>h

 */
module.exports = NavApp;