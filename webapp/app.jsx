var React = require('react/addons');
var ReactRouter = require('react-router')
    , Router = ReactRouter.Router
    , Route = ReactRouter.Route
    , Link = ReactRouter.Link
    , IndexRoute = ReactRouter.IndexRoute;

var Status = require('./lib/Status');
var ChallengeApp = require('./content/challenge/ChallengeApp.jsx');
var ChallengeCancelApp= require('./content/challenge/ChallengeCancelApp.jsx');

var UserAdminApp = require('./content/admin/UserAdmin.jsx');
var SeasonAdminApp = require('./content/admin/SeasonAdmin.jsx');
var TeamAdminApp = require('./content/admin/SeasonAdmin.jsx');
var ScheduleApp = require('./content/schedule/ScheduleApp.jsx');
var ScheduleChallengeApp  = require('./content/schedule/ScheduleChallengeApp.jsx');

var NavApp = require('./content/nav/NavApp.jsx');
var ResetApp = require('./jsx/../content/ResetApp.jsx');
var ResetPasswordApp = require('./jsx/../content/ResetPasswordApp.jsx');

var RegisterApp = require('./jsx/../content/RegisterApp.jsx');
var LoginApp = require('./jsx/../content/login/LoginApp.jsx');
var FacebookLogin = require('./jsx/../content/login/FacebookLogin.jsx');
var FacebookSignUp = require('./jsx/../content/login/FacebookSignUp.jsx');
var LogoutApp = require('./content/LogoutApp.jsx');
var ErrorApp = require('./jsx/components/ErrorApp.jsx');

var StatApp = require('./content/stat/StatApp.jsx');
var StatDisplay = require('./content/stat/StatsDisplay.jsx');
var StatGraph = require('./content/stat/StatsPie.jsx');
var StatHistory = require('./content/stat/StatHistory.jsx');
var HomeApp = require('./jsx/../content/home/HomeApp.jsx');
var DisplayApp = require('./content/display/DisplayApp.jsx');
var TeamStandings= require('./content/team/TeamStandings.jsx');
var TeamMemberResultsApp = require('./content/team/TeamMemberResults.jsx');
var SeasonApp = require('./content/season/SeasonApp.jsx');
var SeasonLeaders = require('./content/season/SeasonLeaders.jsx');
var SeasonStandings = require('./content/season/SeasonStandings.jsx');
var SeasonWeeklyMatches = require('./content/season/SeasonWeeklyMatches.jsx');
var SeasonMatchResultsOnDay = require('./content/season/SeasonMatchResultsOnDay.jsx');
var LoadingApp = require('./jsx/components/LoadingApp.jsx');
var TeamChart = require('./content/team/TeamChart.jsx');
var UserApp  = require('./content/user/UserApp.jsx');
var TeamMatchResultsApp = require('./content/schedule/TeamMatchrResults.jsx');
var ScheduleAddTeamMatch = require('./content/schedule/ScheduleAddTeamMatch.jsx');
var HelpApp = require('./content/Help.jsx');
var ResetNotification = require('./content/RestNotification.jsx');

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
var routes = (
    <Route path="/" component={App}>
        <IndexRoute component={NavApp} />
        <Route  path="login" component={FacebookLogin} />
        <Route  path="fb" component={FacebookLogin} />
        <Route  path="legacy" component={LoginApp} />
        <Route  path="facebook/signup" component={FacebookSignUp} />
        <Route  path="fb/signup" component={FacebookSignUp} />
        <Route  path="reset" component={ResetApp} />
        <Route  path="reset/:token" component={ResetPasswordApp} />
        <Route  path="register" component={RegisterApp} />
        <Route  path="error" component={ErrorApp} />
        <Route  path="logout" component={LogoutApp} />
        <Route  path="help" component={HelpApp} />
        <Route  path="notification" component={ResetNotification} />
        <Route  path="app" component={NavApp}>
            <Route path="loading" component={LoadingApp} />
            <Route path="home" component={HomeApp}/>
            <Route path="account" component={HomeApp}/>
            <Route path="user"  component={UserApp}/>
            <Route path="profile"  component={UserApp}/>

            <Route path="admin/users" component={UserAdminApp} />
            <Route path="admin/seasons" component={SeasonAdminApp} />
            <Route path="admin/teams" component={TeamAdminApp} />

            <Route path="challenge/:challengeId/cancel" component={ChallengeCancelApp} />
            <Route name="challenge" path="challenge" component={ChallengeApp} />

            <Route path="stats/current/:statsId"  component={StatApp}/>
            <Route path="stats/history/:statsId"  component={StatApp}/>

            <Route path="display/:seasonId/:teamId/:userId" component={DisplayApp} > </Route>
            <Route path="display/:seasonId/:teamId" component={DisplayApp} ></Route>
            <Route path="display/:seasonId" component={DisplayApp} ></Route>

            <Route path="team/:seasonId/:teamId/:userId" component={DisplayApp} > </Route>
            <Route path="team/:seasonId/:teamId" component={DisplayApp} ></Route>
            <Route path="team/:seasonId" component={DisplayApp} ></Route>


            <Route path="season/:seasonId/leaders" component={SeasonApp} ></Route>
            <Route path="season/:seasonId/leaders/:userId" component={SeasonApp} ></Route>

            <Route path="schedule/:seasonId" component={ScheduleApp} ></Route>
            <Route path="schedule/:seasonId/challenge" component={ScheduleChallengeApp} ></Route>
            <Route path="schedule/:seasonId/add" component={ScheduleAddTeamMatch} ></Route>
            <Route path="schedule/:seasonId/:matchId" component={TeamMatchResultsApp} ></Route>
        </Route>
    </Route>
);
React.render((<Router>{routes}</Router>), document.getElementById('content'));
