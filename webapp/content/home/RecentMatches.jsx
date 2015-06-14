var React = require('react');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
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
                <div id={'no-recent-matches'} className="panel panel-default">
                      <div className="panel-heading" >Recent Matches</div>
                      <div className="panel-body" >
                        <span>You have not played any matches</span>
                      </div>
                  </div>
            )
        }
        return (
            <div id={'no-recent-matches'} className="panel panel-default">
                <div className="panel-heading" >Recent Matches</div>
                <div className="panel-body" >
                    <UserResults matches={recent} />
                </div>
            </div>
        )
    }
});

module.exports = UpcomingMatches;
