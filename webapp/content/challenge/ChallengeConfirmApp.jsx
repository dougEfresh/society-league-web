var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Alert = Bootstrap.Alert
    ,Modal = Bootstrap.Modal
    ,Table = Bootstrap.Table
    ,ModalTrigger = Bootstrap.ModalTrigger
    ,Panel = Bootstrap.Panel;

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
     componentWillMount: function() {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function() {
    },
    _onAdd: function() {
        console.log('onAdd');
        this.transitionTo('sent');
    },
    render: function() {
        var cg = util.convertToChallenge(this.getQuery());
        return (
            <div>
                <h2>{'Confirm Challenge'} </h2>
                <GroupList noSelect={true} challengeGroups={[cg]} type='CONFIRM'/>
            </div>
        );
    }
});

module.exports = ChallengeConfirm;