var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Alert = Bootstrap.Alert
    ,Modal = Bootstrap.Modal
    ,OverlayMixin = Bootstrap.OverlayMixin
    ,ModalTrigger = Bootstrap.ModalTrigger
    ,Glyphicon = Bootstrap.Glyphicon
    ,Panel = Bootstrap.Panel;

var Router = require('react-router')
    ,Link = Router.Link
    ,RouteHandler = Router.RouteHandler;

var RequestStore = require('../../../stores/RequestStore.jsx');
var ChallengeGroupStore = require('../../../stores/ChallengeGroupStore.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');

var ChallengeRequestDate = require('./ChallengeRequestDate.jsx');
var ChallengeRequestSlots = require('./ChallengeRequestSlots.jsx');
var ChallengeRequestOpponent= require('./ChallengeRequestOpponent.jsx');
var ChallengeRequestGame= require('./ChallengeRequestGame.jsx');
var DataStore = require('../../../stores/DataStore.jsx');
var UserContextMixin = require('../../../mixins/UserContextMixin.jsx');

var ChallengeRequestApp = React.createClass({
    mixins: [UserContextMixin,Router.Navigation],
    getInitialState: function() {
        return {
            challenge: RequestStore.get()
        };
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    componentWillMount: function() {
        RequestStore.addChangeListener(this._onChange);
        DataStore.addChangeListener(this._onChange);
        RequestStore.addRequestListener(this._onAdd);
    },
    componentWillUnmount: function() {
        RequestStore.removeChangeListener(this._onChange);
        RequestStore.removeRequestListener(this._onAdd);
        DataStore.removeChangeListener(this._onChange);
    },
    _onAdd: function() {
        console.log('onAdd');
        this.setState({
            challenges: RequestStore.get()
        });
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
        if (c.opponent == null || c.opponent == undefined || c.opponent.userId == 0)
            errors.push('Need an opponent');

        if (c.selectedGames.length == 0)
            errors.push('Please choose game type');

        if (c.selectedSlots.length == 0)
            errors.push('Please choose a slot');

        if (!c.date)
            errors.push('Please choose a date');

        return errors;
    },
    confirm: function() {
        this.transitionTo('challengeConfirm');
    },
    isValid: function() {
        return this.getErrors().length == 0;
    },
    render: function(){
        if (this.getUser().id == 0 ) {
            return null;
        }
        var c = this.state.challenge;
        var submit = (
            <Button bsStyle='primary' disabled={!this.isValid()} onClick={this.confirm}><Glyphicon glyph="flash" /> Request</Button>
        );
        return (
            <div id="request-app"  >
                <ChallengeRequestDate  challengeGroup={c} />
                <ChallengeRequestOpponent opponent={c.opponent} />
                <ChallengeRequestSlots  challengeGroup={c} />
                <ChallengeRequestGame challengeGroup={c} />
                <div>
                {submit}
                </div>
            </div>
        )
    }
});

module.exports = ChallengeRequestApp;