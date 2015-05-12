var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Table = Bootstrap.Table
    ,Nav = Bootstrap.Nav
    ,Grid = Bootstrap.Grid
    ,Row = Bootstrap.Row
    ,Col = Bootstrap.Col
    ,MenuItem = Bootstrap.MenuItem
    ,Accordion = Bootstrap.Accordion
    ,Glyphicon = Bootstrap.Glyphicon
    ,Modal = Bootstrap.Modal
    ,ModalTrigger = Bootstrap.ModalTrigger
    ,Panel = Bootstrap.Panel;

var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var DataStore = require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var Season = require('../../../lib/Season.js');
var Division = require('../../../lib/Division.js');
var Team = require('../../../lib/Team.js');
var User = require('../../../lib/User.js');
var DivisionType = require('../../../lib/DivisionType');
var Status = require('../../../lib/Status');
var TeamMatch = require('../../../lib/TeamMatch');
var Result = require('../../../lib/Result');

var ChallengeNav = React.createClass({
    mixins: [UserContextMixin,Router.state,Bootstrap.OverlayMixin],
    getInitialState: function () {
        return {
            user: this.getUser(),
            isModalOpen: false
        }
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    _onChange: function () {
        this.setState({
            user: this.getUser()
        });
    },
    handleToggle: function(e,id) {
        if (e != undefined  && e != null) {
            e.preventDefault();
        }
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    },
    renderOverlay: function () {
        if (!this.state.isModalOpen) {
            return <span/>;
        }
        console.warn('!! OPEN !!');
        return (
             <Modal className="challengeSignupModal" bsStyle={'success'} title={'Challenge Sign Up'} onRequestHide={this.handleToggle}>
                 <div className='modal-body'>
                     <Panel>Sign me up bitch</Panel>
                 </div>
                 <div className='modal-footer'>
                     <Button bsStyle={'success'} onClick={this.handleToggle}>Sign Up</Button>
                     <Button bsStyle={'warning'} onClick={this.handleToggle}>Cancel</Button>
                 </div>
            </Modal>
        );
    },
    render: function() {
        var u = this.getUser();
        if (u.userId == 0) {
            return null;
        }
        var c = u.challenges;
        var counter = c[ChallengeStatus.SENT].length
            + c[ChallengeStatus.PENDING].length
            + c[ChallengeStatus.ACCEPTED].length;

        var header = (
            <div>
                <Glyphicon glyph='cog' />Challenges<Badge>{counter}</Badge>
            </div>
        );

        var sentLink = (<MenuItemLink className='sentNav' to={ChallengeStatus.SENT.toLowerCase()} >
                <Glyphicon glyph='ok'/>
                Sent
                <Badge>
                    {c[ChallengeStatus.SENT].length}
                </Badge>
            </MenuItemLink>);

        var acceptedLink = (<MenuItemLink className='sentNav' to={ChallengeStatus.ACCEPTED.toLowerCase()} >
                <Glyphicon glyph='calendar'/>
                Accepted
                <Badge>
                    {c[ChallengeStatus.ACCEPTED].length}
                </Badge>
            </MenuItemLink>);

        var pendingLink = (<MenuItemLink className='sentNav' to={ChallengeStatus.PENDING.toLowerCase()} >
                <Glyphicon glyph='alert'/>
                Pending
                <Badge>
                    {c[ChallengeStatus.PENDING].length}
                </Badge>
            </MenuItemLink>);

        if (!u.challenge) {
            return (
                <div className="challengeStatusMenu">
                    <Panel expanded={false} defaultExpanded={false} className='challengePanelStatus' header={header} eventKey='1' >
                        <MenuItemLink className='requestNav' to={'challengeSignUp'}>
                            <Glyphicon glyph='info-sign'/>
                            What's this?
                        </MenuItemLink>
                    </Panel>
            </div>);
        }

        return (
        <div className="challengeStatusMenu">
            <Panel expanded={false} defaultExpanded={false} className='challengePanelStatus' header={header} eventKey='1' >
                {pendingLink}
                {acceptedLink}
                {sentLink}
                <MenuItemLink className='requestNav' to={ChallengeStatus.REQUEST.toLowerCase()}>
                    <Glyphicon glyph='flash'/>
                    Request
                </MenuItemLink>
            </Panel>
        </div>
        );
    }
});

module.exports = ChallengeNav;