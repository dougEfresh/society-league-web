var React = require('react/addons');
var ChallengeNotifyList = require('./ChallengeNotifyList.jsx');
var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var DataFactory = require('../../../DataFactoryMixin.jsx');

var ChallengeNotifyApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            requests: ChallengeStore.getChallenges(ChallengeStatus.NOTIFY)
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
        this.setState({requests: ChallengeStore.getChallenges(ChallengeStatus.NOTIFY)});
    },
    render: function(){
        return (
            <div>
                <ChallengeNotifyList requests={this.state.requests}/>
            </div>
        )
    }
});

module.exports = ChallengeNotifyApp;