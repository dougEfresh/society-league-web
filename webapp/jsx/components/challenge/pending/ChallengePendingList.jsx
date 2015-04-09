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


var ChallengeRequestedList = React.createClass({
    propTypes: {
        requests: ReactPropTypes.array.isRequired
    },
    render: function() {
        var rows  = [];
        this.props.requests.forEach(function(p) {
            rows.push
            (  <tr key={p.challenges[0].id}>
                    <RequestedRow request={p} />
                </tr>
            );
        });
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
});

var RequestedRow = React.createClass({
    propTypes: {
        request: ReactPropTypes.object.isRequired
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
            //todo move this to server
            if (c.challenger.division.type == 'EIGHT_BALL_CHALLENGE') {
                games.push(<Badge key={8}>8</Badge>);
            } else {
                games.push(<Badge key={9}>9</Badge>);
            }
        });
        return games;
    },
    render: function() {
        return (
            <div>
                <td>
                    <RequestedAction challenges={this.props.request.challenges}/>
                </td>
                <td>
                    {this.props.request.date}
                </td>
                <td>
                    {this.props.request.challenger.name}
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

var RequestedAction = React.createClass({
    propTypes: {
        challenges: ReactPropTypes.array.isRequired
    },
    render: function() {
        return (
            <SplitButton bsStyle={'primary'} title={'Actions'} key={'1'} >
                <MenuItem eventKey='1'>Notify</MenuItem>
                <MenuItem eventKey='3'>Modify</MenuItem>
                <MenuItem eventKey='3'>Cancel</MenuItem>
            </SplitButton>
        )
    }
});


module.exports = ChallengeRequestedList;