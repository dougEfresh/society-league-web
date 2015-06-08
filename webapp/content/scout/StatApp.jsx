var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,PanelGroup = Bootstrap.PanelGroup
    ,Input = Bootstrap.Input
    ,Nav = Bootstrap.Nav
    ,NavItem = Bootstrap.NavItem
    ,Panel = Bootstrap.Panel;
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
                <div style={{display: 'inline'}}>
                    <Link to='stats' params={this.getParams()}>
                        <button className={this.isActive('stats') ? 'btn btn-success' : 'btn btn-default'}>
                            <i className="fa fa-bar-chart"></i><span className="main-item">{ ' Stats'}</span>
                        </button>
                    </Link>
                    <Link to='history' params={this.getParams()}>
                        <button className={this.isActive('history') ? 'btn btn-success' : 'btn btn-default'}>
                            <i className="fa fa-history"></i><span className="main-item">{ ' History'}</span>
                        </button>
                    </Link>
                </div>
        );
        return (
              <div id="scout-app">
                  {header}
                  <RouteHandler />
            </div>
        );
    }
});

module.exports = StatApp;
