var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeSentList = require('./ChallengeSentList.jsx');
var Util = require('../../util.jsx');

var ChallengeSentApp = React.createClass({
    propTypes: {
        user: ReactPropTypes.object.isRequired
    },
    getInitialState: function() {
        return {sent: []};
    },
    componentDidMount: function() {
        if (this.props.user.id == 0) {
            return;
        }
        Util.getData('/api/challenge/sent/' + this.props.user.id, function(p) {
             this.setState({sent: p});
         }.bind(this));
    },
    isValid: function() {

    },
    render: function(){
        if (this.state.sent == undefined || this.state.sent.length <= 0) {
            return null;
        }
        var title = (<div>Pending<span></span><Badge>{this.state.sent.length}</Badge></div>);
        return (
            <div>
                <Panel collapsable defaultCollapsed header={title}>
                    <ChallengeSentList pending={this.state.sent}/>
                </Panel>
            </div>
        )
    }
});

module.exports = ChallengeSentApp;
