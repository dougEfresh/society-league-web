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

var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var DivisionConstants = require('../../jsx/constants/DivisionConstants.jsx');
var BallIcon = require('../../jsx/components/BallIcon.jsx');
var Season = require('../../lib/Season.js');
var Division = require('../../lib/Division.js');
var Team = require('../../lib/Team.js');
var User = require('../../lib/User.js');
var DivisionType = require('../../lib/DivisionType');
var Status = require('../../lib/Status');
var TeamMatch = require('../../lib/TeamMatch');
var Result = require('../../lib/Result');

var SeasonNav = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,Router.State,Router.Navigation],
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
            user: this.state.user
        });
    },
    render: function() {
        if (this.getUser().id == 0) {
            return null;
        }
        var user = this.getUser();
        var seasons = [];
        var currentSeasons = this.getCurrentSeasons();
        if (currentSeasons.length == 0) {
            return null;
        }
        if (!user.isAdmin()) {
            currentSeasons = user.getCurrentSeasons();
        }
        currentSeasons.forEach(function(t) {
            var title = "unknown";
            var display = 'none'; //TODO remove to see all seasons
            switch (t.division.type) {
                case DivisionConstants.NINE_BALL_TUESDAYS:
                    title = (<div><BallIcon type={t.division.type}/> Tuesdays </div>);
                    break;
                case DivisionConstants.EIGHT_BALL_WEDNESDAYS:
                    title = (<div><BallIcon type={t.division.type} /> Wednesdays</div>);
                    break;
                case DivisionConstants.EIGHT_BALL_THURSDAYS:
                    title = (<div><BallIcon type={t.division.type} /> Thursdays </div>);
                    break;
                case DivisionConstants.EIGHT_BALL_MIXED_MONDAYS:
                    title = (<div>
                        <BallIcon type={DivisionType.EIGHT_BALL_CHALLENGE} />
                        <BallIcon type={DivisionType.NINE_BALL_CHALLENGE} /> Mondays
                    </div>);
                    break;
                default:
                    return;
            }
            seasons.push(
                <div style={{display: display}}>
                <li id={'season-link-'+ t.id} key={t.id} role="presentation">
                    <Link  to="seasonStandings" params={{seasonId: t.id}} >
                        {title}
                    </Link>
                </li>
                </div>
            );
        }.bind(this));
        var active = "";
        if (this.isActive('season') || this.isActive('challengeSeason')) {
            active = "active";
        }
        if (this.getUser().isChallenge()) {

            var challengeSeason = null;
            this.getUser().getCurrentSeasons().forEach(function(s){
                if (s.isChallenge()) {
                    challengeSeason = s;
                }
            });
            seasons.push(
                <li id={'challenge-season-link'} key={'challenge'} role="presentation">
                    <Link to="seasonLeaders" params={{seasonId: challengeSeason.id}} >
                        {'Challenge'}
                    </Link>
                </li>)
        }

        return (
             <li id="season-nav" role="presentation" className={'dropdown ' + active} >
                 <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                     <i className="fa fa-trophy"></i>&nbsp;
                     <span className="main-item">Seasons</span>&nbsp;
                     <span className="caret"></span>
                 </a>
                 <ul className="dropdown-menu" role="menu">
                     {seasons}
                 </ul>
             </li>
        );
    }
});

module.exports = SeasonNav;