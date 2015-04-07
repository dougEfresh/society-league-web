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


var ChallengePendingList = React.createClass({
    propTypes: {
        pending: ReactPropTypes.array.isRequired
    },

    render: function() {
        var rows  = [];
        this.props.pending.forEach(function(p) {
            rows.push(<tr key={p.opponent.id}><PendingRow pending={p} /></tr>);
        });
        return (
              <Table striped bordered condensed hover>
                        <thead>
                        <tr>
                            <th>Action</th>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Time</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
              </Table>

        )
    }
});

var PendingRow = React.createClass({
    propTypes: {
        pending: ReactPropTypes.object.isRequired
    },
    getTimes: function () {
        var times = [];
        this.props.pending.challenges.forEach(function(c){
            times.push(<span key={c.id}>{c.slot.time}</span>)
        }.bind(this));
        return times;
    },
    render: function() {
        return (
            <div>
                <td><PendingAction challenges={this.props.pending.challenges}/>  </td>
            <td>
                {this.props.pending.date}
            </td>
                <td>
                    {this.props.pending.opponent.name}
                </td>
                <td>
                    {this.getTimes()}
                </td>
            </div>
        )
    }
});

var PendingAction = React.createClass({
    propTypes: {
        challenges: ReactPropTypes.array.isRequired
    },
    render: function() {
        return (
            <SplitButton bsStyle={'primary'} title={'Actions'} key={'1'} >
                <MenuItem eventKey='1'>A1</MenuItem>
                <MenuItem eventKey='2'>A2</MenuItem>
                <MenuItem eventKey='3'>A3</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey='4'>A4</MenuItem>
            </SplitButton>
        )
    }
});


module.exports = ChallengePendingList;