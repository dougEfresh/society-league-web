var React = require('react');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var Util = require('../../jsx/util.jsx');

var RecentMatches = React.createClass({
    mixins: [UserContextMixin],
     getInitialState: function() {
         return {
             data: [],
             stats: []
        }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        Util.getData('/api/playerresult/get/user/' + this.getUser().id + '/current', function(d){
            this.setState({data: d});
        }.bind(this),null,'RecentMatches');
         Util.getData('/api/stat/user/' + this.getUser().id , function(d){
            this.setState({stats: d});
        }.bind(this),null,'RecentMatches');
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
        return (
            <div id={'no-recent-matches'} className="panel panel-default">
                <div className="panel-heading" >Recent Matches</div>
                <div className="panel-body" >
                    <UserResults stats={this.state.stats} results={this.state.data} limit={6} />
                </div>
            </div>
        )
    }
});

module.exports = RecentMatches
