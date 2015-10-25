var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var UserLink = require('./UserLink.jsx');

var TeamLink = React.createClass({
    mixins: [UserContextMixin,Router.State],
    propTypes: {
        team: ReactPropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            team: null
        }
    },
    toString: function() {
        return this.props.team.name;
    },
    render: function() {
        if (this.props.team == null) {
            return null;
        }
        //Challenge users should point to UserLink
        if (this.props.team.challengeUser != undefined & this.props.team.challengeUser != null ) {
            return <UserLink user={this.props.team.challengeUser} season={this.props.team.season.id} />;
        }

        return (
            <a onClick={this.props.onClick} className="teamLink" href='#'>
                {this.props.team.name}
            </a>
        );
    }
});

module.exports = TeamLink;