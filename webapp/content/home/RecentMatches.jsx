var React = require('react');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');
var Bootstrap = require('react-bootstrap');
var Panel = Bootstrap.Panel;
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var MatchDao = require('../../lib/dao/MatchDao');

var UpcomingMatches = React.createClass({
    mixins: [UserContextMixin],
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        var matchDao = new MatchDao(this.getDb());
        var recent = matchDao.getResults(this.getUser());
        if (recent.length == 0) {
            return (
                <div id={'no-recent-matches'}>
                    <Panel header={'Recent Matches'}>
                        <span>You have not played any matches</span>
                    </Panel>
                </div>
            )
        }
        return (
            <div id = {'recent-matches'} >
            <Panel header={'Recent Matches'}>
                <UserResults matches={recent} />
            </Panel>
            </div>
        )
    }
});

module.exports = UpcomingMatches;
