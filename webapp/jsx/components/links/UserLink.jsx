var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var Handicap = require('../../../lib/Handicap');
var mobile = (window.innerWidth > 0) ? window.innerWidth < 768: screen.width < 768;
var UserLink = React.createClass({
    mixins: [UserContextMixin],
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
        if (mobile){
            name = this.props.user.firstName + " " + this.props.user.lastName.substr(0,1) + ".";
        }
        //TODO speed up
        if (this.props.handicap != undefined) {
            hc = this.props.handicap;
        } else if (this.props.season != undefined) {
            this.props.user.handicapSeasons.forEach(function(hs){
                if (hs.season.id == this.props.season) {
                    hc = hs.handicap;
                }
            }.bind(this));
        }
        if (hc.length > 0) {
            //name += ' (' + Handicap.formatHandicap(hc)+ ')';
        }
        var user = this.props.user;
        var img = null;
        if (user.profile) {
            var query = '?';
            if (this.props.height)
                query += 'height=' + this.props.height + '&';
            if (this.props.width)
                query += 'height=' + this.props.width + '&';
            if (this.props.type)
                query += 'type=' + this.props.type + '&';
            if (query = '?') {
                query += 'height=25&width=25'
            }
            //<img className="img-responsive " src={user.userProfile.imageUrl + query}> </img>
            img = <img className="profile-pic" src={'https://graph.facebook.com/v2.3/10206313577893040/picture?height=25&width=25'}> </img>;
        }

        if (this.props.onClick) {
            return (
                <a href='#' onClick={this.props.onClick}>{img}<span>{name}</span></a>
            );
        }
        return (
            <a  href='#/app/display/'>{img}<span>{name}</span></a>
        );
    }
});

module.exports = UserLink;
