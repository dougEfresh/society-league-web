var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');


var UserApp = React.createClass({
    mixins: [UserContextMixin, State, Navigation],
    render: function() {
        var header = (
                <div style={{display: 'inline'}}>
                    <Link to='info' params={this.getParams()}>
                        <button className={this.isActive('info') ? 'btn btn-success' : 'btn btn-default'} >
                            <i className="fa fa-info"></i>Profile
                        </button>
                    </Link>
                </div>
        );
        return (
            <div id="user-app">
                {header}
                <RouteHandler />
            </div>
        );
    }
});

module.exports=UserApp;