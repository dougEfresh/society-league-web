var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../mixins/UserContextMixin.jsx');

var TeamLink = React.createClass({
    mixins: [UserContextMixin,Router.State],
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
            </Link>
        );
    }
});

module.exports = TeamLink;