var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var ChallengeStatus = require('./constants/ChallengeStatus.jsx');
var ChallengeApp = require('./components/challenge/ChallengeApp.jsx');
var ChallengeRequestApp = require('./components/challenge/request/ChallengeRequestApp.jsx');
var ChallengeNotifyApp = require('./components/challenge/notify/ChallengeNotifyApp.jsx');
var NavApp = require('./components/NavApp.jsx');
var LoginApp = require('./components/LoginApp.jsx');
var LogoutApp = require('./components/LogoutApp.jsx');
var ErrorApp = require('./components/ErrorApp.jsx');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <RouteHandler/>
            </div>
        );
    }
});

var Stats = React.createClass({
    render: function () {
        return (<div>Stats</div>);
    }
});

var Home = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {
        return (
            <div>
        </div>);
    }
});
var RouteNotFound = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function(){
        return (<div><h1><Link to="challenge" params={{userId: 1000}} >Challenge Someone</Link></h1></div>);
    }
});

var routes = (
    <Route handler={App}>
        <NotFoundRoute handler={RouteNotFound}/>
        <DefaultRoute handler={LoginApp} />
        <Route name="error" path="error" handler={ErrorApp} />
        <Route name="login" path="/" handler={LoginApp} />
        <Route name="logout" path="logout" handler={LogoutApp} />
        <Route name="nav" path="/:userId" handler={NavApp}>
            <Route name="home" path="home" handler={Home}/>
            <Route name="account" path="account" handler={Home}/>
            <Route name="admin" path="admin" handler={Home}/>
            <Route name="challenge" path="challenge" handler={ChallengeApp}>
                <Route name={ChallengeStatus.REQUEST.toLowerCase()} path={ChallengeStatus.REQUEST.toLowerCase()} handler={ChallengeRequestApp}/>
                <Route name={ChallengeStatus.PENDING.toLowerCase()} path={ChallengeStatus.PENDING.toLowerCase()} handler={ChallengeRequestApp}/>
                <Route name={ChallengeStatus.ACCEPTED.toLowerCase()} path={ChallengeStatus.ACCEPTED.toLowerCase()} handler={ChallengeRequestApp}/>
                <Route name={ChallengeStatus.NEEDS_NOTIFY.toLowerCase()} path={ChallengeStatus.NEEDS_NOTIFY.toLowerCase()} handler={ChallengeNotifyApp}/>
                <Route name={ChallengeStatus.SENT.toLowerCase()} path={ChallengeStatus.SENT.toLowerCase()} handler={ChallengeRequestApp}/>
            </Route>
            <Route name="stats" path="stats" handler={Stats}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});