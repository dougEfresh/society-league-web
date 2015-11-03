
var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var TopGunNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    getInitialState: function() {
        return {
            toggle: false
        }
    },
    goToSchedule: function(s){
        return function(e){
            this.props.toggleSide(e);
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/schedule/' + s.id);
        }.bind(this)
    },
    goToStandings: function(t) {
        return function(e){
            this.props.toggleSide(e);
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id + '/' + this.getUser().id );
        }.bind(this)
    },
    goToChallenge : function(s) {
        return function(e){
            this.props.toggleSide(e);
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/challenge');
        }.bind(this)
    },
    toggleDivision: function(e){
        e.preventDefault();
        this.setState({toggle: !this.state.toggle});
    },
    render: function() {
        if (!this.getUser().challenge) {
            return null;
        }
        var s = null;
        this.getUser().handicapSeasons.forEach(function(hs) {
            if (hs.season.challenge) {
                s = hs.season;
            }
        });
        var topGunCls = this.state.toggle ? "active" : "not-active" ; //this.props.location.pathname.indexOf("challenge") > 0 || this.props.params.seasonId == s.id ? "active" : "not-active";
        return(
            <li className={topGunCls + ' dropdown'}>
                <a onClick={this.toggleDivision} href="#">Top Gun
                    <span className={"fa fa-caret-" + (this.state.toggle ? "down side-caret" : "left side-caret")} ></span>
                </a>
                <ul className={"nav nav-second-level collapse" + (this.state.toggle ? " selected in" : "")} aria-expanded="true">
                    <li className={this.getUser().admin ? "challenge-nav" : "hide"} >
                        <a onClick={this.goToChallenge(s)} href="#">Challenge</a>
                    </li>
                    <li>
                        <a onClick={this.goToSchedule(s)} href="#">Schedule</a>
                    </li>
                    <li>
                        <a onClick={this.goToStandings(s)}href="#">Standings</a>
                    </li>
                </ul>
            </li>
        );
    }
});

module.exports = TopGunNav;