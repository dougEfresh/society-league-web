var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var Handicap = require('../../../lib/Handicap');

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
            return (
            <a href='#' onClick={this.props.onClick} >
                <img src={user.userProfile.imageUrl + query}> </img>
                {name}
            </a>
            )
        }
        if (this.props.onClick) {
            return (
                <a href='#' onClick={this.props.onClick} >{name} </a>
            );
        }
        return (
            <a  href='#/app/display/' >{name} </a>
        );
        /*

        */
    }
});

module.exports = UserLink;
