var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Table = Bootstrap.Table;

var GroupRow = require('./GroupRow.jsx');
var UserContextMixin = require('../../../mixins/UserContextMixin.jsx');

var GroupList = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        challengeGroups: ReactPropTypes.array.isRequired,
        noSelect:  ReactPropTypes.bool.isRequired,
        type: ReactPropTypes.string.isRequired
    },
    render: function() {
        if (this.props.challengeGroups == null || this.props.challengeGroups.length <= 0) {
            return null;
        }
        var rows = [];
        var counter = 0;
        this.props.challengeGroups.forEach(function (g) {
            rows.push
            (
                <GroupRow type={this.props.type} key={counter++} noSelect={this.props.noSelect} challengeGroup={g}/>
            );
        }.bind(this));
        return (
            <Table className="challengeStatusTable striped">
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