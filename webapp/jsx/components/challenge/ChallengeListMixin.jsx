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
var ChallengeActions = require('../../actions/ChallengeActions.jsx');

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
    contextTypes: {
        router: React.PropTypes.func
    },
    propTypes: {
        request: ReactPropTypes.object.isRequired,
        type:  ReactPropTypes.string.isRequired
    },
    getTimes: function () {
        var slots = {};
        var times = [];
        this.props.request.challenges.forEach(function(c){
            slots[c.slot.time] = (<span key={c.slot.id + c.id}>{c.slot.time}</span>)
        }.bind(this));
        for (var s in slots) {
            times.push(s);
        }
        return times;
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
        if (nine)
            games.push(<Badge key={9}>9</Badge>);

        if (eight)
            games.push(<Badge key={8}>8</Badge>);

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
    propTypes: {
        challenges: ReactPropTypes.array.isRequired,
        type: ReactPropTypes.string.isRequired
    },
    sendStatus: function(s) {
        var status = {
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
            accept:   <Button onClick={this.accept} key={'accept'} bsStyle={'success'} >Accept</Button>,
            deny:     <Button onClick={this.cancel} key={'deny'}  bsStyle={'warning'} >Deny</Button>,
            //change:   <Button key={'change'}  bsStyle={'primary'} >Change</Button>,
            change:   null,
            cancel:   <Button onClick={this.cancel} key={'cancel'}  bsStyle={'warning'} >Cancel</Button>,
            notify:   <Button onClick={this.notify} key={'notify'}  bsStyle={'success'} >Notify</Button>,
            calender: <Button key={'calendar'}  bsStyle={'success'} >Calendar</Button>
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