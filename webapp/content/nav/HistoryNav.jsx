var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var HistoryNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            toggleSeason: false,
            season: []
        }
    },
    componentDidMount: function () {
        this.getData();
    },
    getData: function() {
        Util.getSomeData({
            url: '/api/season/',
            callback: function(d){ this.setState({season: d})}.bind(this),
            module: 'NavApp',
            router: this.props.history
        });
    },
    componentWillReceiveProps: function(nextProps) {
        //this.getData();
    },
    goToLeader: function(s){
        return function(e){
            this.props.toggleSide(e);
            this.setState({toggleSide: false});
            e.preventDefault();
            this.props.history.pushState(null,'/app/season/' + s.id + '/leaders');
        }.bind(this)
    },
    toggleSeason: function(e){
        e.preventDefault();
        this.setState({toggleSeason: !this.state.toggleSeason});
    },
    render: function() {
        var teamNav =  [];
        var seasons = [];
        if (false) {
            this.state.season.forEach(function(s) {
                if (!s.active && !s.challenge)
                    seasons.push(s);
            })

        } else {
            this.getUser().handicapSeasons.sort(function(a,b) {
                return b.season.startDate.localeCompare(a.season.startDate);
            });
            this.getUser().handicapSeasons.forEach(function(s) {
                if (!s.season.active && !s.season.challenge)
                    seasons.push(s.season);
            })
        }

        seasons.forEach(function(s) {
            var toggle = s.toggle == undefined ? this.props.params.seasonId == s.id : s.toggle;
            teamNav.push(
                <li className={toggle ? "active dropdown" : "dropdown"} key={s.id}>
                    <a onClick={this.goToLeader(s)} href="#">
                        {s.displayName}
                    </a>
                </li>
            );
        }.bind(this));
        var seasonCls = "";
        return(
            <li className={this.state.toggleSeason ? "selected dropdown " + seasonCls : seasonCls + " dropdown"}>
                <a onClick={this.toggleSeason} href="#">
                    <i className="fa fa-fw fa-users"></i>History
                    <span className={"fa fa-caret-" + (this.state.toggleSeason ? "down side-caret" : "left side-caret")} ></span>
                </a>
                <ul className={"nav nav-second-level collapse " + (this.state.toggleSeason ? " selected in"  : "")}>
                    {teamNav}
                </ul>
            </li>
        );

    }
});

module.exports = HistoryNav;