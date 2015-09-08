var React = require('react');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var MatchDao = require('../../lib/dao/MatchDao');
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

        var last5 = [];
        for(var i =0; i < results.length && i < 5 ; i++) {
            last5.push(results[i]);
        }

        return (
            <div id={'no-recent-matches'} className="panel panel-default">
                <div className="panel-heading" >Recent Matches</div>
                <div className="panel-body" >
                    <UserResults results={last5} />
                </div>
            </div>
        )
    }
});

module.exports = RecentMatches
