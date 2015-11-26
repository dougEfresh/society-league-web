var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link
    , History = Router.History;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamStandings = require('../team/TeamStandings.jsx');
var TeamChart = require('../team/TeamChart.jsx');
var Util = require('../../jsx/util.jsx');
var firstBy = require('../../lib/FirstBy.js');
var SeasonStandings = require('../season/SeasonStandings.jsx');
var SeasonMatches = require('../season/SeasonMatches.jsx');
var SeasonLeaders = require('../season/SeasonLeaders.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var Handicap = require('../../lib/Handicap');

var UserDisplay = React.createClass({
    getInitialState: function() {
        return {
            hide: true,
            stats: null,
            results: [],
            toggleUser : true,
            loading: false
        }
    },
    componentDidMount: function() {
        if (this.props.params.userId) {
            this.setState({loading: true, hide: false});
            this.getData(this.props);
        }
    },
    getData: function(props) {
        if (props.params.userId) {
            Util.getSomeData({
                    url: '/api/playerresult/user/' + props.params.userId + '/'+ props.params.seasonId,
                    callback: function(d,t) {
                        if (props.onUserClick) {
                            d.results.forEach(function(m) {
                                m.opponent.onClick = props.onUserClick(m.opponent);
                            }.bind(this));

                        }
                        if (t < 900) {
                            setTimeout(function() {
                                this.setState({stats: d.stats, results: d.results, loading: false});
                            }.bind(this),500);
                        } else {
                            this.setState({stats: d.stats, results: d.results, loading: false});
                        }
                    }.bind(this),
                    module: 'UserDisplayStats'
                }
            );
        }
    },
    componentWillReceiveProps :function(n) {
        if (n.params.userId == undefined) {
            this.setState({hide: true});
            return;
        }
        if (this.props.params.userId == undefined || n.params.userId != this.props.params.userId) {
            this.setState({loading: true, hide: false, stats: null, results: []});
            this.getData(n);
        }
    },
    toggleUser: function(e) {
        e.preventDefault();
        this.setState({toggleUser: !this.state.toggleUser});
    },
    render: function() {
        if (this.state.hide) {
            return null;
        }
        var header = <div className="col-xs-10 col-md-11 p-title">Loading...</div>;
        var body = <div style={{height: 200}} className="text-center loading">
            <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
        </div>;
        if (!this.state.loading) {
            header =
                <div>
                    <div className="col-xs-5 col-md-9 p-title">
                        {this.state.stats.user.shortName + ' (' + Handicap.formatHandicap(this.state.stats.handicap) + ')'}
                    </div>
                    <div className="col-xs-2 col-md-1 p-title">
                        <span className="float-right">{'W:' + this.state.stats.wins}</span>
                    </div>
                    <div className="col-xs-2 col-md-1 p-title">
                        <span className="float-right">{'L:' + this.state.stats.loses}</span>
                    </div>
                    <div className="float-right col-xs-2 col-md-1 caret-title">
                        <span className={"float-right fa fa-caret-" + (this.state.toggleUser ? "down" : "left")}></span>
                    </div>
            </div>
            body = <UserResults params={this.props.params} onUserClick={this.props.onUserClick} results={this.state.results} user={this.state.stats.user} season={this.state.stats.season} />
        }
        return (
            <div className={"row"} >
                <div className={"col-xs-12 col-md-9 "} >
                    <div className={"panel panel-default panel-user-results "}>
                        <a href="#" onClick={this.toggleUser} >
                            <div className={"panel-heading" + (this.state.toggleUser ? "" : " panel-closed")}>
                                <div className={"row panel-title"}>
                                    {header}
                                </div>
                            </div>
                        </a>
                        <div className={"panel-body panel-animate" + (this.state.toggleUser ? "": " hide")}>
                            {body}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = UserDisplay;