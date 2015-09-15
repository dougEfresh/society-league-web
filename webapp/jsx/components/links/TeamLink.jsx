var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');

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
        return (
            <Link className="teamLink" to={"/app/team/" + this.props.team.id + '/standings'}>
                {this.props.team.name}
            </Link>
        );
    }
});

module.exports = TeamLink;