var React = require('react/addons');
var ReactPropTypes = React.PropTypes;

var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , NotFoundRoute = Router.NotFoundRoute
    , Link = Router.Link
    , DefaultRoute = Router.DefaultRoute;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,PanelGroup = Bootstrap.PanelGroup
    ,Badge = Bootstrap.Badge
    ,Table = Bootstrap.Table
    ,Panel = Bootstrap.Panel;

var ChallengeStore = require('../stores/ChallengeStore.jsx');
var UserStore = require('../stores/UserStore.jsx');
var ChallengeActions = require('../actions/ChallengeActions.jsx');
var ChallengeStatus = require('../constants/ChallengeStatus.jsx');
var StatActions = require('../actions/StatActions.jsx');
var StatStore = require('../stores/StatsStore.jsx');
var DataFactory = require('../DataFactoryMixin.jsx');
var StatsDisplay = require('../components/stats/StatsDisplay.jsx');

var LeaderBoard = React.createClass({
  mixins: [DataFactory],
    propTypes: {
        stats: ReactPropTypes.object.isRequired
    },
    render: function() {
        if ( this.props.stats == undefined || this.props.stats == null){
            return null;
        }
        var rows = [];
        var sorted = [];
        for(var id in this.props.stats) {
            var data = {
                id: id,
                name: UserStore.getName(id),
                actions: (<div>
                    <Button><Link to='request' params={{userId: this.getUserId()}}> Challenge</Link></Button>
                    <Button><Link to='stats' params={{userId: this.getUserId(), userStatId: id}}>Stats</Link></Button>
                    </div>),
                points: this.props.stats[id].all.points
            };
            sorted.push(data);
        }
        sorted.sort(function(a,b) {
            return b.points-a.points;
        });
        var counter=1;
        sorted.forEach(function(d){
            rows.push(
                <tr key={d.id}>
                    <td>{d.actions}</td>
                    <td>{counter}</td>
                    <td>{d.name}</td>
                    <td>{d.points}</td>
                </tr>);
            counter++
        });

        return (
         <Table striped bordered condensed hover>
                  <thead>
                  <tr>
                      <th>Action</th>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Points</th>
                  </tr>
                  </thead>
                  <tbody>
                  {rows}
                  </tbody>
              </Table>
        );
    }
});


module.exports = LeaderBoard;