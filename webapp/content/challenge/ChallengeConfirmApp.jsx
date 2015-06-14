var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link
    ,RouteHandler = Router.RouteHandler;


var ChallengeStatus = require('../../jsx/constants/ChallengeStatus.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var GroupList = require('./group/GroupList.jsx');
var ChallengeGroup = require('../../lib/ChallengeGroup');
var DivisionType = require('../../lib/DivisionType');
var util = require('./challengeUtil');

var ChallengeConfirm = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
    render: function() {
        var cg = util.convertToChallenge(this.getQuery());
        return (
            <div id="challenge-confirm">
                <h2>{'Confirm Challenge'} </h2>
                <GroupList noSelect={true} challengeGroups={[cg]} type='CONFIRM'/>
            </div>
        );
    }
});

module.exports = ChallengeConfirm;