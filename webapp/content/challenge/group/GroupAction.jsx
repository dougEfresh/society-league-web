var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
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

var ChallengeStatus = require('../../../jsx/constants/ChallengeStatus.jsx');
var ChallengeConstants = require('../../../jsx/constants/ChallengeConstants.jsx');
var ChallengeActions = require('../../../jsx/actions/ChallengeActions.jsx');
var ChallengeStore = require('../../../jsx/stores/ChallengeStore.jsx');
var GroupMixin = require('./GroupListMixin.jsx');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var DivisionType = require('../../../lib/DivisionType');

var GroupAction = React.createClass({
    mixins: [GroupMixin,Router.Navigation],
    sendStatus: function(s) {
        var status = {
            userId: this.getUserId(),
            status : s,
            group: this.props.challengeGroup
        };
        ChallengeActions.status(status);
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
    backUp: function() {
        this.goBack();
    },
    confirm: function() {
        var opponent = { id: 0};
        var c = this.props.challengeGroup;
        opponent.id = c.opponent.userId;
        var slots = [];
        c.selectedSlots.forEach(function(s) {
            var slot = { id: 0 };
            slot.id = s.id;
            slots.push(slot);
        });
        var nine = false;
        var eight = false;
        c.selectedGames.forEach(function(g){
            if (g == DivisionType.EIGHT_BALL_CHALLENGE)
                eight = true;
            if (g == DivisionType.NINE_BALL_CHALLENGE)
                nine = true;
        });
        var request = {
            challenger: {id : this.getUserId()},
            opponent: opponent,
            nine: nine,
            eight: eight,
            slots: slots
        };
        ChallengeActions.request(request);
    },
    render: function() {
        var buttons = {
            accept:   <Button bsSize='xsmall'  disabled={this.disable()}  onClick={this.accept} key={'accept'} bsStyle={this.disable() ? 'danger' : 'success'} >Accept</Button>,
            confirm:  <Button bsSize='xsmall'  responsive onClick={this.confirm} key={'challenge'} bsStyle={'primary'} >challenge</Button>,
            deny:     <Button bsSize='xsmall'  onClick={this.cancel} key={'deny'}  bsStyle={'warning'} >Deny</Button>,
            //change:   <Button key={'change'}  bsStyle={'primary'} >Change</Button>,
            change:   null,
            cancel:   <Button bsSize='xsmall'  onClick={this.cancel} key={'cancel'}  bsStyle={'warning'} >Cancel</Button>,
            calender: null, //<Button disabled bsSize='xsmall'  key={'calendar'}  bsStyle={'success'} >Calendar</Button>
            back: <Button bsSize='xsmall'  bsStyle={'danger'} onClick={this.backUp}>Go Back</Button>
        };

        var actions = null;
        switch(this.props.type) {
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
            case ChallengeStatus.ACCEPTED:
                actions =
                    (<div >
                        {buttons.change}
                        {buttons.cancel}
                    </div>);
                break;
             case 'CONFIRM':
                actions =
                    (<div >
                        {buttons.confirm}
                        {buttons.back}
                    </div>);
                break;
            default:
        }

        return actions;
    }
});

module.exports = GroupAction;