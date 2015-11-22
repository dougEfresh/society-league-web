var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var AdminNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    getInitialState: function() {
        return {
            seasons: [],
            toggleAdmin: false
        }
    },
    componentDidMount: function() {
        Util.getSomeData({
            url: '/api/season/active',
            callback: function(d) {this.setState({seasons: d})}.bind(this),
            module: 'AdminNav',
            router: this.props.history
        });
    },
    toggleAdmin: function(e) {
        e.preventDefault();
        this.setState({toggleAdmin: !this.state.toggleAdmin});
    },
    goToUsers: function(e){
          this.setState({toggleSide: false});
          e.preventDefault();
          this.props.toggleSide(e);
          this.props.history.pushState(null,'/app/admin/users');
    },
    goToTeams: function(e){
          this.setState({toggleSide: false});
          e.preventDefault();
          this.props.toggleSide(e);
          this.props.history.pushState(null,'/app/admin/teams');
    },
    goToSchedule: function(s){
        return function(e){
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.toggleSide(e);
            this.props.history.pushState(null,'/app/season/' + s.id + '/team/results');
        }.bind(this)
    },
    goToLeader: function(s){
        return function(e){
            this.props.toggleSide(e);
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/season/' + s.id + '/leaders');
        }.bind(this)
    },
    goToStandings: function(s) {
        return function(e){
            this.props.toggleSide(e);
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/display/' + s.id);
        }.bind(this)
    },
    expandSeason: function(s) {
        return function(e) {
            //this.props.toggleSide(e);
            e.preventDefault();
            s.toggle = s.toggle == undefined ? true : !s.toggle;
            //this.props.history.pushState(null,'/app/display/' + t.season.id + '/' + t.id + '/' + this.getUser().id );
            this.setState({});
        }.bind(this);
    },

    render: function() {
        var user = this.getUser();
        var cls = this.context.location.pathname.indexOf("/app/admin") > 0 ? "active" : "not-active";
        if (!user.admin || this.state.seasons.length == 0) {
           return null;
        }
        var seasonNav = [];
         this.state.seasons.forEach(function(s) {
            if (!s.active)
                return;
            var standingsClass = this.context.location.pathname.indexOf('display/') > 0 ? 'selected ' : "not-selected";
            var scheduleClass = this.context.location.pathname.indexOf('schedule/') > 0 ? 'selected ' : "not-selected";
            var leaderClass = this.context.location.pathname.indexOf('leader') > 0 ? 'selected ' : "not-selected";
            var toggle = s.toggle == undefined ? this.props.params.seasonId == s.id && this.context.location.pathname.indexOf('display/') > 0 : s.toggle;
            seasonNav.push(
                <li className={toggle ? "active dropdown" : "dropdown"} key={s.id}>
                    <a onClick={this.expandSeason(s)} href="#">
                        {s.shortName}
                        <span className={"fa fa-caret-" + (toggle ? "down side-caret" : "left side-caret")}></span>
                    </a>
                    <ul className={"nav nav-third-level collapse" + (toggle ? " selected in" : "")} aria-expanded="true">
                    <li className={standingsClass}>
                        <a onClick={this.goToStandings(s)} href="#">Standings</a>
                    </li>
                    <li className={scheduleClass}>
                        <a onClick={this.goToSchedule(s)} href="#">{'Schedule & Results'}</a>
                    </li>
                    <li className={leaderClass} >
                        <a onClick={this.goToLeader(s)} href="#">Division Leaders</a>
                    </li>

                    </ul>
                </li>
            );
        }.bind(this));

        return (
             <li className={this.state.toggleAdmin ? "selected dropdown " + cls : cls + " dropdown"}>
                <a onClick={this.toggleAdmin} href="#">
                    <i className="fa fa-cogs"></i> Admin
                    <span className={"fa fa-caret-" + (this.state.toggleAdmin ? "down side-caret" : "left side-caret")} ></span>
                </a>
                <ul className={"nav nav-second-level collapse " + (this.state.toggleAdmin ? " selected in"  : "")}>
                    <li>
                        <a onClick={this.goToUsers} href="#">
                            <i className="fa fa-users"></i> Users
                        </a>
                         <a onClick={this.goToTeams} href="#">
                            <i className="fa fa-users"></i> Teams
                        </a>
                    </li>

                    {seasonNav}
                </ul>
            </li>
        );
    }
});

module.exports = AdminNav;