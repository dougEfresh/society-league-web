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

var BallIcon = require('../../BallMixin.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');

var ChallengeListMixin = {
    mixins: [UserContextMixin],
    propTypes: {
        type:  ReactPropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            requests: ChallengeStore.getAllChallenges()
        }
    },
    componentWillMount: function() {
        ChallengeStore.addChangeListener(this._onChange);
        ChallengeStore.addRequestListener(this._onChange);
    },
    componentWillUnmount: function() {
        ChallengeStore.removeRequestListener(this._onChange);
        ChallengeStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState({requests: ChallengeStore.getAllChallenges()});
    },
    render: function(){
        return (<div>render</div>);
    }
};

module.exports = ChallengeListMixin;