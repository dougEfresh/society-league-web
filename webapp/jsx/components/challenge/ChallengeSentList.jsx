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
    ,SplitButton = Bootstrap.SplitButton;


var ChallengeSentList = React.createClass({
    propTypes: {
        pending: ReactPropTypes.array.isRequired
    },

    render: function() {
        var rows  = [];
        this.props.sent.forEach(function(p) {
            rows.push(<tr key={p.opponent.id}><PendingRow pending={p} /></tr>);
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

var SentRow = React.createClass({
    propTypes: {
        pending: ReactPropTypes.object.isRequired
    },
    getTimes: function () {
        var times = [];
        this.props.sent.challenges.forEach(function(c){
            times.push(<span key={c.id}>{c.slot.time}</span>)
        }.bind(this));
        return times;
    },
    render: function() {
        return (
            <div>
                <td><PendingAction challenges={this.props.sent.challenges}/>  </td>
            <td>
                {this.props.sent.date}
            </td>
                <td>
                    {this.props.sent.opponent.name}
                </td>
                <td>
                    {this.getTimes()}
                </td>
            </div>
        )
    }
});

var SentAction = React.createClass({
    propTypes: {
        challenges: ReactPropTypes.array.isRequired
    },
    render: function() {
        return (
            <SplitButton bsStyle={'primary'} title={'Actions'} key={'1'} >
                <MenuItem eventKey='1'>Modify</MenuItem>
                <MenuItem eventKey='2'>Add Calendar</MenuItem>
                <MenuItem eventKey='3'>Cancel</MenuItem>
            </SplitButton>
        )
    }
});


module.exports = ChallengeSentList;