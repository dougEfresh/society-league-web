var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge;

var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var UserStore = require('../../../stores/UserStore.jsx');
var ChallengeNotifyList = require('./ChallengeNotifyList.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');
var ChallengeAppMixin = require('../ChallengeAppMixin.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');

var ChallengeNotifyApp = React.createClass({
    mixins: [DataFactory,ChallengeAppMixin],
    getInitialState: function() {
        return {
            requests: ChallengeStore.getAllChallenges()
        }
    },
    getDefaultProps: function(){
        return {
            type : ChallengeStatus.NEEDS_NOTIFY
        }
    },
    componentDidMount: function() {
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
        return (
            <div>
                <ChallengeNotifyList type={this.props.type}/>
            </div>
        )
    }
});

module.exports = ChallengeNotifyApp;