var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,ListGroup = Bootstrap.ListGroup
    ,ListGroupItem = Bootstrap.ListGroupItem
    ,Table =  Bootstrap.Table
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,Input = Bootstrap.Input
    ,Label = Bootstrap.Label
    ,Well = Bootstrap.Well
    ,Badge = Bootstrap.Badge
    ,SplitButton = Bootstrap.SplitButton;

var ChallengeStatus = require('../../../constants/ChallengeStatus.jsx');
var ChallengeStore = require('../../../stores/ChallengeStore.jsx');
var GroupRow = require('./GroupRow.jsx');

var GroupList = React.createClass({
    propTypes: {
        challengeGroups:   ReactPropTypes.array.isRequired,
        noSelect:  ReactPropTypes.bool.isRequired
    },
    render: function() {
          var rows = [];
          this.props.challengeGroups.forEach(function (g) {
              rows.push
              (
                  <GroupRow key={g.challenges[0].id} noSelect={this.props.noSelect} challengeGroup={g}/>
              );
          }.bind(this));
          return (
              <Table striped >
                  <thead>
                  <tr>
                      <th>Action</th>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Game</th>
                      <th>Times</th>
                  </tr>
                  </thead>
                  <tbody>
                  {rows}
                  </tbody>
              </Table>
          );
      }
});

module.exports = GroupList;