var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel
    ,Glyphicon = Bootstrap.Glyphicon
    ,Button = Bootstrap.Button;

var DataStore = require('../../jsx/stores/DataStore.jsx');
var UpcomingChallenges = require('./UpcomingChallenges.jsx');
var UpcomingMatches = require('./UpcomingMatches.jsx');
var RecentMatches = require('./RecentMatches.jsx');

var HomeApp = React.createClass({
    mixins: [UserContextMixin],
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {

    },
    _onChange: function () {
        this.setState({user: DataStore.getAuthUserId()});
    },
    render: function () {
        if (this.getUser().id == 0) {
            return null;
        }
        var welcome = <span id="welcome-name">{'Welcome ' + this.getUser().fName + ' '}</span>;
        var button = null;
        if (this.getUser().isChallenge()) {
            button = <Link to="request"><Button responsive={true}> <Glyphicon glyph="flash" /> <b>Request</b></Button> </Link>
        }
        return (
            <div id="homeApp">
                <h2 className="welcome" >
                    <Glyphicon glyph="user" />
                    {welcome}
                    {button}
                </h2>
                <UpcomingChallenges />
                <UpcomingMatches />
                <RecentMatches />
            </div>
        );
    }
});

module.exports = HomeApp;