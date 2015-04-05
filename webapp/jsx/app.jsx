var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , DefaultRoute = Router.DefaultRoute;

var ChallengeRequestApp = require('./components/challenge/ChallengeRequestApp.jsx');
var NavApp = require('./components/NavApp.jsx');
var Login = require('./components/Login.jsx');

var App = React.createClass({
     contextTypes: {
        router: React.PropTypes.func
    },
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
        return (<div>Home</div>);
    }
});

var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Home} />
        <Route name="nav" path="/" handler={NavApp}>
            <Route name="login" path="login" handler={Login} />
            <Route name="home" path="home" handler={Home}/>
            <Route name="account" path=":userId/account" handler={Home}/>
            <Route name="challenge" path="challenge" handler={ChallengeRequestApp}>
                <Route name="request" path=":userId/request" handler={ChallengeRequestApp}/>
                <Route name="pending" path=":userId/pending" handler={ChallengeRequestApp}/>
                <Route name="sent" path=":userId/sent" handler={ChallengeRequestApp}/>
                <Route name="history" path=":userId/history" handler={ChallengeRequestApp}/>
            </Route>

            <Route name="stats" path=":userId/stats" handler={Stats}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});