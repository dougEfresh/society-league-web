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
    ,Panel = Bootstrap.Panel;
var ReactRouterBootstrap = require('react-router-bootstrap')
    ,NavItemLink = ReactRouterBootstrap.NavItemLink
    ,MenuItemLink = ReactRouterBootstrap.MenuItemLink;

var DataStore = require('../../stores/DataStore.jsx');
var UserContextMixin = require('../../UserContextMixin.jsx');
var DivisionConstants = require('../../constants/DivisionConstants.jsx');
var BallIcon = require('../../components/BallIcon.jsx');
var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');

var ChallengeNav = React.createClass({
    mixins: [UserContextMixin,Router.state],
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
        if (this.getUser().userId == 0) {
            return null;
        }
        var c = this.getUser().challenges;
        var counter =  c[ChallengeStatus.SENT].length
            + c[ChallengeStatus.PENDING].length
            + c[ChallengeStatus.ACCEPTED].length;
        var header = (
            <div>
                <Glyphicon glyph='cog' />Challenges<Badge>{counter}</Badge>
            </div>
        );
        return (
        <div className="challengeStatusMenu">
            <Panel expanded={false} defaultExpanded={false} className='challengePanelStatus' header={header} eventKey='1' >
                <MenuItemLink className='pendingNav' to={ChallengeStatus.PENDING.toLowerCase()}>
                    <Glyphicon glyph='alert'/>
                    Pending
                    <Badge>
                        {c[ChallengeStatus.PENDING].length}
                    </Badge>
                </MenuItemLink>
                <MenuItemLink className='acceptedNav' to={ChallengeStatus.ACCEPTED.toLowerCase()}>
                    <Glyphicon glyph='calendar'/>
                    Accepted
                    <Badge>
                        {c[ChallengeStatus.ACCEPTED].length}
                    </Badge>
                </MenuItemLink>
                <MenuItemLink className='sentNav' to={ChallengeStatus.SENT.toLowerCase()} >
                    <Glyphicon glyph='ok'/>
                    Sent
                    <Badge>
                        {c[ChallengeStatus.SENT].length}
                    </Badge>
                </MenuItemLink>
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