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
var ChallengeApprovalApp = require('./components/challenge/pending/ChallengePendingApp.jsx');
var ChallengeAcceptedApp = require('./components/challenge/approved/ChallengeApprovedApp.jsx');
var ChallengeSentApp = require('./components/challenge/sent/ChallengeSentApp.jsx');

var NavApp = require('./components/nav/NavApp.jsx');
var LoginApp = require('./components/LoginApp.jsx');
var LogoutApp = require('./components/LogoutApp.jsx');
var ErrorApp = require('./components/ErrorApp.jsx');
var AdminApp = require('./components/admin/AdminApp.jsx');
var StatApp = require('./components/stats/StatApp.jsx');
var HomeApp = require('./components/HomeApp.jsx');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <RouteHandler/>
            </div>
        );
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
        <Route name="logout" path="logout" handler={LogoutApp} />
        <Route name="nav" path="/app/:userId" handler={NavApp}>
            <Route name="login" path="login" handler={LoginApp} />
            <Route name="home" path="home" handler={HomeApp}/>
            <Route name="account" path="account" handler={HomeApp}/>
            <Route name="admin" path="admin" handler={AdminApp}/>
            <Route name="stats" path="stats"  handler={StatApp}/>
            <Route name="challenge" path="challenge" handler={ChallengeApp}>
                <Route name={ChallengeStatus.REQUEST.toLowerCase()} path={ChallengeStatus.REQUEST.toLowerCase()} handler={ChallengeApp}/>
                <Route name={ChallengeStatus.PENDING.toLowerCase()} path={ChallengeStatus.PENDING.toLowerCase()} handler={ChallengeApp}/>
                <Route name={ChallengeStatus.ACCEPTED.toLowerCase()} path={ChallengeStatus.ACCEPTED.toLowerCase()} handler={ChallengeApp}/>
                <Route name={ChallengeStatus.NOTIFY.toLowerCase()} path={ChallengeStatus.NOTIFY.toLowerCase()} handler={ChallengeApp}/>
                <Route name={ChallengeStatus.SENT.toLowerCase()} path={ChallengeStatus.SENT.toLowerCase()} handler={ChallengeApp}/>
                <Route name={ChallengeStatus.CANCELLED.toLowerCase()} path={ChallengeStatus.CANCELLED.toLowerCase()} handler={ChallengeApp}/>
            </Route>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});