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
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var Season = require('../../../lib/Season.js');
var Team = require('../../../lib/Team.js');
var User = require('../../../lib/User.js');
var Status = require('../../../lib/Status');

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
    handleToggle: function(e) {
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
                     <Panel>Sign me up</Panel>
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
        if (!u.isChallenge()) {

            debugger;
            return (
                <div className="challengeStatusMenu">
                    <Panel expanded={false} defaultExpanded={false} className='challengePanelStatus' header={null} eventKey='1' >
                        <MenuItemLink className='requestNav' to={'challengeSignUp'}>
                            <Glyphicon glyph='info-sign'/>
                            {"What's this?"}
                        </MenuItemLink>
                    </Panel>
                </div>);
        }
        var c = u.challenges;
        var counter = c[Status.SENT].length
            + c[Status.PENDING].length
            + c[Status.ACCEPTED].length;

        var sentLink = (
            <Link to={Status.SENT.toLowerCase()} >
                <Glyphicon glyph='ok'/>
                Sent
                <Badge>
                    {c[Status.SENT].length}
                </Badge>
            </Link>
        );

        var acceptedLink = (<Link  to={Status.ACCEPTED.toLowerCase()} >
                <Glyphicon glyph='calendar'/>
                Accepted
                <Badge>
                    {c[Status.ACCEPTED].length}
                </Badge>
            </Link>);

        var pendingLink = (

            <Link to={Status.PENDING.toLowerCase()} >
            <Glyphicon glyph='alert'/>
            Pending
            <Badge>
                {c[Status.PENDING].length}
            </Badge>
            </Link>);
        var requestLink = (
            <Link  to={Status.REQUEST.toLowerCase()}>
            <Glyphicon glyph='flash'/>
                Request
            </Link>
        );
        return (
             <li role="presentation" className="dropdown">
                 <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                     <Glyphicon glyph='cog' /> Challenges <Badge>{counter}</Badge>
                     <span className="caret"></span>
                 </a>
                 <ul className="dropdown-menu" role="menu">
                     <li className="teamNavLink" role="presentation">
                         {pendingLink}
                     </li>
                     <li className="teamNavLink" role="presentation">
                         {acceptedLink}
                     </li>
                     <li className="teamNavLink" role="presentation">
                         {sentLink}
                     </li>
                     <li className="teamNavLink" role="presentation">
                         {requestLink}
                     </li>
                 </ul>
             </li>
        );
        /*
        return (
        <div className="challengeStatusMenu">
            <Panel expanded={false} defaultExpanded={false} className='challengePanelStatus' header={header} eventKey='1' >
                {pendingLink}
                {acceptedLink}
                {sentLink}
            </Panel>
        </div>
        );
        */
    }
});

module.exports = ChallengeNav;
