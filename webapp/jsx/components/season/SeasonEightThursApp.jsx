var React = require('react/addons');
var SeasonDisplay= require('./SeasonDisplay.jsx');

var SeasonEight = React.createClass({
    render: function() {
        if (this.props.seasonId == null) {
            return null;
        }
        return (
            <SeasonDisplay seasonId={this.props.seasonId} />
        );
    }
});

module.exports = SeasonEight;
