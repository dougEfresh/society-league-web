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
    changeUser: function(e) {
        e.preventDefault();
        this.transitionTo('stats',{statsId: e.target.value})
    },
    render: function() {
        if (this.getUserId() == null) {
            return null;
        }
        var users = this.getUsers();
        var challengeUsers = [];
        users.forEach(function(u){
            if (u.isChallenge())
                challengeUsers.push(<option key={u.id} value={u.id}>{u.name}</option>);
        });

        var header = (
            <div className="row">
            <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                <div className="col-lg-6 col-md-6 col-xs-12 no-pad">
                    <select ref='user' onChange={this.changeUser}
                           className="form-control"
                           value={this.getParams().statsId}
                           type={'select'}>
                       {challengeUsers}
                    </select>
                </div>
                <div className="btn-group col-lg-6 col-md-6 col-xs-12 stats-btn">
                    <button className={this.isActive('stats') ? 'btn btn-success btn-responsive' : 'btn btn-default btn-responsive'}>
                        <Link to='stats' params={this.getParams()}>
                            <span className="fa fa-bar-chart"></span>Stats
                        </Link>
                    </button>
                    <button className={this.isActive('history') ? 'btn btn-success btn-responsive' : 'btn btn-default btn-responsive'}>
                        <Link to='history' params={this.getParams()}>
                            <span className="fa fa-history"></span>History
                        </Link>
                    </button>
                </div>
            </div>
            <div className="bot-margin col-lg-2 col-md-2 col-sm-12 col-xs-12">
               <button className="btn btn-primary btn-responsive">
                        <Link id={"request-link-"+ this.getParams().statsId } to="challengeMain" query={{opponent:this.getParams().statsId}}>
                            <span className="glyphicon glyphicon-plus-sign"></span>Challenge
                        </Link>
                </button>
            </div>
            </div>
        );
        //<h3><span className="fa fa-bar-chart"></span>Stats</h3>
        return (
            <div id="scout-app" className="panel panel-default">
                <div className="panel-heading">
                     {header}
                </div>
                <div className="panel-body">
                    <RouteHandler />
                </div>
            </div>
        );
    }
});

module.exports = StatApp;
