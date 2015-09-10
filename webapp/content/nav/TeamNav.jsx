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
var Util = require('../../jsx/util.jsx');

var TeamNav = React.createClass({
    mixins: [UserContextMixin,TeamMixin,Router.State,Router.Navigation],
    getInitialState: function () {
        return {
            update: Date.now(),
            data: []
        }
    },
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
        this.getData();
    },
    getData: function() {
        Util.getData('/api/team/get/' + this.getUser().id + '/current', function(d){
            this.setState({data: d});
        }.bind(this));
    },
    componentWillReceiveProps: function(nextProps) {
        var now = Date.now();
        if (now - this.state.update > 1000*60)
            this.getData();
    },
    render: function() {
        var teams = [];
        var user = this.getUser();
        this.state.data.forEach(function(t) {
            teams.push(
                <li key={t.name} className="teamNavLink" role="presentation">
                    <Link  to={'teamStandings'}  params={{userId: user.id ,teamId: t.id}} >{t.name}</Link>
                </li>
            );
        }.bind(this));
        var clName = "dropdown";
        if (this.getPath().indexOf('team') >= 0) {
            clName =  clName + " active";
        }
        return (
              <li id="team-nav" role="presentation" className={clName} >
                  <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                      <i className="fa fa-users"></i>&nbsp;
                      <span className="main-item">Teams</span>&nbsp;
                      <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu" role="menu">
                      {teams}
                  </ul>
              </li>
        );

    }
});

module.exports = TeamNav;