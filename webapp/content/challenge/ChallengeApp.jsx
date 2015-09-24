var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');
var Util = require('../../jsx/util.jsx');
var Handicap = require('../../lib/Handicap');
var Status = require('../../lib/Status');
var ChallengePendingApp = require('../challenge/ChallengePendingApp.jsx');
var ChallengeAcceptedApp = require('../challenge/ChallengeAcceptedApp.jsx');
var UpcomingChallenges = require('../home/UpcomingChallenges.jsx');
var ChallengeApp = React.createClass({
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
        /*
        Util.getSomeData({
                url: '/api/challenge/user/' + this.getUser().id,
                callback: function(d){this.setState({data: d});}.bind(this),
                module:'ChallngeApp'}
        );
        */
    },

    render: function() {
        return (
            <div>
                <div className="panel panel-primary">
                <div className="panel-heading" >  <span className={"glyphicon glyphicon-plus"}></span>New Request</div>
                <div className="panel-body" >
                    <div className="page-elements">
                        <form id="request-app"  >
                            <div>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
                <h2>Challenges</h2>
                <UpcomingChallenges />
            </div>
        );
    }
});

module.exports = ChallengeApp;