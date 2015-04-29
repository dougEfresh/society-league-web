var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,ListGroup = Bootstrap.ListGroup
    ,ListGroupItem = Bootstrap.ListGroupItem
    ,Table =  Bootstrap.Table
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,Input = Bootstrap.Input
    ,Label = Bootstrap.Label
    ,Well = Bootstrap.Well
    ,Badge = Bootstrap.Badge
    ,SplitButton = Bootstrap.SplitButton;

var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeConstants = require('../../../constants/ChallengeConstants.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var DataFactory = require('../../../UserContextMixin.jsx');
var GroupMixin = require('./GroupListMixin.jsx');

var GroupAction = React.createClass({
    mixins: [GroupMixin],
    sendStatus: function(s) {

        var status = {
            userId: this.getUserId(),
            status : s,
            group: this.props.challengeGroup
        };
        ChallengeActions.status(status);

    },
    notify: function(){
        ChallengeActions.notifyChallenge(this.getUserId(),this.props.challengeGroup);
    },
    cancel: function() {
        ChallengeActions.cancelChallenge(this.getUserId(),this.props.challengeGroup);
    },
    accept: function() {
        ChallengeActions.acceptChallenge(this.getUserId(),this.props.challengeGroup);
    },
    disable: function() {
        return this.props.challengeGroup.selectedGame == null || this.props.challengeGroup.selectedSlot < 1;
    },
    render: function() {
        var buttons = {
            accept:   <Button bsSize='xsmall'  disabled={this.disable()}  onClick={this.accept} key={'accept'} bsStyle={this.disable() ? 'danger' : 'success'} >Accept</Button>,
            deny:     <Button bsSize='xsmall'  onClick={this.cancel} key={'deny'}  bsStyle={'warning'} >Deny</Button>,
            //change:   <Button key={'change'}  bsStyle={'primary'} >Change</Button>,
            change:   null,
            cancel:   <Button bsSize='xsmall'  onClick={this.cancel} key={'cancel'}  bsStyle={'warning'} >Cancel</Button>,
            notify:   <Button bsSize='xsmall'  onClick={this.notify} key={'notify'}  bsStyle={'success'} >Notify</Button>,
            calender: null //<Button disabled bsSize='xsmall'  key={'calendar'}  bsStyle={'success'} >Calendar</Button>
        };

        var actions = null;
        switch(this.props.challengeGroup.status) {
            case ChallengeStatus.PENDING:
                actions =
                    (<div>
                        {buttons.accept}
                        {buttons.deny}
                    </div>);
                break;
            case ChallengeStatus.SENT:
                actions =
                    (<div >
                        {buttons.calender}
                        {buttons.change}
                        {buttons.cancel}
                    </div>);
                break;
            case ChallengeStatus.NOTIFY:
                actions =
                    (<div >
                        {buttons.notify}
                        {buttons.change}
                        {buttons.cancel}
                    </div>);
                break;
            case ChallengeStatus.ACCEPTED:
                actions =
                    (<div >
                        {buttons.change}
                        {buttons.cancel}
                    </div>);
                break;
            default:
        }

        return actions;
    }
});

module.exports = GroupAction;