var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Alert = Bootstrap.Alert
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var UserStore = require('../../../stores/UserStore.jsx');

var ChallengeRequestDate = require('./ChallengeRequestDate.jsx');
var ChallengeRequestSlots = require('./ChallengeRequestSlots.jsx');
var ChallengeRequestOpponent= require('./ChallengeRequestOpponent.jsx');
var ChallengeRequestGame= require('./ChallengeRequestGame.jsx');

var DataFactory = require('../../../DataFactoryMixin.jsx');

var ChallengeRequestApp = React.createClass({
    mixins: [DataFactory],
    propTypes: {
        challenge: ReactPropTypes.object.isRequired
    },
    getInitialState: function() {
        return {
            submitted : false
        };
    },
    getErrors: function() {
        var errors = [];
        var c = this.props.challenge;
        if (c == undefined) {
            errors.push('Nothing Selected');
            return errors;
        }
        if (c.opponent == null || c.opponent == undefined || c.opponent.user.id == 0)
            errors.push('Need an opponent');
        if (!c.game.nine.selected && !c.game.eight.selected)
            errors.push('Please choose game type');
        if (c.slots.length == 0)
            errors.push('Please choose a time');
        if (!c.date)
            errors.push('Please choose a date');

        return errors;
    },
    handleClick: function() {
        var opponent = { id: 0};
        var c = this.props.challenge;
        opponent.id = c.opponent.user.id;
        var slots = [];
        c.slots.forEach(function(s) {
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
        this.setState({submitted : true});
        ChallengeActions.request(request);
        console.log(JSON.stringify(request));
    },
    isValid: function() {
        return this.getErrors().length == 0;
    },
    render: function(){
        var userId = this.getUserId();
        var c = this.props.challenge;
        var submit = (
            <Button bsStyle='primary' disabled={!this.isValid()} onClick={this.handleClick}>Request Challenge</Button>
        );
        var alert = null;
        if (this.props.submitted ) {
            alert = (
                <Alert bsStyle='success' >
                    Successfully Sent Request. See 'Notify Tab' to send notification
                     <Button onClick={this.handleDismiss}>Hide</Button>
                </Alert>
            );
        }
        return (
            <div>
                {alert}
                    <ChallengeRequestDate  date={c.date} />
                    <ChallengeRequestSlots date={c.date} slots={c.slots} />
                    <ChallengeRequestOpponent userId={userId} opponent={c.opponent} />
                    <ChallengeRequestGame game={c.game} />
                    {submit}
            </div>
        )
    }
});

module.exports = ChallengeRequestApp;