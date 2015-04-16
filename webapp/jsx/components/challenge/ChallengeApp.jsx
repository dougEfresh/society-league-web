var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Badge = Bootstrap.Badge
    ,TabbedArea = Bootstrap.TabbedArea
    ,TabPane = Bootstrap.TabPane
    ,Alert = Bootstrap.Alert
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeRequestApp = require('./request/ChallengeRequestApp.jsx');

var ChallengeApprovalApp = require('./approvals/ChallengeApprovalApp.jsx');
var ChallengeApprovedApp = require('./approved/ChallengeApprovedApp.jsx');
var ChallengeSentApp = require('./sent/ChallengeSentApp.jsx');
var ChallengeNotifyApp = require('./notify/ChallengeNotifyApp.jsx');

var DataFactory = require('../../DataFactoryMixin.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');

var ChallengeApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        var requests = {};
        requests[ChallengeStatus.PENDING] = [];
        requests[ChallengeStatus.NEEDS_NOTIFY] = [];
        requests[ChallengeStatus.CANCELLED] = [];
        requests[ChallengeStatus.SENT] = [];
        requests[ChallengeStatus.ACCEPTED] = [];
        return {
            challenge: ChallengeStore.get(),
            requests : requests,
            submitted: false
        }
    },
    componentDidMount: function() {
        ChallengeStore.addRequestListener(this._onRequestChange);
        ChallengeStore.addChangeListener(this._onChange);
        this.getData('/api/challenge/' + this.getUserId(), function(p) {
             this.setState({requests: p});
         }.bind(this));
    },
    componentWillUnmount: function() {
        ChallengeStore.removeRequestListener(this._onRequestChange);
        ChallengeStore.removeChangeListener(this._onChange);
    },
    _onRequestChange: function() {
        this.setState({challenge: ChallengeStore.get()});
    },
    _onChange: function() {
        this.getData('/api/challenge/' + this.getUserId(), function(p) {
            this.setState({requests: p, submitted: true});
        }.bind(this));
    },
    handleDismiss: function(){
        this.setState({submitted :false});
    },
    getTitle: function(type) {
        var r = this.state.requests[type];

        switch (type) {
            case ChallengeStatus.NEEDS_NOTIFY:
                return (<div>Needs Notification<span></span><Badge>{r.length}</Badge></div>);
            case ChallengeStatus.PENDING:
                return (<div>Approval Required<span></span><Badge>{r.length}</Badge></div>);
            case ChallengeStatus.SENT:
                return (<div>Sent Request<span></span><Badge>{r.length}</Badge></div>);
            case ChallengeStatus.ACCEPTED:
                return (<div>Upcoming Challenges<span></span><Badge>{r.length}</Badge></div>);
            default:
                return (<div>{type} <span></span></div>);
        };
    },
    shouldRender: function(type) {
        return this.state.requests[type].length > 0;
    },
    render: function() {
        var alert = null;
        var tabs = [];
        tabs.push(
            <TabPane key={'request'} eventKey={'Request'} tab={this.getTitle('Request')}>
            <ChallengeRequestApp  submiited={this.state.submitted ? true : false} challenge={this.state.challenge}/>
        </TabPane>);
        if (this.shouldRender(ChallengeStatus.NEEDS_NOTIFY)) {
            tabs.push(<TabPane key='notify' eventKey={'Notify'} tab={this.getTitle(ChallengeStatus.NEEDS_NOTIFY)}>
                <ChallengeNotifyApp requests={this.state.requests} />
            </TabPane>);
        }

        if (this.shouldRender(ChallengeStatus.PENDING)) {
            tabs.push(<TabPane key='pending' eventKey={'Pending'} tab={this.getTitle(ChallengeStatus.PENDING)}>
                <ChallengeApprovalApp requests={this.state.requests} />
            </TabPane>);
        }

        if (this.shouldRender(ChallengeStatus.SENT)) {
            tabs.push(<TabPane key='sent' eventKey={'Sent'} tab={this.getTitle(ChallengeStatus.SENT)}>
                <ChallengeSentApp requests={this.state.requests} />
            </TabPane>);
        }

        if (this.shouldRender(ChallengeStatus.ACCEPTED)) {
            tabs.push(<TabPane key='accepted' eventKey={'Accepted'} tab={this.getTitle(ChallengeStatus.ACCEPTED)}>
                <ChallengeApprovedApp requests={this.state.requests} />
            </TabPane>);
        }
        if (this.state.submitted) {
            this.state.submitted = false;
        }

        return (
        <div>
            {alert}
            <TabbedArea defaultActiveKey={'Request'}>
                {tabs}
            </TabbedArea>
            </div>
        )
    }
});

module.exports = ChallengeApp;

