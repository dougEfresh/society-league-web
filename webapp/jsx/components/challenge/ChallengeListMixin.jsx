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
    ,Badge = Bootstrap.Badge
    ,SplitButton = Bootstrap.SplitButton;

var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');

var ChallengeListMixin = {
    contextTypes: {
        router: React.PropTypes.func
    },
    propTypes: {
        requests: ReactPropTypes.array.isRequired,
        type:  ReactPropTypes.string.isRequired
    },
    render: function() {
          var rows = [];
          this.props.requests.forEach(function (p) {
              rows.push
              (<tr key={p.challenges[0].id}>
                      <RequestRow type={this.props.type} request={p}/>
                  </tr>
              );
          }.bind(this));
          return (
              <Table striped bordered condensed hover>
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

          )
      }
};

var RequestRow = React.createClass({
    propTypes: {
        request: ReactPropTypes.object.isRequired,
        type:  ReactPropTypes.string.isRequired
    },
    getTimes: function () {
        var times = [];
        this.props.request.challenges.forEach(function(c){
            times.push(<span key={c.id}>{c.slot.time}</span>)
        }.bind(this));
        return times;
    },
    getGames: function() {
        var games = [];
        this.props.request.challenges.forEach(function(c) {
            //TODO create a method/property on the server
            if (c.challenger.division.type == 'EIGHT_BALL_CHALLENGE') {
                games.push(<Badge key={8}>8</Badge>);
            } else {
                games.push(<Badge key={9}>9</Badge>);
            }
        });
        return games;
    },
    getOpponent: function() {
        //return this.props.request[this.props.opponentField].name
        if (this.props.type == ChallengeStatus.SENT ||
            this.props.type == ChallengeStatus.NEEDS_NOTIFY)
            return this.props.request.opponent.name;

        return this.props.request.challenger.name;
    },
    render: function() {
        return (
            <div>
                <td>
                    <RequestAction type={this.props.type} challenges={this.props.request.challenges}/>
                </td>
                <td>
                    {dateFormat(this.props.request.date)}
                </td>
                <td>
                    {this.getOpponent()}
                </td>
                <td>
                    {this.getGames()}
                </td>
                <td>
                    {this.getTimes()}
                </td>
            </div>
        )
    }
});

var RequestAction = React.createClass({
    propTypes: {
        challenges: ReactPropTypes.array.isRequired,
        type: ReactPropTypes.string.isRequired
    },
    render: function() {
         if (this.props.type == ChallengeStatus.PENDING) {
            return (
                <ButtonGroup bsStyle={'primary'} title={'Actions'} key={'1'} >
                    <Button bsStyle={'success'} eventKey='3'>Accept</Button>
                    <Button bsStyle={'warning'} eventKey='3'>Deny</Button>
                </ButtonGroup>
            )
        }
        if (this.props.type == ChallengeStatus.SENT) {
            return (
                <ButtonGroup bsStyle={'primary'} title={'Actions'} key={'1'} >
                    <Button bsStyle={'primary'} eventKey='3'>Modify</Button>
                    <Button bsStyle={'warning'} eventKey='3'>Cancel</Button>
                </ButtonGroup>
            )
        }
        if (this.props.type == ChallengeStatus.NEEDS_NOTIFY) {
            return (
                <ButtonGroup bsStyle={'primary'} title={'Actions'} key={'1'} >
                    <Button bsStyle={'success'} eventKey='3'>Notify</Button>
                    <Button bsStyle={'primary'} eventKey='3'>Modify</Button>
                    <Button bsStyle={'warning'} eventKey='3'>Cancel</Button>
                </ButtonGroup>
            )
        }
        return (
            <ButtonGroup bsStyle={'primary'} title={'Actions'} key={'1'} >
                <Button eventKey='1'>Notify</Button>
                <Button eventKey='3'>Modify</Button>
                <Button eventKey='3'>Cancel</Button>
            </ButtonGroup>
        )
    }
});

function dateFormat(date) {
    return date.substr(5,10).replace('-','/');
}

module.exports = ChallengeListMixin;