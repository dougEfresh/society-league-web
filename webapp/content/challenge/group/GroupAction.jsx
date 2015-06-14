var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var ChallengeStatus = require('../../../jsx/constants/ChallengeStatus.jsx');
var ChallengeConstants = require('../../../jsx/constants/ChallengeConstants.jsx');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var DivisionType = require('../../../lib/DivisionType');
var Status = require('../../../lib/Status');
var challengeUtil = require('../challengeUtil');
var Datastore = require('../../../jsx/stores/DataStore.jsx');
var util = require('../challengeUtil');

var GroupAction = React.createClass({
    mixins: [Router.Navigation,Router.State],
    cancel: function(e) {
        e.preventDefault();
        //ChallengeActions.cancelChallenge(this.getUserId(),this.props.challengeGroup);
        var request = {
            challenger: null,
            opponent: null,
            challenges: []
        };
        this.props.challengeGroup.challenges.forEach(function(c) {
            request.challenges.push({id: c.id});
        });
        util.sendStatus('/api/challenge/' + Status.CANCELLED.toLowerCase() + '/' + this.getUser().id,request);
    },
    accept: function(e) {
        e.preventDefault();
        var challenge = {id : 0};
        var q = this.getQuery();
        this.props.challengeGroup.challenges.forEach(function(c) {
            if ((c.slot.id== q.selectedSlot || c.slot.id == this.props.challengeGroup.selectedSlot.id)
                && (c.game == q.selectedGame || c.game == this.props.challengeGroup.selectedGame)) {
                challenge = {id: c.id};
            }
        }.bind(this));
        if (challenge.id == 0) {
            console.error('!!Could not find Challenge!!');
            return;
        }
        util.sendStatus('/api/challenge/accepted/' + this.getUser().id,challenge);
    },
    confirm: function(e) {
        e.preventDefault();
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
        challengeUtil.create(request,this._onAdd);
    },
    disable: function() {
        var q = this.getQuery();
        if (this.props.challengeGroup.selectedSlot != undefined
            && this.props.challengeGroup.selectedSlot.id > 0 &&
            this.props.challengeGroup.selectedGame != undefined) {
            return false;
        }
        var disabled = (q.id == undefined
            || q.selectedGame == undefined
            || q.selectedSlot == undefined) && q.selectedSlot != 0;
        if (disabled)
            return disabled;

        return this.props.challengeGroup.getId() != q.id
    },
    backUp: function(e) {
        e.preventDefault();
        this.transitionTo('request',this.getParams(),this.getQuery());
    },
    _onAdd: function(d) {
        console.log('onAdd');
        Datastore.replaceUser(d);
        this.transitionTo('sent');
    },
    render: function() {
        var buttons = {
            accept:   <button className="btn btn-small"  disabled={this.disable()}  onClick={this.accept} key={'accept'} bsStyle={this.disable() ? 'primary' : 'success'} ><span className="fa fa-thumbs-up"></span>Accept</button>,
            confirm:  <button className="btn btn-small"  responsive onClick={this.confirm} key={'challenge'} bsStyle={'success'} ><span className="glyphicon glyphicon-ok"></span>{'challenge'}</button>,
            deny:     <button className="btn btn-small"  onClick={this.cancel} key={'deny'}  bsStyle={'danger'} ><span className="fa fa-thumbs-down"></span>Decline</button>,
            change:   null,
            cancel:   <button className="btn btn-small"  onClick={this.cancel} key={'cancel'}  bsStyle={'danger'} ><span className="glyphicon glyphicon-remove"></span>Cancel</button>,
            calender: null,
            back: <button className="btn btn-small"  bsStyle={'warning'} onClick={this.backUp}><span className="glyphicon glyphicon-chevron-left"></span>Go Back</button>
        };

        var actions = null;
        switch(this.props.type) {
            case ChallengeStatus.PENDING:
                actions =
                    (<div className="btn-group">
                        {buttons.accept}
                        {buttons.deny}
                    </div>);
                break;
            case ChallengeStatus.SENT:
                actions =
                    (<div className="btn-group">
                        {buttons.calender}
                        {buttons.change}
                        {buttons.cancel}
                    </div>);
                break;
            case ChallengeStatus.ACCEPTED:
                actions =
                    (<div className="btn-group">
                        {buttons.change}
                        {buttons.cancel}
                    </div>);
                break;
             case 'CONFIRM':
                actions =
                    (<div className="btn-group">
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
