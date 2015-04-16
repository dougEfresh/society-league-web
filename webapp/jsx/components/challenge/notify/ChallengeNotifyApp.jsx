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
            expanded : false
        };
    },
    getDefaultProps: function(){
        return {
            type : ChallengeStatus.NEEDS_NOTIFY
        }
    },
    componentDidMount: function() {
        ChallengeStore.addListener(this._onAdd);
    },
    componentWillUnmount: function() {
        ChallengeStore.removeAddListener(this._onAdd);
    },
    _onAdd: function(){
        this.setState({expanded: true});
    },
    handleClick: function() {
        this.setState({expanded: !this.state.expanded});
    },
    render: function(){
        if (!this.shouldRender()) {
            return null;
        }
        return (
            <div>
                <Panel bsStyle="danger" onClick={this.handleClick} collapsable expanded={this.state.expanded} header={this.getTitle()}>
                    <ChallengeNotifyList type={this.props.type} requests={this.getRequests()}/>
                </Panel>
            </div>
        )
    }
});

module.exports = ChallengeNotifyApp;