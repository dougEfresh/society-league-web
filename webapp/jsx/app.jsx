var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;

var ChallengeApp = require('./components/challenge/ChallengeApp.jsx');
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
        <DefaultRoute handler={Home} />
        <Route name="error" path="error" handler={ErrorApp} />
        <Route name="nav" path="/" handler={NavApp}>
            <Route name="login" path="login" handler={LoginApp} />
            <Route name="logout" path="logout" handler={LogoutApp} />
            <Route name="home" path="home/:userId" handler={Home}/>
            <Route name="account" path="account/:userId" handler={Home}/>
            <Route name="admin" path="admin" handler={Home}/>
            <Route name="challenge" path="challenge/:userId" handler={ChallengeApp}/>
            <Route name="stats" path="stats/:userId" handler={Stats}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});