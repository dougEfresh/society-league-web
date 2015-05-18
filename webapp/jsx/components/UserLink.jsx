var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../mixins/UserContextMixin.jsx');

var UserLink = React.createClass({
    mixins: [UserContextMixin],
    propTypes: {
        user: ReactPropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            user: null,
            seasonId: 0
        }
    },
    toString: function() {
        return this.props.user.sName();
    },
    render: function() {
        if (this.props.user == null) {
            return null;
        }
        return (
                <a className="userLink" href={'#/app/scout/' + this.props.user.userId}>
                    {this.props.user.sName() + ' (' + this.props.user.getCurrentHandicap(this.props.seasonId) + ')'}
                </a>
        );
    }    //
});

module.exports = UserLink;
