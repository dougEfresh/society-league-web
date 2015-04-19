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
var DataFactory = require('../../../DataFactoryMixin.jsx');
var GroupMixin = require('./GroupMixin.jsx');

var GroupAction = React.createClass({
    mixins: [GroupMixin],
    sendStatus: function(s) {
        /*
        var status = {
            userId: this.getUserId(),
            status : s,
            challenger: {id: 0},
            opponent:  {id: 0},
            challenges: []
        };
        status.challenger.id = this.props.challenges[0].challenger.id;
        status.challenger.id = this.props.challenges[0].opponent.id;
        this.props.challenges.forEach(function(c) {
            status.challenges.push({id: c.id});
        });
        ChallengeActions.status(status);
        console.log('Status: ' + JSON.stringify(status));
        */
    },
    cancel: function() {
        return this.sendStatus(ChallengeStatus.CANCELLED);
    },
    notify: function() {
        return this.sendStatus(ChallengeStatus.PENDING);
    },
    accept: function() {
        return this.sendStatus(ChallengeStatus.ACCEPTED);
    },
    render: function() {
        var buttons = {
            accept:   <Button bsSize='xsmall'  disabled={this.props.disabled}  onClick={this.accept} key={'accept'} bsStyle={this.props.disabled ? 'danger' : 'success'} >Accept</Button>,
            deny:     <Button bsSize='xsmall'  onClick={this.cancel} key={'deny'}  bsStyle={'warning'} >Deny</Button>,
            //change:   <Button key={'change'}  bsStyle={'primary'} >Change</Button>,
            change:   null,
            cancel:   <Button bsSize='xsmall'  onClick={this.cancel} key={'cancel'}  bsStyle={'warning'} >Cancel</Button>,
            notify:   <Button bsSize='xsmall'  onClick={this.notify} key={'notify'}  bsStyle={'success'} >Notify</Button>,
            calender: <Button disabled bsSize='xsmall'  key={'calendar'}  bsStyle={'success'} >Calendar</Button>
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