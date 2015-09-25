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
             slots: [],
             dates: [],
             challengers: []
        }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        var dateFunc = function(d){
            var dates = {};
            d.forEach(function(s){
                dates[s.timeStamp.split('T')[0]] = 1;
            });
            for(var dt in dates) {
                this.state.dates.push(dt);
            }
            this.setState({slots: d});
        }.bind(this);

        Util.getSomeData({
                url: '/api/challenge/slots',
                callback: dateFunc,
                module: 'ChallengeApp'
            }
        );
        Util.getSomeData({
                url: '/api/challenge/users',
                callback: function(d) {this.setState({challengers: d});}.bind(this),
                module: 'ChallengeApp'
            }
        );
    },

    render: function() {
        if (this.state.slots.length == 0|| this.state.challengers.length == 0) {
            return null;
        }
        return (
            <div>
                <div className="panel panel-primary">
                <div className="panel-heading" >  <span className={"glyphicon glyphicon-plus"}></span>New Request</div>
                <div className="panel-body" >
                    <div className="page-elements">
                        <form id="request-app"  >
                            <div>
                                <h3>{this.state.challengers.length}</h3>
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