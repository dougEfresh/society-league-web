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
            slot: 0
        }
    },
    propTypes: {
        request: ReactPropTypes.object.isRequired,
        type:  ReactPropTypes.string.isRequired
    },
    componentDidMount: function() {
        if (this.props.request.challenges.length == 1) {
            var game = this.resolveGameNumber(this.props.request.games[0]);
            var slot = this.props.request.slots[0].id;
            this.setState({
                game: game,
                slot: slot
            });
        }
    },
    onSelectTime: function(e) {
        this.setState({slot: this.refs.time.getValue()});
    },
    getTimes: function () {
        var times = [];

        if (this.props.type == ChallengeStatus.NEEDS_NOTIFY || this.props.type == ChallengeStatus.SENT) {
            this.props.request.slots.forEach(function (s) {
                times.push(<Label key={s.id}>{s.time}</Label>);
            }.bind(this));
            return times;
        }
        if (this.props.request.slots.length == 1) {
            return <Label>{this.props.request.slots[0].time}</Label>;
        }

        times.push(<option key={0} value={0}>{'choose'}</option>);
        this.props.request.slots.forEach(function (s) {
            times.push(<option key={s.id} value={s.id}>{s.time}</option>);
        }.bind(this));


        return <Input ref='time' onChange={this.onSelectTime} value={this.state.slot} type={'select'}> {times}</Input>;
    },
    resolveGameNumber: function(type) {
        if (type == 'EIGHT_BALL_CHALLENGE') {
            return '8';
        }
        return '9';
    },
    isValid: function() {
        return this.refs.game != undefined && this.refs.game.isValid() && this.state.slot > 0;
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
                    <RequestAction disabled={!this.isValid()} type={this.props.type} challenges={this.props.request.challenges}/>
                </td>
                <td>
                    {dateFormat(this.props.request.date)}
                </td>
                <td>
                    {this.getOpponent()}
                </td>
                <td>
                    <div>game</div>
                </td>
                <td>
                    <div>times</div>

                </td>
            </div>
        )
    }
});
// <RequestGameButtons ref='game' request={this.props.request} type={this.props.type} />
//{this.getTimes()}
var RequestGameButtons = React.createClass({
    mixins: [DataFactory],
    getInitialState: function() {
        return {
            game: null
        }
    },
    componentDidMount: function() {
        if (this.props.request.challenges.length == 1) {
            var game = this.resolveGameNumber(this.props.request.games[0]);
            this.setState({
                game: game
            });
        }
    },
    propTypes: {
        request: ReactPropTypes.object.isRequired,
        type:  ReactPropTypes.string.isRequired
    },
    resolveGameNumber: function(type) {
        if (type == 'EIGHT_BALL_CHALLENGE') {
            return '8';
        }
        return '9';
    },
     onSelectGame: function(e) {
        this.setState({game: e.target.textContent});
    },
    isValid: function() {
        return this.state.game != null;
    },
    getButton: function(g) {
        /*
        if (this.state.game == null) {
            return ( <Button onClick={this.onSelectGame} key={this.resolveGameNumber(g)} bsStyle={'default'}>
                        <i className="fa fa-times">{this.resolveGameNumber(g)}</i>
                    </Button>);
        }
*/
        return (<Button disabled key={this.resolveGameNumber(g)} bsStyle={'success'}><i className="fa fa-check">{this.resolveGameNumber(g)}</i></Button>);
    },
    render: function() {
         var games = [];

        if (this.props.type == ChallengeStatus.NEEDS_NOTIFY || this.props.type == ChallengeStatus.SENT) {
            this.props.request.games.forEach(function(g) {
                if (g == 'EIGHT_BALL_CHALLENGE')
                    games.push(<Button disabled key={8} bsStyle={'success'}><i className="fa fa-check">8</i></Button>);
                else
                    games.push(<Button disabled key={9} bsStyle={'success'}><i className="fa fa-check">9</i></Button>);
            }.bind(this));
            return (<div>{games}</div>);
        }
        return (
            <div>
                {this.getButton(this.props.request.games[0])}
                {this.getButton(this.props.request.games[1])}
            </div>
        );
        //var eight = this.resolveGameNumber(this.props.requests.games[0]) == '8' ?
        /*
        this.props.request.games.forEach(function(g) {
            console.log(JSON.stringify(this.state));
            var gameType = this.resolveGameNumber(g);
            if (this.state.game == null ) {
                games.push(
                    <Button onClick={this.onSelectGame} key={gameType} bsStyle={'default'}>
                        <i className="fa fa-times">{gameType}</i>
                    </Button>);
            } else if (this.state.game == gameType) {
                    games.push(
                        <Button onClick={this.onSelectGame} key={gameType} bsStyle={'success'}>
                            <i className="fa fa-check">{gameType}</i>
                        </Button>
                    );
            } else {
                games.push(
                    <Button onClick={this.onSelectGame} key={gameType} bsStyle={'default'}>
                    <i className="fa fa-times">{gameType}</i>
                </Button>);
            }
        }.bind(this));
        */
        if (games.length > 0)
            return (<div>{games}</div>);
        return null;
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
            accept:   <Button bsSize='xsmall'  disabled={this.props.disabled}  onClick={this.accept} key={'accept'} bsStyle={this.props.disabled ? 'danger' : 'success'} >Accept</Button>,
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