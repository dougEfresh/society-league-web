var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link
    , History = Router.History;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamStandings = require('./TeamStandings.jsx');
var TeamChart = require('./TeamChart.jsx');
var Util = require('../../jsx/util.jsx');
var firstBy = require('../../lib/FirstBy.js');

var TeamApp = React.createClass({
    mixins: [UserContextMixin,History],
     getInitialState: function() {
         return {
             update: Date.now(),
             teams : []
        }
    },
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
         this.getData();
    },
    onChange: function (e) {
        e.preventDefault();
        if (this.props.location.pathname.indexOf("members") >= 0) {
            this.props.history.pushState(null,'/app/team/' + e.target.value + '/members',null);
            return;
        }
        if (this.props.location.pathname.indexOf("chart") >= 0) {
            this.props.history.pushState(null,'/app/team/' + e.target.value + '/chart',null);
            return;
        }
        this.props.history.pushState(null,'/app/team/' + e.target.value + '/standings',null);
    },
    getData: function() {
        if (this.getUser().admin) {
            Util.getSomeData({url:
                '/api/team/active', callback:  function (d) {
                    this.setState({teams: d})
                }.bind(this), module: 'TeamApp', router: this.props.history}
            );
        } else {
              Util.getSomeData({url: '/api/team/get/user' + this.getUser().id,
                      callback:function (d) {
                          this.setState({teams: d})}.bind(this),
                      module: 'TeamApp',
                      router: this.props.router}
              );
        }
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if (now - this.state.update > 1000*60*2)
            this.getData();
    },
    render: function () {
        var user = this.getUser();
        var teams = this.state.teams;
        if (teams.length == 0) {
            return null;
        }
        var team = null;
        teams.forEach(function(t){
            if (this.props.params.teamId == t.id) {
                team = t;
            }
        }.bind(this));
        if (team == null) {
            return null;
        }
        var options = [];
        var order = firstBy(function(a,b) {
            return a.season.name.localeCompare(b.season.name);
        });
        order = order.thenBy(function(a,b){
            return a.name.localeCompare(b.name);
        });
        teams = teams.sort(order);

        var prevSeason = teams[0].season;
        options.push(<option key={prevSeason.id} value={prevSeason.id}>{'------- ' + prevSeason.displayName +' -------'}</option>);
        teams.forEach(function(t) {
            if (t.challenge) {
                return;
            }
            if (prevSeason.id != t.season.id) {
                prevSeason = t.season;
                if (prevSeason.challenge)
                    return

                options.push(<option key={prevSeason.id} value={prevSeason.id}>{'-------  ' + prevSeason.displayName +' -------'}</option>);
            }
            options.push(<option key={t.id} value={t.id}>{t.name}</option>);
        });
        var select = (<select ref='user' onChange={this.onChange}
                                className="form-control"
                                value={this.props.params.teamId}
                                type={'select'}>
                            {options}
                        </select>);
        var teamHeader = select;
        var header = (
                <div style={{display: 'inline'}}>
                    <Link to={'/app/team/' + this.props.params.teamId + '/standings'} >
                        <button className={this.props.location.pathname.indexOf('standings') > 0 ? 'btn btn-success' : 'btn btn-default'}>
                            <i className="fa fa-users"></i><span className="main-item">{ ' Standings'}</span>
                        </button>
                    </Link>
                    <Link to={'/app/team/' + this.props.params.teamId  + '/members'}>
                        <button  className={this.props.location.pathname.indexOf('members') > 0 ? 'btn btn-success' : 'btn btn-default'}>
                            <i className="fa  fa-list-ol"></i><span className="main-item">{ ' Results'}</span>
                        </button>
                    </Link>
                    <Link to={'/app/team/' + this.props.params.teamId + '/chart'}>
                        <button  className={this.props.location.pathname.indexOf('chart') > 0 ? 'btn btn-success' : 'btn btn-default'}>
                            <i className="fa fa-bar-chart"></i>
                            <span className="main-item">{ ' Chart'}</span>
                        </button>
                    </Link>
                </div>
        );
            return (
                <div id="team-app">
                    {teamHeader}
                    {header}
                    {this.props.children}
                </div>
        );


    }
});

module.exports = TeamApp;
