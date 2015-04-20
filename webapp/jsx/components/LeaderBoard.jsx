var React = require('react/addons');
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

    render: function() {
        return (
         <Table striped bordered condensed hover>
                  <thead>
                  <tr>
                      <th>Action</th>
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
