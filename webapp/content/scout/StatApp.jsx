var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,State = Router.State
    ,Link = Router.Link
    ,RouteHandler = Router.RouteHandler;

var StatsDisplay = require('./StatsDisplay.jsx');
var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');

var StatApp = React.createClass({
    mixins: [UserContextMixin,State,Router.Navigation],
    getInitialState: function() {
        return {
            userId: this.getUserId(),
            navView: 'chart'
        }
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    _onChange: function() {
        this.setState({user: this.state.user});
    },
    render: function() {
        if (this.getUserId() == null) {
            return null;
        }
        var header = (
                <div className="btn-group bot-margin">
                    <Link to='stats' params={this.getParams()}>
                        <button className={this.isActive('stats') ? 'btn btn-success' : 'btn btn-default'}>
                            <span className="fa fa-bar-chart"></span>
                            <span className="main-item">Stats</span>&nbsp;
                        </button>
                    </Link>
                    <Link to='history' params={this.getParams()}>
                        <button className={this.isActive('history') ? 'btn btn-success' : 'btn btn-default'}>
                            <span className="fa fa-history"></span><span className="main-item"> History</span>&nbsp;
                        </button>
                    </Link>
                </div>
        );
        //<h3><span className="fa fa-bar-chart"></span>Stats</h3>
        return (
            <div id="scout-app" className="panel panel-default">
                <div className="panel-heading">
                     {header}
                </div>
                <RouteHandler />
            </div>
        );
    }
});

module.exports = StatApp;
