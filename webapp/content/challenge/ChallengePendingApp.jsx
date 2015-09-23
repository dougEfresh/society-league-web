var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');
var Util = require('../../jsx/util.jsx');
var Handicap = require('../../lib/Handicap');
var Status = require('../../lib/Status');

var UpcomingChallenges = React.createClass({
    getInitialState: function() {
        return {challenge: this.props.challenge};
    },
    render: function() {
        if (this.state.challenge == undefined) {
            return null;
        }
        return <h1>Pending</h1>
    }
});
