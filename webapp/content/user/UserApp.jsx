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
                <div style={{display: 'inline'}}>
                    <Link to='info' params={this.getParams()}>
                        <Button bsStyle={this.isActive('info') ? 'success' : 'default'} responsize>
                            <i className="fa fa-info"></i><span className="main-item">{ ' Info'}</span>
                        </Button>
                    </Link>
                    <Link to='password' params={this.getParams()}>
                        <Button bsStyle={this.isActive('password') ? 'success' : 'default'} responsize>
                            <i className="fa fa-user"></i><span className="main-item">{ ' Change Password'}</span>
                        </Button>
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