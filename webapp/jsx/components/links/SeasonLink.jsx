var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;

var SeasonLink = React.createClass({
    mixins: [Router.State],
    propTypes: {
        season: ReactPropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            season: null
        }
    },
    render: function() {
        if (this.props.season == null) {
            return null;
        }
        if (this.props.season.active) {
            return (
                <Link className="seasonLink" to={"/app/season/"+ this.props.season.id + '/standings'}>
                    {this.props.season.displayName}
                </Link>
            );
        } else {
            return (
                <span>{this.props.season.displayName}</span>
            );
        }
    }
});

module.exports = SeasonLink;