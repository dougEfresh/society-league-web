var React = require('react/addons');
var ReactRouter = require('react-router');
var History = ReactRouter.History;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoginApp = require('../login/LoginApp.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var LoadingApp  = require('../../jsx/components/LoadingApp.jsx');
var TeamNav = require('./TeamNav.jsx');
var AdminNav = require('./AdminNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');
var HomeNav = require('./HomeNav.jsx');
var StatNav = require('./StatNav.jsx');
var ChallengeNav = require('./ChallengeNav.jsx');
var HomeApp = require('../home/HomeApp.jsx');
var Util = require('../../jsx/util.jsx');

var NavApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
         return {
             user: DataStore.getUser()
         }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        Util.getSomeData({
            url: '/api/user',
            callback: function(d) {
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
            unAuthCallback: function() {this.history.pushState(null, '/login');}.bind(this)
        });
    },
    componentWillReceiveProps: function() {
    },
    _onChange: function(){
        console.log('NavApp change: ' + this.getUser().id );
        this.setState({
            user: DataStore.getUser()
        });
    },
    render: function() {
        if (this.getUser().id == "0") {
            return null;
        }
        var active = 'home';
        if (this.props.location.pathname.indexOf('/app/home') > 0) {

        }
        var challengeNav = null;
        //if (this.getUser().challenge) {
            challengeNav =   <li className={'notActive dropdown'}>
                <a href="#/app/challenge">Top Gun</a>
            </li>;
        //}

        return (
            <div style={{style: 'inline'}}>
            <nav className="navbar navbar-inverse navbar-fixed-top ss-navbar-background">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand logo" href="http://www.societybilliards.com"></a>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav">
                            <li className={active == 'home' ? 'active dropdown' : 'notActive dropdown'}>
                                <a href="#/app/home">Home</a>
                            </li>
                            {challengeNav}
                            <li><a href={"#/app/scout/" + this.getUser().id + '/stats'}>Stats</a></li>
                            <li><a href="#contact">{'Profile'}</a></li>
                        </ul>
                        <form className="navbar-form navbar-right">

                            <input type="text" className="form-control" placeholder="Search..."/>
                        </form>
                    </div>
                </div>
            </nav>
                {this.props.children}
            </div>
        )
    }
});
/*
<li className="dropdown">
    <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Profile <span className="caret"></span></a>
    <ul className="dropdown-menu">
        <li><a href="#">Reset Password</a></li>
        <li><a href="#">Another action</a></li>
        <li><a href="#">Something else here</a></li>
        <li role="separator" className="divider"></li>
        <li className="dropdown-header">Nav header</li>
        <li><a href="#">Separated link</a></li>
        <li><a href="#">One more separated link</a></li>
    </ul>
</li>
   */
module.exports = NavApp;