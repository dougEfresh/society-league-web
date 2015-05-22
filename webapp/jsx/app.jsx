var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var ChallengeStatus = require('./constants/ChallengeStatus.jsx');
var ChallengeRequestApp = require('./components/challenge/request/ChallengeRequestApp.jsx');
var ChallengePendingApp = require('./components/challenge/pending/ChallengePendingApp.jsx');
var ChallengeAcceptedApp = require('./components/challenge/approved/ChallengeApprovedApp.jsx');
var ChallengeSentApp = require('./components/challenge/sent/ChallengeSentApp.jsx');

var NavApp = require('./components/nav/NavApp.jsx');
var LoginApp = require('./components/LoginApp.jsx');
var LogoutApp = require('./components/LogoutApp.jsx');
var ErrorApp = require('./components/ErrorApp.jsx');
var AdminApp = require('./components/admin/AdminApp.jsx');
var StatApp = require('./components/stats/StatApp.jsx');
var HomeApp = require('./components/home/HomeApp.jsx');
var TeamApp = require('./components/team/TeamApp.jsx');
var TeamResultApp = require('./components/team/TeamResults.jsx');
var SeasonApp = require('./components/season/SeasonApp.jsx');
var SeasonLeaders = require('./components/season/SeasonLeaders.jsx');
var SeasonResults = require('./components/season/SeasonResults.jsx');
var ResultsApp = require('./components/result/ResultApp.jsx');
var ChallengeSignUp = require('./components/challenge/ChallengeSignUp.jsx');
var LoadingApp = require('./components/LoadingApp.jsx');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <RouteHandler/>
                <div id='pageReady'></div>
            </div>
        );
    }
});

var RouteNotFound = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function(){
        return (<div><h1><Link to="challenge" params={{userId: 1000}} >Not Found</Link></h1></div>);
    }
});

var routes = (
    <Route handler={App}>
        <NotFoundRoute handler={RouteNotFound}/>
        <DefaultRoute name="default" handler={NavApp} />
        <Route name="login" path="login" handler={LoginApp} />
        <Route name="error" path="error" handler={ErrorApp} />
        <Route name="logout" path="logout" handler={LogoutApp} />
        <Route name="nav" path="/app" handler={NavApp}>
            <Route name="loading" path="loading" handler={LoadingApp} />
            <Route name="home" path="home" handler={HomeApp}/>
            <Route name="account" path="account" handler={HomeApp}/>
            <Route name="admin" path="admin" handler={AdminApp}/>
            <Route name="scout" path="scout/:statsId"  handler={StatApp}/>
            <Route name="team" path="team/:teamId/:seasonId"  handler={TeamApp} />
            <Route name="teamResults" path="team/results/:teamId/:seasonId"  handler={TeamResultApp} />
            <Route name="season" path="season/:seasonId"  handler={SeasonApp} />
            <Route name="seasonLeaders" path="season/leaders/:seasonId"  handler={SeasonLeaders} />
            <Route name="seasonResults" path="season/results/:seasonId"  handler={ResultsApp} />
            <Route name="teamMatchResult" path="season/:seasonId/:teamId/:teamMatchId"  handler={SeasonApp} />
            <Route name="challengeSignUp" path="challenge/signup"  handler={ChallengeSignUp} />
            <Route name={ChallengeStatus.REQUEST.toLowerCase()} path={'challenge/' + ChallengeStatus.REQUEST.toLowerCase()} handler={ChallengeRequestApp}/>
            <Route name={ChallengeStatus.PENDING.toLowerCase()} path={'challenge/' + ChallengeStatus.PENDING.toLowerCase()} handler={ChallengePendingApp}/>
            <Route name={ChallengeStatus.ACCEPTED.toLowerCase()} path={'challenge/' + ChallengeStatus.ACCEPTED.toLowerCase()} handler={ChallengeAcceptedApp}/>
            <Route name={ChallengeStatus.SENT.toLowerCase()} path={'challenge/' + ChallengeStatus.SENT.toLowerCase()} handler={ChallengeSentApp}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});