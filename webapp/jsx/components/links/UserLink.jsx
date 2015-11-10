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
    componentWillMount: function(){
        React.initializeTouchEvents(true)
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
        var img = <span></span>;
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
            img = <img className="profile-pic " src={user.userProfile.imageUrl + '?height=15&width=15'}> </img>
        }
        if (this.props.onClick) {
            return (
                <div className="user-profile">{img}<a style={{cursor: 'pointer'}} onTouchStart={this.props.onClick} onClick={this.props.onClick}><span>{name}</span></a></div>
            );
        }
        var location = window.location.pathname;
        if (location.indexOf("display/") > 0) {

        }
        if (this.props.season) {
            return (
                <div className="user-profile">
                    {img}
                    <a className={'cursor-pointer'} style={{cursor: 'pointer'}}  href={'#/app/season/' + this.props.season.id + '/leaders/' + this.props.user.id}>
                        <span>{name}</span>
                    </a>
                </div>
            );
        }
        return (
             <div className="user-profile">
                 {img}
                 <Link style={{cursor: 'pointer'}} className={'cursor-pointer'} to={'/app/scout/' + this.props.user.id}>
                 <span>{name}</span>
                 </Link>
             </div>

        );
    }
});

module.exports = UserLink;
