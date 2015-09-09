var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');

var UserLink = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        user: ReactPropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            user: null
        }
    },
    toString: function() {
        return this.props.user.name;
    },
    render: function() {
        if (this.props.user == null || !(this.props.user instanceof Object)) {
            return null;
        }
        var hc = "";
        var name = this.props.user.name;
        if (this.props.handicap != undefined) {
            hc = this.props.handicap;
        } else  if (this.props.season != undefined) {
            this.props.user.handicapSeasons.forEach(function(hs){
                if (hs.season.id == this.props.season) {
                    hc = hs.handicapDisplay;
                }
            }.bind(this));

        }
        if (hc.length > 0) {
            name += ' (' + hc + ')';
        }
        return (
                <Link to='stats' params={{statsId: this.props.user.id}}>
                    {name}
                </Link>
        );
    }
});

module.exports = UserLink;
