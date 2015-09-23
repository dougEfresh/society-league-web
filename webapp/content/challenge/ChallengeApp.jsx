var React = require('react/addons');
var Router = require('react-router');

var ChallengeApp = React.createClass({
    render: function() {
        return (
            <div>
                <h2>Challenges</h2>
                {this.props.children}
            </div>
        );
    }
});

module.exports = ChallengeApp;