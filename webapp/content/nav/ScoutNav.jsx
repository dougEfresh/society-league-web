var React = require('react/addons');
var Router = require('react-router')
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

var StatNav = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    render: function() {
        var active = "";
        if (this.isActive('scout') || this.isActive('stats')) {
            active = "active";
        }
        return (
            <li id="stat-nav" className={"main-item dropdown " + active} >
                <Link className='scoutNav' to='stats' params={{statsId: this.getUserId()}}>
                    <span className="fa fa-bar-chart"/>
                    <span className="main-item">Stats</span>&nbsp;
                </Link>
            </li>
        );
    }
});

module.exports = StatNav;