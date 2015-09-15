var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var Handicap = require('../../lib/Handicap');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var Util = require('../../jsx/util.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');

var StatHistory = React.createClass({
    mixins: [UserContextMixin,Router.State],
       getInitialState: function() {
         return {
             update: Date.now(),
             results: [],
             stats: []
         }
    },
    getData: function() {
        Util.getData('/api/playerresult/get/user/' + this.props.params.statsId  + '/current', function(d) {
            this.setState({results: d});
        }.bind(this), null, 'StatHistory');
        Util.getData('/api/stat/user/' + this.props.params.statsId , function(d){
            this.setState({stats: d});
        }.bind(this), null, 'StatHistory');
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
        //var now = Date.now();
        //if ( now - this.state.update > 1000*60)
            this.getData();
    },

    render: function() {
       if (this.state.results.length == 0 || this.state.stats.length == 0) {
           return null;
       }
        /*
        <div id={'no-recent-matches'} className="panel panel-default">
         <div className="panel-heading" >Matches</div>
         <div className="panel-body" >
         </div>
         </div>
         */
        var user = this.getUser();
        if (user.id != this.props.params.statsId) {
            user = this.state.results[0].playerHome.id == this.props.params.statsId ?  this.state.results[0].playerHome :  this.state.results[0].playerAway;
        }
        return (
                <UserResults stats={this.state.stats} user={user} results={this.state.results} />
        );
    }
});

module.exports = StatHistory;