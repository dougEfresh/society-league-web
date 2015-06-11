var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var Bootstrap = require('react-bootstrap')
    ,Panel = Bootstrap.Panel
    ,Badge = Bootstrap.Badge
    ,Button = Bootstrap.Button;

var DataStore= require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');


var UserApp = React.createClass({
    mixins: [UserContextMixin, State, Navigation],
    render: function() {
        var header = (
                <div className="btn-group">
                    <Button bsStyle={this.isActive('info') ? 'success' : 'default'} responsize>
                        <Link to='info' params={this.getParams()}>
                            <span className="fa fa-info"></span>Info
                         </Link>
                    </Button>
               
                    <Button bsStyle={this.isActive('reset') ? 'success' : 'default'} responsize>
                        <Link to='reset' query={{changePassword: true}}>
                            <span className="fa fa-user"></span>Change Password
                        </Link>
                    </Button>
                 
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