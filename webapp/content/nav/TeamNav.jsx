var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var Season = require('../../lib/Season.js');
var Division = require('../../lib/Division.js');
var Team = require('../../lib/Team.js');
var User = require('../../lib/User.js');
var DivisionType = require('../../lib/DivisionType');
var Status = require('../../lib/Status');
var TeamMatch = require('../../lib/TeamMatch');
var Result = require('../../lib/Result');

var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');

var TeamNav = React.createClass({
    mixins: [UserContextMixin,TeamMixin,Router.State,Router.Navigation],
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
        if (this.getUser().id == 0) {
            return null;
        }
        var teams = [];
        this.getUser().getCurrentTeams().forEach(function(t) {
            teams.push(
                <li key={t.name} className="teamNavLink" role="presentation">
                    <Link  to={'teamStandings'}  params={{userId: this.getUserId(),teamId: t.id, seasonId: t.getSeason().id}} >{t.name}</Link>
                </li>
            );
        }.bind(this));
        var active = "";
        if (this.getPath().indexOf('team') >= 0) {
            active = "active";
        }
        return (
            <div style={{display: 'none'}}>
              <li id="team-nav" role="presentation" className={'dropdown ' + active} >
                  <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                      <i className="fa fa-users"></i>&nbsp;
                      <span className="main-item">Teams</span>&nbsp;
                      <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu" role="menu">
                      {teams}
                  </ul>
              </li>
            </div>
        );
    }
});

module.exports = TeamNav;