var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Table = Bootstrap.Table
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../stores/ChallengeStore.jsx');
var UserStore = require('../stores/UserStore.jsx');
var ChallengeActions = require('../actions/ChallengeActions.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var StatActions = require('../actions/StatActions.jsx');
var StatStore = require('../stores/StatsStore.jsx');
var DataFactory = require('../DataFactoryMixin.jsx');
var StatsDisplay = require('../components/stats/StatsDisplay.jsx');
var LeaderBoard = require('./LeaderBoard.jsx');

var Home = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            challenges: null,
            stats: null,
            results: null
        }
    },
    componentWillMount: function() {
        ChallengeStore.addRequestListener(this._onChallengeChange);
        ChallengeStore.addChangeListener(this._onChallengeChange);
        StatStore.addChangeListener(this._onStatsChange);
        UserStore.addChangeListener(this._onUserChange);

    },
    componentDidMount: function() {
        this.setState({stats:StatStore.getStats(this.getUserId())});
    },
    componentWillUnmount: function() {
        ChallengeStore.removeChangeListener(this._onChallengeChange);
        ChallengeStore.removeRequestListener(this._onChallengeChange);
        StatStore.removeChangeListener(this._onStatsChange);
        UserStore.removeChangeListener(this._onUserChange);
    },
    _onStatsChange: function(){
        this.setState({stats: StatStore.getStats(this.getUserId())});
    },
    _onChallengeChange: function() {
        this.setState(
            {challenges: ChallengeStore.getAllChallenges()}
        );
    },
    _onUserChange: function() {
    },
    getNotifications: function() {
        return (<p> Click  <Link to={ChallengeStatus.NOTIFY.toLowerCase()} params={{userId: this.getUserId()}}>Here</Link> to Challenge Someone</p>);_
        /*
        var counter = 0;
        for(var status in ChallengeStatus) {
            if (status == ChallengeStatus.CANCELLED
                || (ChallengeStore.getChallenges(status) == undefined)) {
                continue;
            }
            counter += ChallengeStore.getChallenges(status).length;
        }
        if (counter == 0) {
            return null;
        }
        var notifications = {};
        for(var status in ChallengeStatus) {
            if (status == ChallengeStatus.CANCELLED
                || (ChallengeStore.getChallenges(status) == undefined)) {

            }

            var c = ChallengeStore.getChallenges(status);
            if (c.length > 0) {
                notifications[status] = (<Badge key={status}>{c.length}</Badge>);
            }
        }
        return (<p>
            You have {notifications[ChallengeStatus.NOTIFY]}

            {notifications[ChallengeStatus.ACCEPTED]}
            <Link to={ChallengeStatus.ACCEPTED.toLowerCase()} params={{userId: this.getUserId()}}>scheduled</Link> matches,
            {notifications[ChallengeStatus.PENDING]}
            <Link to={ChallengeStatus.PENDING.toLowerCase()} params={{userId: this.getUserId()}}>pending</Link> requests,
            and you sent
            {notifications[ChallengeStatus.SENT]}
            <Link to={ChallengeStatus.SENT.toLowerCase()} params={{userId: this.getUserId()}}>challenges</Link>
        </p>);
        */
    },
    render: function () {
        return (
            <div>
                <h3>Welcome! {UserStore.getName(this.getUserId())}</h3>
                {this.getNotifications()}
                <StatsDisplay stats={this.state.stats}/>
                <Panel collapsable defaultExpanded  header={'Leaders'}>
                    <LeaderBoard stats={StatStore.get()} />
                </Panel>
            </div>
        );
    }
});

module.exports = Home;