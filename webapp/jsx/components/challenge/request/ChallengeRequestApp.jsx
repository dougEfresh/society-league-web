var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Alert = Bootstrap.Alert
    ,Modal = Bootstrap.Modal
    ,OverlayMixin = Bootstrap.OverlayMixin
    ,ModalTrigger = Bootstrap.ModalTrigger
    ,Panel = Bootstrap.Panel;

var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;

var RequestStore = require('../../../stores/RequestStore.jsx');
var ChallengeGroupStore = require('../../../stores/ChallengeGroupStore.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var UserStore = require('../../../stores/UserStore.jsx');

var ChallengeRequestDate = require('./ChallengeRequestDate.jsx');
var ChallengeRequestSlots = require('./ChallengeRequestSlots.jsx');
var ChallengeRequestOpponent= require('./ChallengeRequestOpponent.jsx');
var ChallengeRequestGame= require('./ChallengeRequestGame.jsx');

var DataFactory = require('../../../UserContextMixin.jsx');

var ChallengeRequestApp = React.createClass({
    mixins: [DataFactory,OverlayMixin],
    getInitialState: function() {
        return {
            isModalOpen: false,
            submitted: false,
            challenge: RequestStore.get()
        };
    },
    componentWillMount: function() {
        RequestStore.addChangeListener(this._onChange);
        RequestStore.addRequestListener(this._onAdd);
    },
    componentWillUnmount: function() {
        RequestStore.removeChangeListener(this._onChange);
        RequestStore.removeRequestListener(this._onAdd);
    },
    _onAdd: function() {
        console.log('onAdd');
        this.setState({
            submitted : true,
            challenges: RequestStore.get()
        });
        ChallengeActions.initChallenges(this.getUserId());
    },
    _onChange: function() {
        this.setState({challenge: RequestStore.get()});
    },
    getErrors: function() {
        var errors = [];
        var c = this.state.challenge;
        if (c == undefined) {
            errors.push('Nothing Selected');
            return errors;
        }
        if (c.opponent == null || c.opponent == undefined || c.opponent.user.id == 0)
            errors.push('Need an opponent');
        if (!c.game.nine.selected && !c.game.eight.selected)
            errors.push('Please choose game type');
        var slotChosen = false;
        c.slots.forEach(function(s){
            if (s.selected)
                slotChosen = true;
        });
        if (!slotChosen)
            errors.push('Please choose a time');
        if (!c.date)
            errors.push('Please choose a date');

        return errors;
    },

    send: function() {
        var opponent = { id: 0};
        var c = this.state.challenge;
        opponent.id = c.opponent.user.id;
        var slots = [];
        c.slots.forEach(function(s) {
            if (!s.selected){
                return
            }
            var slot = { id: 0 };
            slot.id = s.id;
            slots.push(slot);
        });
        var request = {
            challenger: {id : this.getUserId()},
            opponent: opponent,
            nine: c.game.nine.selected,
            eight: c.game.eight.selected,
            slots: slots
        };
        ChallengeActions.request(request);
        console.log(JSON.stringify(request));
    },
    handleToggle: function() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    },
    handleClose: function() {
      this.setState({submitted: false, isModalOpen: !this.state.isModalOpen});
    },
    isValid: function() {
        return this.getErrors().length == 0;
    },
    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }
        var c = this.state.challenge;
        var msg = 'Send request to '
            + UserStore.get(c.opponent.user.id).name + ' for' +
            ' a match on ' + c.date ;
        var title = 'Notify Opponent?';
        if (this.state.submitted) {
            title = 'Sucess';
        }
        var body = (
            <div>
                <div className='modal-body'>
                    {msg}
                </div>
                <div className='modal-footer'>
                    <Button bsStyle={'success'} onClick={this.send}>Send Request</Button>
                </div>
            </div>);
        if (this.state.submitted) {
            body = (<div>
                <Alert>Request Sent. See Sent tab for details</Alert>
                <Button bsStyle={'success'} onClick={this.handleClose}>Close</Button>
            </div>);
        }
        return (
            <Modal bsStyle={this.state.submitted ? 'success' : 'warning'} title={title} onRequestHide={this.handleToggle}>
                {body}
            </Modal>
        );
  },
    render: function(){
        var c = this.state.challenge;
        var submit = (
            <Button bsStyle='primary' disabled={!this.isValid()} onClick={this.handleToggle}>Request Challenge</Button>
        );
        return (
            <div>
                    <ChallengeRequestDate  date={c.date} />
                    <ChallengeRequestSlots any={c.anySlot} date={c.date} slots={c.slots} />
                    <ChallengeRequestOpponent opponent={c.opponent} />
                    <ChallengeRequestGame game={c.game} />
                    {submit}
            </div>
        )
    }
});

module.exports = ChallengeRequestApp;