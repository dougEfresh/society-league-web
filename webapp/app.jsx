var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var Status = require('./lib/Status');
var ChallengeRequestApp = require('./content/challenge/request/ChallengeRequestApp.jsx');
var ChallengePendingApp = require('./content/challenge/pending/ChallengePendingApp.jsx');
var ChallengeAcceptedApp = require('./content/challenge/accepted/ChallengeAcceptedApp.jsx');
var ChallengeSentApp = require('./content/challenge/sent/ChallengeSentApp.jsx');

var NavApp = require('./content/nav/NavApp.jsx');
var ResetApp = require('./jsx/../content/ResetApp.jsx');
var RegisterApp = require('./jsx/../content/RegisterApp.jsx');
var LoginApp = require('./jsx/../content/login/LoginApp.jsx');
var LogoutApp = require('./jsx/components/LogoutApp.jsx');
var ErrorApp = require('./jsx/components/ErrorApp.jsx');
var AdminApp = require('./content/admin/AdminApp.jsx');
var CreateUser = require('./content/admin/CreateUser.jsx');
var CreateUserSuccess = require('./content/admin/CreateUserSuccess.jsx');
var StatApp = require('./content/scout/StatApp.jsx');
var StatDisplay = require('./content/scout/StatsDisplay.jsx');
var StatHistory = require('./content/scout/StatHistory.jsx');
var HomeApp = require('./jsx/../content/home/HomeApp.jsx');
var TeamApp = require('./content/team/TeamApp.jsx');
var TeamStandings= require('./content/team/TeamStandings.jsx');
var TeamMemberResultsApp = require('./content/team/TeamMemberResults.jsx');
var TeamWeeklyResultsApp = require('./content/team/TeamWeeklyResults.jsx');
var TeamMatchResult= require('./content/team/TeamMatchResult.jsx');
var SeasonApp = require('./content/season/SeasonApp.jsx');
var SeasonLeaders = require('./content/season/SeasonLeaders.jsx');
var SeasonStandings = require('./content/season/SeasonStandings.jsx');
var SeasonResults = require('./content/season/SeasonResults.jsx');
var ChallengeSignUp = require('./content/challenge/ChallengeSignUp.jsx');
var ChallengeConfirmApp = require('./content/challenge/ChallengeConfirmApp.jsx');
var ChallengeMain= require('./content/challenge/Main.jsx');
var ChallengeApp = require('./content/challenge/ChallengeApp.jsx');
var LoadingApp = require('./jsx/components/LoadingApp.jsx');
var TeamChart = require('./content/team/TeamChart.jsx');
var UserApp  = require('./content/user/UserApp.jsx');
var UserPasswordApp = require('./content/user/UserPasswordApp.jsx');
var PayApp = require('./content/user/PayApp.jsx');
var UserInfo= require('./content/user/UserInfo.jsx');
var ChallengesApp = require('./content/admin/Challenges.jsx');
var ChallengesUsers= require('./content/admin/ChallengeUsers.jsx');
var ChallengeAdminResults= require('./content/admin/ChallengeAdminResults.jsx');

var App = React.createClass({
    render: function () {
        return (
            <div>
                <RouteHandler/>
                <div id='page-ready'></div>
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
        <Route name="reset" path="reset" handler={ResetApp} />
        <Route name="register" path="register" handler={RegisterApp} />
        <Route name="error" path="error" handler={ErrorApp} />
        <Route name="logout" path="logout" handler={LogoutApp} />
        <Route name="nav" path="/app" handler={NavApp}>
            <Route name="loading" path="loading" handler={LoadingApp} />
            <Route name="home" path="home" handler={HomeApp}/>
            <Route name="account" path="account" handler={HomeApp}/>
            <Route name="admin" path="admin" handler={AdminApp} >
                <Route name="createUser" path="create/user" handler={CreateUser} />
                <Route name="createUserSuccess" path="create/user/status" handler={CreateUserSuccess} />
                <Route name="challenges" path="challenges" handler={ChallengesApp} />
                <Route name="challengeUsers" path="challenge/user" handler={ChallengesUsers} />
                <Route name="challengeAdminResults" path="challenge/admin/results" handler={ChallengeAdminResults} />
            </Route>
            <Route name="user" path="user/:userId"  handler={UserApp}>
                <Route name="info" path="info" handler={UserInfo} />
                <Route name="password" path="password" handler={UserPasswordApp} />
                <Route name="pay" path="pay" handler={PayApp} />
            </Route>
            <Route name="scout" path="scout/:statsId"  handler={StatApp}>
                <Route name="stats" path="stats" handler={StatDisplay} />
                <Route name="history" path="history" handler={StatHistory} />
            </Route>
            <Route name="team" path="team/:teamId/:seasonId" handler={TeamApp} >
                <Route name="teamStandings" path="standings"  handler={TeamStandings} />
                <Route name="teamChart" path="chart"  handler={TeamChart} />
                <Route name="teamMemberResults" path="members"  handler={TeamMemberResultsApp} />
                <Route name="teamWeeklyResults" path="weekly"  handler={TeamWeeklyResultsApp} />
                <Route name="teamMatchResult" path="match/:teamMatchId"  handler={TeamMatchResult} />
            </Route>
            <Route name="season" path="season/:seasonId"  handler={SeasonApp} >
                <Route name="seasonLeaders" path="leaders"  handler={SeasonLeaders} />
                <Route name="seasonStandings" path="standings"  handler={SeasonStandings} />
                <Route name="seasonResults" path="results"  handler={SeasonResults} />
                <Route name="seasonWeeklyResults" path="matches"  handler={SeasonResults} />
            </Route>
            <Route name="challenge" path="challenge" handler={ChallengeApp} >
                <Route name="challengeMain" path="main"  handler={ChallengeMain} />
                <Route name="challengeSignUp" path="signup"  handler={ChallengeSignUp} />
                <Route name="challengeConfirm" path="confirm"  handler={ChallengeConfirmApp} />
                <Route name={Status.REQUEST.toLowerCase()} path={Status.REQUEST.toLowerCase()} handler={ChallengeRequestApp}/>
                <Route name={Status.PENDING.toLowerCase()} path={Status.PENDING.toLowerCase()} handler={ChallengePendingApp}/>
                <Route name={Status.ACCEPTED.toLowerCase()} path={Status.ACCEPTED.toLowerCase()} handler={ChallengeAcceptedApp}/>
                <Route name={Status.SENT.toLowerCase()} path={Status.SENT.toLowerCase()} handler={ChallengeSentApp}/>
            </Route>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});