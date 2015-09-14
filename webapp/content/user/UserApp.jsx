var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var UserApp = React.createClass({
    mixins: [UserContextMixin, State, Navigation],
    getInitialState: function() {
        return {
            update: Date.now(),
            user: {id: "0"}
        }
    },
    getData: function() {
        Util.getData('/api/user/' + this.getUser().id , function(d){
            this.setState({stats: d});
        }.bind(this));
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function (o, n) {
        var now = Date.now();
        if ( now - this.state.update > 1000*60)
            this.getData();
        this.getData();
    },

    render: function() {
        if (this.state.user.id == "0") {
            return null;
        }
        var header = (
        <div className="btn-group">
            <button className={this.isActive('info') ? 'btn btn-default' : 'btn btn-default'} responsize>
                <Link to='info' params={this.getParams()}>
                    <span className="fa fa-info"></span>Profile
                </Link>
            </button>
        </div>
        );
        return (
            <div id="user-app" className="panel panel-default">
                <div className="panel-heading">
                    {header}
                </div>
                <div className="panel-body">
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports=UserApp;