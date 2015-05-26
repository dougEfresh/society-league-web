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
        this.transitionTo('sent');
    },
    _onChange: function() {
        this.setState({challenge: RequestStore.get()});
    },
    render: function() {
        if (this.state.challenge == undefined || this.state.challenge.opponent == undefined) {
            return null;
        }
        return (
            <div>
                <h2>{'Confirm Challenge'} </h2>
                <GroupList noSelect={true} challengeGroups={[this.state.challenge]} type='CONFIRM'/>
            </div>
        );
    }
});

module.exports = ChallengeConfirm;