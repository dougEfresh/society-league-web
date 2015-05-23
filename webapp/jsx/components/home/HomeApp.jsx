var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel
    ,Glyphicon = Bootstrap.Glyphicon
    ,Button = Bootstrap.Button;

var DataStore = require('../../stores/DataStore.jsx');
var HomeChart = require('./HomeChart.jsx');
var HomeMatches= require('./HomeMatches.jsx');

var HomeApp = React.createClass({
    mixins: [UserContextMixin,Router.state],
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
        var welcome = ' Welcome ' + this.getUser().fName + ' ';
        var button = null;
        if (this.getUser().isChallenge()) {
            button = <Button responsive={true}> <Glyphicon glyph="flash" /> <b>Request</b></Button>
        }
        return (
            <div id="homeApp">
                <h2 className="welcome" >
                    <Glyphicon glyph="user" />
                    {welcome}
                    {button}
                </h2>
                <HomeMatches />
            </div>
        );
    }
});

module.exports = HomeApp;