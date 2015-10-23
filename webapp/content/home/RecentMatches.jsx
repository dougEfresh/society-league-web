var React = require('react');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var Util = require('../../jsx/util.jsx');

var RecentMatches = React.createClass({
    mixins: [UserContextMixin],

    render: function() {
        var rows = [];
        this.getUser().handicapSeasons.forEach(function(s){
            if (s.season.active)
                rows.push(<UserResults key={s.season.id} user={this.getUser()} season={s.season} limit={6} />);
        }.bind(this));
        return (
            <div id={'no-recent-matches'} className="panel panel-default">
                <div className="panel-heading" >Recent Matches</div>
                <div className="panel-body" >
                    {rows}
                </div>
            </div>
        )
    }
});

module.exports = RecentMatches;
