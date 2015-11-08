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


var UserDisplay = React.createClass({
    getInitialState: function() {
        return {
            hide: true,
            stats: null,
            toggleUser : true,
            loading: false
        }
    },
    componentDidMount: function() {
        if (this.props.params.userId) {
             this.setState({loading: true, hide: false});
            this.getData(this.props.params);
        }
    },
    getData: function(params) {
        if (params.userId) {
            Util.getSomeData({
                    url: '/api/stat/user/' + params.userId + '/'+ params.seasonId,
                    callback: function(d) {
                        this.setState({stats: d, loading: false});
                    }.bind(this),
                    module: 'UserDisplayStats'
                }
            );
        }
    },
    componentWillReceiveProps :function(n) {
        console.log(JSON.stringify(n.params));
        if (n.params.userId == undefined) {
            this.setState({hide: true});
            return;
        }

        if (this.props.params.userId == undefined || n.params.userId != this.props.params.userId) {
            this.setState({loading: true, hide: false, stats: null});
            this.getData(n.params);
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
        if (this.state.loading) {
            return (
                <div className="row" >
                    <div className={"col-xs-12 col-md-6"} >
                        <div className={"panel panel-default panel-user-results "}>
                            <div className={"panel-heading"}>
                                <span> Loading .... </span>
                            </div>
                            <div className="panel-body">
                                <div style={{height: 200}} className="text-center loading">
                                    <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div className={"row"} >
                <div className={"col-xs-12 col-md-6 "} >
                    <div className={"panel panel-default panel-user-results "}>
                        <a href="#" onClick={this.toggleUser} >
                            <div className={"panel-heading" + (this.state.toggleUser ? "" : " panel-closed")}>
                                <div className={"row panel-title"}>
                                    <div className="col-xs-10 col-md-11 p-title">
                                        User
                                    </div>
                                    <div className="col-xs-2 col-md-1 caret-title ">
                                        <span className={"fa fa-caret-" + (this.state.toggleUser ? "down" : "left")}></span>
                                    </div>
                                </div>
                            </div>
                        </a>
                        <div className={"panel-body panel-animate" + (this.state.toggleUser ? "": " hide")}>
                            <UserResults onUserClick={this.changeUser} user={this.state.stats.user} season={this.state.stats.season} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = UserDisplay;