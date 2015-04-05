var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , DefaultRoute = Router.DefaultRoute;

var ChallengeRequestApp = require('./components/challenge/ChallengeRequestApp.jsx');
var NavApp = require('./components/NavApp.jsx');
var Login = require('./components/Login.jsx');
var UserStore = require('./stores/UserStore.jsx');
//Set the user if already logged in

var App = React.createClass({
     contextTypes: {
        router: React.PropTypes.func
    },
    componentDidMount: function(){
        UserStore.checkLogin(this.context.router);
    },
    render: function () {
        if (UserStore.isCheckingLogin()) {
            return <div><h2>Loading....</h2> </div>
        }
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
        <DefaultRoute handler={ChallengeRequestApp} />
        <Route name="nav" path="/" handler={NavApp}>
            <Route name="login" path="login" handler={Login} />
            <Route name="home" path="home" handler={Home}/>
            <Route name="account" path=":userId/account" handler={Home}/>
            <Route name="challenge" path="challenge" handler={ChallengeRequestApp}/>
            <Route name="stats" path=":userId/stats" handler={Stats}/>
        </Route>
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});