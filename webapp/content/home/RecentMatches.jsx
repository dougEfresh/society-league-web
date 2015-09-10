var React = require('react');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var Util = require('../../jsx/util.jsx');

var RecentMatches = React.createClass({
    mixins: [UserContextMixin],
     getInitialState: function() {
         return {
             data: []
        }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        Util.getData('/api/playerresult/get/user/' + this.getUser().id + '/current', function(d){
            this.setState({data: d});
        }.bind(this));
    },
    render: function() {
        if (this.state.data.length == 0) {
            return (
                <div id={'no-recent-matches'} className="panel panel-default">
                      <div className="panel-heading" >Recent Matches</div>
                      <div className="panel-body" >
                        <span>You have not played any matches</span>
                      </div>
                  </div>
            )
        }
        var results = this.state.data;
        results = results.sort(function(a,b){
            return b.teamMatch.matchDate.localeCompare(a.teamMatch.matchDate);
        });

        var lastXSeasonMatches = {};
        for(var i =0; i < results.length ; i++) {
            var id = results[i].season.id;
            if (!lastXSeasonMatches.hasOwnProperty(id)) {
                lastXSeasonMatches[id] = [];
            }
            if (lastXSeasonMatches[id].length > 6) {
                continue;
            }
            lastXSeasonMatches[id].push(results[i]);
        }

        var recentMatches = [];
        for(var seasonId in lastXSeasonMatches) {
            recentMatches  = recentMatches.concat(lastXSeasonMatches[seasonId]);
        }
        return (
            <div id={'no-recent-matches'} className="panel panel-default">
                <div className="panel-heading" >Recent Matches</div>
                <div className="panel-body" >
                    <UserResults results={recentMatches} />
                </div>
            </div>
        )
    }
});

module.exports = RecentMatches
