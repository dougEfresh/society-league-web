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
        var user = this.getUser();
        if (user.id == "0") {
            return null;
        }
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
                    <UserResults results={this.state.data} />
                </div>
            </div>
        )
    }
});

module.exports = RecentMatches
