var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var TeamLink = require('../../../webapp/jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var Handicap = require('../../lib/Handicap');
var SeasonLeaders = require('./SeasonLeaders.jsx');

var SeasonApp = React.createClass({
    mixins: [UserContextMixin],
    getDefaultProps: function() {
        return {limit: 100}
    },
    getInitialState: function() {
        return {
            season: null,
            selectedUser: null,
            toggleLeaders: true
        }
    },
    getSeasonData: function(seasonId) {
        var cb = function (d) {
                this.setState({season: d});
            }.bind(this);
            Util.getSomeData({
                url: '/api/season/' + seasonId,
                callback: cb,
                module: 'SeasonApp',
                router: this.props.history
            })
    },
    getUserData: function(userId) {
        if (userId)
          Util.getSomeData({
                url: '/api/stat/user/' + userId +'/' + this.props.params.seasonId,
                callback: function(d) {this.setState({selectedUser : d, toggleLeaders: false})}.bind(this),
                module: 'SeasonApp',
                router: this.props.history
          })
    },
    componentDidMount: function () {
        this.getSeasonData(this.props.params.seasonId);
        this.getUserData(this.props.params.userId);
    },
    componentWillReceiveProps: function(n) {
        if (n.params.seasonId != this.props.params.seasonId) {
            this.getSeasonData(n.params.seasonId);
        }
        if (n.params.userId != undefined && n.params.userId != this.props.params.userId) {
            this.getUserData(n.params.userId);
        }
        if (n.params.userId == undefined) {
            this.setState({selectedUser: null, toggleLeaders: true});
        }
    },
    toggleHeading: function(e) {
        e.preventDefault();
        this.setState({toggleLeaders: !this.state.toggleLeaders});
    },
    changeUser: function(u) {
        return function(e){
            e.preventDefault();
            this.state.toggleLeaders = false;
            this.props.history.pushState(null,'/app/season/' + this.props.params.seasonId + '/leaders/' + u.id)
        }.bind(this)
    },
    render: function() {
        if (this.state.season == null) {
            return null;
        }
        var userHeader = null;
        if (this.state.selectedUser != null) {
            userHeader = this.state.selectedUser.user.firstName ; //+ "W:" + this.state.selectedUser.wins +  "L:" + this.state.selectedUser.loses;
        }
        return (
            <div id="season-leaders">
                <div className="row">
                <div className="col-xs-12 col-md-6">
                    <div className="panel panel-default panel-leaders">
                        <a onClick={this.toggleHeading} href='#'>
                            <div className={"panel-heading" +(this.state.toggleLeaders ? "" : " panel-closed")}>
                                <div className="row panel-title">
                                    <div className="col-xs-10 col-md-11 p-title">
                                        {this.state.season.shortName  +' Leaders'}
                                    </div>
                                    <div className="col-xs-2 col-md-1 caret-title">
                                        <span className={"fa fa-caret-" + (this.state.toggleLeaders ? "down" : "left")}></span>
                                    </div>
                                </div>
                            </div>
                            </a>
                                <div className={"panel-body" + (this.state.toggleLeaders ? "" : " hide")} >
                                    <SeasonLeaders onUserClick={this.changeUser} params={this.props.params}/>
                                </div>
                    </div>
                </div>
                </div>
            <div className="row">
                <div className="col-xs-12 col-md-6">
                    <div className={"panel panel-default panel-results" + (this.state.selectedUser != null ? "" : " hide")} >
                        <a onClick={this.toggleHeading} href='#'>
                            <div className="panel-heading" role="tab" id="headingOne">
                                <div className="row panel-title">
                                    <div className="col-xs-10 col-md-11 p-title">
                                        {userHeader}
                                    </div>
                                    <div className="col-xs-2 col-md-1 caret-title">
                                        <span className={"fa fa-caret-" + (this.state.selectedUser != null ? "down" : "left")}></span>
                                    </div>
                                </div>
                            </div>
                        </a>
                        <div className="panel-body">
                            <UserResults onUserClick={this.changeUser} user={this.state.selectedUser != null ? this.state.selectedUser.user : null} season={this.state.season} />
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
});

module.exports = SeasonApp;



