var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Alert = Bootstrap.Alert
    ,Modal = Bootstrap.Modal
    ,Table = Bootstrap.Table
    ,OverlayMixin = Bootstrap.OverlayMixin
    ,ModalTrigger = Bootstrap.ModalTrigger
    ,Panel = Bootstrap.Panel;

var Router = require('react-router')
    ,Link = Router.Link
    ,RouteHandler = Router.RouteHandler;


var RequestStore = require('../../stores/RequestStore.jsx');
var ChallengeGroupStore = require('../../stores/ChallengeGroupStore.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var DataStore = require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var GroupList = require('./group/GroupList.jsx');
var ChallengeGroup = require('../../../lib/ChallengeGroup');
var DivisionType = require('../../../lib/DivisionType');

var ChallengeConfirm = React.createClass({
    mixins: [UserContextMixin,Router.Navigation],
    getInitialState: function() {
      return {
          challenge: RequestStore.get()
      }
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
    componentDidMount: function() {
        this.setState({challenge: RequestStore.get()});
    },
    _onAdd: function() {
        console.log('onAdd');
        this.setState({
            submitted : true,
            challenges: RequestStore.get()
        });
        //ChallengeActions.initChallenges(this.getUserId());
    },
    _onChange: function() {
        this.setState({challenge: RequestStore.get()});
    },
    render: function() {
        if (this.state.challenge == null) {
            return null;
        }
        var c = this.state.challenge;
        var cg = new ChallengeGroup(c.challenger,c.opponent,c.date,null,null);
        c.slots.forEach(function(s){
            if (s.selected)
                cg.addSlot(s)
        });
        if (c.game.nine.selected) {
            cg.addGame(DivisionType.NINE_BALL_CHALLENGE)
        }
        if (c.game.eight.selected) {
            cg.addGame(DivisionType.EIGHT_BALL_CHALLENGE)
        }
        var challengeGroups = [cg];
        return (
            <div>
                <h2>{'Confirm Challenge'} </h2>
                <GroupList noSelect={true} challengeGroups={challengeGroups} type='CONFIRM'/>
            </div>
        );
    }
});

module.exports = ChallengeConfirm;