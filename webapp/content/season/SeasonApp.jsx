var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var SeasonApp = React.createClass({
    mixins: [SeasonMixin,UserContextMixin,Router.State,Router.Navigation],
    getInitialState: function () {
        return {
            update: Date.now(),
            season: {}
        }
    },
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function() {
        var now = Date.now();
        if (now - this.state.update > 1000*60)
            this.getData();

    },
    getData: function() {
        Util.getData('/api/season/' + this.getParams().seasonId, function(d){
            this.setState({season: d});
        }.bind(this));
    },
    render: function() {
        var user = this.getUser();
        if (!this.state.season.name) {
            return null;
        }
        var display = 'inline';
        var header = (
                <div className="btn-group bot-margin">
                    <div id={display == 'none' ? 'season-standings-link-hidden' : 'season-standings-link'}
                         style={{display:display}}>
                        <Link to='seasonStandings' params={this.getParams()}>
                            <button className={this.isActive('seasonStandings') ? 'btn btn-success' : 'btn btn-default'}>
                            <span className="fa fa-trophy"></span><span className="main-item">Standings</span>

                    </button>
                        </Link>
                    </div>
                    <Link to='seasonLeaders' params={this.getParams()}>
                    <button className={this.isActive('seasonLeaders') ? 'btn btn-success' : 'btn btn-default'} >

                            <span className="fa  fa-list-ol"></span><span className="main-item">Leaders</span>

                    </button>
                    </Link>
                    <Link to='seasonResults' params={this.getParams()}>
                    <button className={this.isActive('seasonResults') ? 'btn btn-success' : 'btn btn-default'} >
                            <span className="fa  fa-history"></span><span className="main-item">Matches</span>
                    </button>
                    </Link>
                </div>
        );
        return (
            <div id={'season-app'} className="panel panel-default">
                    <div className="panel-heading">
                        <h3>{this.state.season.displayName}</h3>
                        {header}
                    </div>
                    <div className="panel-body">
                        <RouteHandler />
                    </div>
            </div>
        );
    }
});

module.exports = SeasonApp;

