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

var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Season = require('../../lib/Season.js');
var Team = require('../../lib/Team.js');
var User = require('../../lib/User.js');
var Status = require('../../lib/Status');

var ChallengeNav = React.createClass({
    mixins: [UserContextMixin,Router.State],
    getInitialState: function () {
        return {
            user: this.getUser()
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
    render: function() {
        var u = this.getUser();
        if (u.userId == 0) {
            return null;
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
        var active = "";
        if (this.getPath().indexOf('challenge') >= 0) {
            active = "active";
        }
        var noChallenge = (<ul className="dropdown-menu" role="menu">
                     <li className="teamNavLink" role="presentation">
                         <Link to='challengeSignUp' >What's This</Link>
                     </li>
        </ul>);

        if (!this.getUser().isChallenge()) {
                 return (
                     <li role="presentation" className={'dropdown ' + active}>
                         <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                             <Glyphicon glyph='cog' /> <span className="main-item"> Challenges </span><Badge>{counter}</Badge>
                             <span className="caret"></span>
                         </a>
                         {noChallenge}
                     </li>
                 )
        }

        return (
             <li id="challenge-nav" role="presentation" className={'dropdown ' + active}>
                 <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                     <Glyphicon glyph='cog' /> <span className="main-item"> Challenges </span><Badge>{counter}</Badge>
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
