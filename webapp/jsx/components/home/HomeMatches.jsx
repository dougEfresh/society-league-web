var React = require('react/addons');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var UpcomingChallenges = require('./UpcomingChallenges.jsx');
var UpcomingMatches = require('./UpcomingMatches.jsx');
var RecentMatches = require('./RecentMatches.jsx');

var HomeMatches = React.createClass({
    mixins: [UserContextMixin],
    render: function() {
        return (
            <div>
                <UpcomingChallenges />
                <UpcomingMatches />
                <RecentMatches />
            </div>
        );
    }
});



module.exports = HomeMatches;