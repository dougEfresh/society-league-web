var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var UserApp = React.createClass({
    mixins: [UserContextMixin, State, Navigation],
    render: function() {
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
                    <RouteHandler />
                </div>
            </div>
        );
    }
});

module.exports=UserApp;