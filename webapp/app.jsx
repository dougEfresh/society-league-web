var React = require('react/addons');
var ReactRouter = require('react-router')
    , Router = ReactRouter.Router
    , Route = ReactRouter.Route
    , Link = ReactRouter.Link
    , IndexRoute = ReactRouter.IndexRoute;

var Status = require('./lib/Status');
//var ChallengeRequestApp = require('./content/challenge/request/ChallengeRequestApp.jsx');
//var ChallengePendingApp = require('./content/challenge/pending/ChallengePendingApp.jsx');
//var ChallengeAcceptedApp = require('./content/challenge/accepted/ChallengeAcceptedApp.jsx');
//var ChallengeSentApp = require('./content/challenge/sent/ChallengeSentApp.jsx');
///var ChallengeSignUp = require('./content/challenge/ChallengeSignUp.jsx');
//var ChallengeConfirmApp = require('./content/challenge/ChallengeConfirmApp.jsx');
//var ChallengeMain= require('./content/challenge/Main.jsx');
//var ChallengeApp = require('./content/challenge/ChallengeApp.jsx');
//var ChallengesApp = require('./content/admin/Challenges.jsx');
//var ChallengesUsers= require('./content/admin/ChallengeUsers.jsx');
//var ChallengeAdminResults= require('./content/admin/ChallengeAdminResults.jsx');
//var ChallengeCancelApp= require('./content/challenge/cancel/CancelApp.jsx');

var UserAdminApp = require('./content/admin/UserAdmin.jsx');
//var CreateUser = require('./content/admin/CreateUser.jsx');
//var CreateUserSuccess = require('./content/admin/CreateUserSuccess.jsx');

var NavApp = require('./content/nav/NavApp.jsx');
var ResetApp = require('./jsx/../content/ResetApp.jsx');
var RegisterApp = require('./jsx/../content/RegisterApp.jsx');
var LoginApp = require('./jsx/../content/login/LoginApp.jsx');
var LogoutApp = require('./content/LogoutApp.jsx');
var ErrorApp = require('./jsx/components/ErrorApp.jsx');

var StatApp = require('./content/stat/StatApp.jsx');
var StatDisplay = require('./content/stat/StatsDisplay.jsx');
var StatHistory = require('./content/stat/StatHistory.jsx');
var HomeApp = require('./jsx/../content/home/HomeApp.jsx');
var TeamApp = require('./content/team/TeamApp.jsx');
var TeamStandings= require('./content/team/TeamStandings.jsx');
var TeamMemberResultsApp = require('./content/team/TeamMemberResults.jsx');
var SeasonApp = require('./content/season/SeasonApp.jsx');
var SeasonLeaders = require('./content/season/SeasonLeaders.jsx');
var SeasonStandings = require('./content/season/SeasonStandings.jsx');
var SeasonWeeklyResults = require('./content/season/SeasonWeeklyResults.jsx');
var SeasonMatchResultsOnDay = require('./content/season/SeasonMatchResultsOnDay.jsx');
var LoadingApp = require('./jsx/components/LoadingApp.jsx');
var TeamChart = require('./content/team/TeamChart.jsx');
var UserApp  = require('./content/user/UserApp.jsx');
//var UserPasswordApp = require('./content/user/UserPasswordApp.jsx');
//var PayApp = requiradme('./content/user/PayApp.jsx');
//svar UserInfo= require('./content/user/UserInfo.jsx');



var App = React.createClass({
    render: function () {
        return (
            <div>
                {this.props.children}
                <div id='page-ready'></div>
            </div>
        );
    }
});

var RouteNotFound = React.createClass({
    render: function(){
        return (<div><h1>Not Found</h1></div>);
    }
});
//<Route path="*" component={RouteNotFound}/>
var routes = (
    <Route path="/" component={App}>
        <IndexRoute component={NavApp} />
        <Route  path="login" component={LoginApp} />
        <Route  path="reset" component={ResetApp} />
        <Route  path="register" component={RegisterApp} />
        <Route  path="error" component={ErrorApp} />
        <Route  path="logout" component={LogoutApp} />
        <Route  path="app" component={NavApp}>
            <Route path="loading" component={LoadingApp} />
            <Route path="home" component={HomeApp}/>
            <Route path="account" component={HomeApp}/>
            <Route path="user"  component={UserApp}/>
            <Route path="admin" component={UserAdminApp} >
                <Route path="users" component={UserAdminApp} />
            </Route>
            <Route path="scout/:statsId"  component={StatApp}>
                <Route path="stats" component={StatDisplay} />
                <Route path="history" component={StatHistory} />
            </Route>
            <Route  path="team/:teamId" component={TeamApp} >
                <Route path="standings"  component={TeamStandings} />
                <Route path="chart"  component={TeamChart} />
                <Route path="members"  component={TeamMemberResultsApp} />
            </Route>
            <Route path="season/:seasonId"  component={SeasonApp} >
                <Route path="leaders"  component={SeasonLeaders} />
                <Route path="standings"  component={SeasonStandings} />
                <Route path="results"  component={SeasonWeeklyResults} />
                <Route path="teamresults/:matchId" component={SeasonMatchResultsOnDay} />
            </Route>
        </Route>
    </Route>
);

React.render((<Router>{routes}</Router>), document.getElementById('content'));
/*

 <Route name="createUser" path="create/user" component={CreateUser} />
 <Route name="createUserSuccess" path="create/user/status" component={CreateUserSuccess} />
 <Route name="challenges" path="challenges" component={ChallengesApp} />
 <Route name="challengeUsers" path="challenges/user" component={ChallengesUsers} />
 <Route name="challengeAdminResults" path="challenges/admin/results" component={ChallengeAdminResults} />
 </Route>


 <Route name="challenge" path="challenge" component={ChallengeApp} >
 <Route name="challengeMain" path="main"  component={ChallengeMain} />
 <Route name="challengeSignUp" path="signup"  component={ChallengeSignUp} />
 <Route name="challengeConfirm" path="confirm"  component={ChallengeConfirmApp} />
 <Route name='challengeCancel' path="cancel"  component={ChallengeCancelApp} />
 <Route name={Status.REQUEST.toLowerCase()} path={Status.REQUEST.toLowerCase()} component={ChallengeRequestApp}/>
 <Route name={Status.PENDING.toLowerCase()} path={Status.PENDING.toLowerCase()} component={ChallengePendingApp}/>
 <Route name={Status.ACCEPTED.toLowerCase()} path={Status.ACCEPTED.toLowerCase()} component={ChallengeAcceptedApp}/>
 <Route name={Status.SENT.toLowerCase()} path={Status.SENT.toLowerCase()} component={ChallengeSentApp}/>
 </Route>
 */