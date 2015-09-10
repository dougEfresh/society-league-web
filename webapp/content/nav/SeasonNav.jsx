var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

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
        this.setState({user: {}});
    },
    render: function() {
        var user = this.getUser();
        if (user.id == "0") {
            return null;
        }
        var seasons = [];
        user.handicapSeasons.forEach(function(hs) {
            var title = "unknown";

            switch (hs.season.division) {
                case DivisionConstants.NINE_BALL_TUESDAYS:
                    title = (<div><BallIcon type={"nine"}/> Tuesdays </div>);
                    break;
                case DivisionConstants.EIGHT_BALL_WEDNESDAYS:
                    title = (<div><BallIcon type={hs.division} /> Wednesdays</div>);
                    break;
                case DivisionConstants.EIGHT_BALL_THURSDAYS:
                    title = (<div><BallIcon type={hs.division} /> Thursdays </div>);
                    break;
                case DivisionConstants.MIXED_MONDAYS:
                    title = (<div>
                        <BallIcon type={DivisionType.EIGHT_BALL_CHALLENGE} />
                        <BallIcon type={DivisionType.NINE_BALL_CHALLENGE} /> Mondays
                    </div>);
                    break;
                default:
                    return;
            }
            seasons.push(
                <div key={hs.season.id}>
                <li id={'season-link-'+ hs.season.id} key={hs.season.id} role="presentation">
                    <Link  to="seasonStandings" params={{seasonId: hs.season.id}} >
                        {title}
                    </Link>
                </li>
                </div>
            );
        }.bind(this));

        if (seasons.length == 0){
            return null;
        }
        var clName = "dropdown";
        if (this.isActive('season')) {
            clName = clName + " active";
        }
        return (
             <li id="season-nav" role="presentation" className={clName} >
                 <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                     <span className="fa fa-server"></span>
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