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

var ChallengeStatus = require('../../constants/ChallengeStatus.jsx');
var ChallengeActions = require('../../actions/ChallengeActions.jsx');
var ChallengeStore = require('../../stores/ChallengeStore.jsx');
var DataFactory = require('../../DataFactoryMixin.jsx');

var ChallengeListMixin = {
    mixins: [DataFactory],
    propTypes: {
        type:  ReactPropTypes.string.isRequired
    },
    getInitialState: function() {
        return {
            requests: ChallengeStore.getAllChallenges()
        }
    },
    componentDidMount: function() {
        ChallengeStore.addChangeListener(this._onChange);
        ChallengeStore.addRequestListener(this._onChange);
    },
    componentWillUnmount: function() {
        ChallengeStore.removeRequestListener(this._onChange);
        ChallengeStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState({requests: ChallengeStore.getAllChallenges()});
    },
    render: function() {
          var rows = [];
          this.state.requests[this.props.type].forEach(function (p) {
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
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            game: null,
            time: null
        }
    },
    propTypes: {
        request: ReactPropTypes.object.isRequired,
        type:  ReactPropTypes.string.isRequired
    },
    getTimes: function () {
        var slots = {};
        var times = [];
        if (this.props.type == ChallengeStatus.NEEDS_NOTIFY || this.props.type == ChallengeStatus.SENT) {
            this.props.request.challenges.forEach(function (c) {
                slots[c.slot.time] = (<Label key={c.slot.id + c.id}>{c.slot.time}</Label>)
            }.bind(this));
            for (var s in slots) {
                times.push(slots[s]);
            }
            return times;
        }

        this.props.request.challenges.forEach(function(c){
            slots[c.slot.time] = (<option key={c.slot.id + c.id} value={c.slot.id}>{c.slot.time}</option>)
        }.bind(this));
        for (var s in slots) {
            times.push(slots[s]);
        }
        if (times.length ==1) {
            return <Label>{this.props.request.challenges[0].slot.time}</Label>;
        }

        return <Input value={ this.props.request.challenges[0].slot.id} type={'select'}> {times}</Input>;

    },
    onSelectGame: function(e) {
        this.setState({game: e.target.textContent});
    },
    getGames: function() {
        var games = [];
        var nine = false;
        var eight = false;
        this.props.request.challenges.forEach(function(c) {
            //TODO create a method/property on the server
            if (c.challenger.division.type == 'EIGHT_BALL_CHALLENGE') {
                eight = true;
            }
            if (c.challenger.division.type == 'NINE_BALL_CHALLENGE') {
                nine = true;
            }
        });
          if (this.props.type == ChallengeStatus.NEEDS_NOTIFY || this.props.type == ChallengeStatus.SENT) {
              if (eight) {
                  games.push(<Button disabled key={9} bsStyle={'success'}><i className="fa fa-check">9</i></Button>);
              }
              if (nine) {
                  games.push(<Button disabled key={8} bsStyle={'success'}><i className="fa fa-check">8</i></Button>);
              }
          }
        if (nine && eight) {
            if (this.state.game == null) {
                games.push(<Button onClick={this.onSelectGame} key={9} bsStyle={'default'}><i
                    className="fa fa-times">9</i></Button>);
                games.push(<Button onClick={this.onSelectGame} key={8} bsStyle={'default'}><i
                    className="fa fa-times">8</i></Button>);
            } else if (this.state.game == '9') {
                games.push(
                    <Button onClick={this.onSelectGame} key={9} bsStyle={'success'}>
                        <i className="fa fa-check">9</i>
                    </Button>
                );
                games.push(
                    <Button onClick={this.onSelectGame} key={8} bsStyle={'default'}>
                        <i className="fa fa-times">8</i>
                    </Button>);
            } else {
                games.push(
                    <Button onClick={this.onSelectGame} key={9} bsStyle={'default'}>
                        <i className="fa fa-times">9</i>
                    </Button>
                );
                games.push(
                    <Button onClick={this.onSelectGame} key={8} bsStyle={'success'}>
                        <i className="fa fa-check">8</i>
                    </Button>
                );
            }

        } else if (eight) {
            games.push(<Button disabled key={9} bsStyle={'success'}><i className="fa fa-check">9</i></Button>);
        } else if (nine) {
            games.push(<Button disabled key={8} bsStyle={'success'}><i className="fa fa-check">8</i></Button>);
        }

        return games;
    },
    getOpponent: function() {
        //return this.props.request[this.props.opponentField].name
        if (this.props.type == ChallengeStatus.SENT ||
            this.props.type == ChallengeStatus.NEEDS_NOTIFY) {
            return this.props.request.opponent.name;
	}	    
	
 	if (this.props.type == ChallengeStatus.ACCEPTED) {
	   return this.props.request.challenger.id == parseInt(this.context.router.getCurrentParams().userId) ? this.props.request.opponent.name :  this.props.request.challenger.name;
	}

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
    mixins: [DataFactory],
    propTypes: {
        challenges: ReactPropTypes.array.isRequired,
        type: ReactPropTypes.string.isRequired
    },
    sendStatus: function(s) {
        var status = {
            userId: this.getUserId(),
            status : s,
            challenger: {id: 0},
            opponent:  {id: 0},
            challenges: []
        };
        status.challenger.id = this.props.challenges[0].challenger.id;
        status.challenger.id = this.props.challenges[0].opponent.id;
        this.props.challenges.forEach(function(c) {
            status.challenges.push({id: c.id});
        });
        ChallengeActions.status(status);
        console.log('Status: ' + JSON.stringify(status));
    },
    cancel: function() {
        return this.sendStatus(ChallengeStatus.CANCELLED);
    },
    notify: function() {
        return this.sendStatus(ChallengeStatus.PENDING);
    },
    accept: function() {
        return this.sendStatus(ChallengeStatus.ACCEPTED);
    },
    render: function() {
        var buttons = {
            accept:   <Button bsSize='xsmall' onClick={this.accept} key={'accept'} bsStyle={'success'} >Accept</Button>,
            deny:     <Button bsSize='xsmall'  onClick={this.cancel} key={'deny'}  bsStyle={'warning'} >Deny</Button>,
            //change:   <Button key={'change'}  bsStyle={'primary'} >Change</Button>,
            change:   null,
            cancel:   <Button bsSize='xsmall'  onClick={this.cancel} key={'cancel'}  bsStyle={'warning'} >Cancel</Button>,
            notify:   <Button bsSize='xsmall'  onClick={this.notify} key={'notify'}  bsStyle={'success'} >Notify</Button>,
            calender: <Button disabled bsSize='xsmall'  key={'calendar'}  bsStyle={'success'} >Calendar</Button>
        };

        var actions = null;

        switch(this.props.type) {
            case ChallengeStatus.PENDING:
                actions =
                    (<div>
                        {buttons.accept}
                        {buttons.deny}
                    </div>);
                break;
            case ChallengeStatus.SENT:
                actions =
                    (<div >
                        {buttons.calender}
                        {buttons.change}
                        {buttons.cancel}
                    </div>);
                break;
            case ChallengeStatus.NEEDS_NOTIFY:
                actions =
                    (<div >
                        {buttons.notify}
                        {buttons.change}
                        {buttons.cancel}
                    </div>);
                break;
            case ChallengeStatus.ACCEPTED:
                actions =
                    (<div >
                        {buttons.change}
                        {buttons.cancel}
                    </div>);
                break;
            default:
        }

        return actions;
    }
});

function dateFormat(date) {
    return date.substr(5,10).replace('-','/');
}

module.exports = ChallengeListMixin;