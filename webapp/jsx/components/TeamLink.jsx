var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    , Link = Router.Link;
var UserContextMixin = require('../UserContextMixin.jsx');
var TeamMixin = require('../TeamMixin.jsx');

var TeamLink = React.createClass({
    mixins: [UserContextMixin,TeamMixin,Router.state],
    propTypes: {
        team: ReactPropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            team: null,
            seasonId: null
        }
    },
    render: function() {
        if (this.props.team == null) {
            return null;
        }
        return (
            <Link className="teamLink" to="team" params={{teamId: this.props.team.teamId, seasonId: this.props.seasonId}}>
                {this.props.team.name}
            </Link>);
    }
});

module.exports = TeamLink;