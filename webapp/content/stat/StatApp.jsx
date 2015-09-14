var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link
    , History = Router.History;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var StatApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function() {
        return {
            update: Date.now(),
            users: []
        }
    },
    getData: function() {
        Util.getData('/api/user/season/user/' + this.getUser().id, function(d){
            this.setState({users: d});
        }.bind(this),null,'StatApp');
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if (now - this.state.update > 1000*60)
            this.getData();
    },
    changeUser: function(e) {
        e.preventDefault();
        if (this.isActive('stats')) {
            this.transitionTo('stats', {statsId: e.target.value});
            return;
        }

        this.transitionTo('history',{statsId: e.target.value})

    },
    render: function() {
        var users = this.state.users;
        if (users.length == 0) {
            return null;
        }

        var options = [];
        users.forEach(function(u){
            options.push(<option key={u.id} value={u.id}>{u.name}</option>);
        });

        var header = (
            <div className="row">
                <div className="col-lg-10 col-md-10 col-sm-12 col-xs-12">
                    <div className="col-lg-6 col-md-6 col-xs-12 no-pad">
                        <select ref='user' onChange={this.changeUser}
                                className="form-control"
                                value={this.props.params.statsId}
                                type={'select'}>
                            {options}
                        </select>
                    </div>
                    <div className="btn-group col-lg-6 col-md-6 col-xs-12 stats-btn">
                        <Link to='stats' params={this.props.params}>
                            <button className={this.isActive('stats') ? 'btn btn-success btn-responsive' : 'btn btn-default btn-responsive'}>
                                <span className="fa fa-bar-chart"></span>Stats
                            </button>
                        </Link>
                        <Link to='history' params={this.props.params}>
                            <button className={this.isActive('history') ? 'btn btn-success btn-responsive' : 'btn btn-default btn-responsive'}>
                                <span className="fa fa-history"></span>History
                            </button>
                        </Link>
                    </div>
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
        //
    }
});

module.exports = StatApp;
