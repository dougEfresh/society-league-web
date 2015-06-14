var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , Link = Router.Link;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var StatsMixin = require('../../jsx/mixins/StatsMixin.jsx');

var SeasonApp = React.createClass({
    mixins: [SeasonMixin,UserContextMixin,StatsMixin,Router.State,Router.Navigation],
    getInitialState: function () {
        return {
            user: this.getUser(),
            seasonId: this.getParams().seasonId
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
    componentWillReceiveProps: function() {
        this.setState({seasonId: this.getParams().seasonId});
    },
    _onChange: function() {
        console.log('onchange');
        this.setState({user: this.getUser()});
    },
    render: function() {
        if (this.getUserId() == 0) {
            return null;
        }
        var season = this.getSeason(this.getParams().seasonId);
        var display = season.isChallenge() ? 'none' : 'inline';
        var header = (
                <div className="btn-group bot-margin">
                    <div id={display == 'none' ? 'season-standings-link-hidden' : 'season-standings-link'}
                         style={{display:display}}>
                    
                    <button className={this.isActive('seasonStandings') ? 'btn btn-success' : 'btn btn-default'}>
                        <Link to='seasonStandings' params={this.getParams()}>
                            <i className="fa fa-trophy"></i><span className="main-item">{ ' Standings'}</span>
                        </Link>
                    </button>
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
              <div id="season-app">
                  <h3>{season.getDisplayName()}</h3>
                  {header}
                  <RouteHandler />
            </div>
        );
    }
});

module.exports = SeasonApp;

