var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Badge = Bootstrap.Badge
    ,TabbedArea = Bootstrap.TabbedArea
    ,TabPane = Bootstrap.TabPane
    ,Nav = Bootstrap.Nav
    ,NavItem = Bootstrap.NavItem
    ,Alert = Bootstrap.Alert
    ,Panel = Bootstrap.Panel;

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;

var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var ChallengeGroupStore = require('../../stores/ChallengeGroupStore.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var ChallengeRequestApp = require('./request/ChallengeRequestApp.jsx');

var ChallengePendingApp = require('./pending/ChallengePendingApp.jsx');
var ChallengeAcceptedApp = require('./approved/ChallengeApprovedApp.jsx');
var ChallengeSentApp = require('./sent/ChallengeSentApp.jsx');
var ChallengeNotifyApp = require('./notify/ChallengeNotifyApp.jsx');

var DataFactory = require('../../DataFactoryMixin.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');

var ChallengeApp = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            requests: ChallengeStore.getAllChallenges(),
            activeKey: ChallengeStatus.REQUEST
        }
    },
    componentWillMount: function() {
        ChallengeStore.addRequestListener(this._onAdd);
        ChallengeStore.addChangeListener(this._onChange);
        ChallengeGroupStore.addChangeListener(this._onStatusChange);
    },
    componentDidMount: function() {
        this._onChange();
    },
    componentWillUnmount: function() {
        ChallengeStore.removeRequestListener(this._onAdd);
        ChallengeStore.removeChangeListener(this._onChange);
        ChallengeGroupStore.removeChangeListener(this._onStatusChange);
    },
    _onStatusChange: function() {
        var statusChange = ChallengeGroupStore.lastStatusChange();
        var newStatus = ChallengeGroupStore.lastStatusAction();
        var challenges = ChallengeStore.getAllChallenges();
        console.log('Status Change: ' + statusChange + ' ' + newStatus);
        var key = this.state.activeKey;
        if (challenges[key].length > 0) {
            this.setState({
                    requests: challenges,
                    key: key
                }
            );
            return ;
        }

        switch (newStatus) {
            case ChallengeStatus.NOTIFY:
                key = ChallengeStatus.SENT;
                break;
            case ChallengeStatus.ACCEPTED:
                key = ChallengeStatus.ACCEPTED;
                break;
            default:
                key = ChallengeStatus.REQUEST;
        }
        console.log('Setting state to '+ key);
        this.setState({
                requests: challenges,
                activeKey: key
            }
        );
    },

    _onChange: function() {

        var key = this.state.activeKey;
        var c =  ChallengeStore.getAllChallenges();
        if (c[ChallengeStatus.NOTIFY].length > 0) {
            key = ChallengeStatus.NOTIFY;
        }
        console.log("onChange " + key);
        this.setState({
            requests: c,
            activeKey: key
        });
    },
    _onAdd: function() {
        console.log('onAdd ' + ChallengeStatus.NOTIFY);
        this.setState({
            requests: ChallengeStore.getAllChallenges(),
            activeKey: ChallengeStatus.NOTIFY
        });
    },
    getTitle: function(type) {
        var r = this.state.requests[type];

        switch (type) {
            case ChallengeStatus.NOTIFY:
                return (<div>Notify<span></span><Badge>{r.length}</Badge></div>);
            case ChallengeStatus.PENDING:
                return (<div>Approval Required<span></span><Badge>{r.length}</Badge></div>);
            case ChallengeStatus.SENT:
                return (<div>Sent<span></span><Badge>{r.length}</Badge></div>);
            case ChallengeStatus.ACCEPTED:
                return (<div>Upcoming<span></span><Badge>{r.length}</Badge></div>);
            default:
                return (<div>{type} <span></span></div>);
        }
    },
    shouldRender: function(type) {
        return this.state.requests[type].length > 0;
    },
    onSelect: function(key) {
        this.setState({activeKey: key})
    },
    genNav: function(type,tabs) {
        if (this.shouldRender(type)) {
            tabs.push(
                    <NavItem key={type} eventKey={type} >
                        {this.getTitle(type)}
                    </NavItem>
            );
        }
    },
    getApp: function() {
        console.log('ActiveState: ' + this.state.activeKey);
        switch(this.state.activeKey) {
            case ChallengeStatus.REQUEST:
                return (<ChallengeRequestApp challenge={ChallengeStore.get()} />);
                break;
            case ChallengeStatus.NOTIFY:
                return (<ChallengeNotifyApp requests={this.state.requests} />);
                break;
            case ChallengeStatus.ACCEPTED:
                return (<ChallengeAcceptedApp requests={this.state.requests} />);
                break;
            case ChallengeStatus.PENDING:
                return (<ChallengePendingApp requests={this.state.requests} />);
                break;
            case ChallengeStatus.SENT:
                return (<ChallengeSentApp requests={this.state.requests} />);
                break;
            default:
                return (<ChallengeRequestApp challenge={this.state.requests} />);
        }
    },
    render: function() {
        var tabs = [];
        tabs.push (
            <NavItem key={ChallengeStatus.REQUEST} eventKey={ChallengeStatus.REQUEST} >
                {this.getTitle('Request')}
            </NavItem>
        );
        this.genNav(ChallengeStatus.NOTIFY,tabs);
        this.genNav(ChallengeStatus.PENDING,tabs);
        this.genNav(ChallengeStatus.ACCEPTED,tabs);
        this.genNav(ChallengeStatus.SENT,tabs);
        return (
            <div>
                <Nav bsStyle='pills' activeKey={this.state.activeKey} onSelect={this.onSelect}>
                    {tabs}
                </Nav>
                {this.getApp()}
            </div>
        );
    }
});

module.exports = ChallengeApp;

