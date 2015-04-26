var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;

var SocietyNav = require('./SocietyNav.jsx');
var UserStore = require('../../stores/UserStore.jsx');
var DataFactory = require('../../DataFactoryMixin.jsx');

var NavApp = React.createClass({
    mixins: [DataFactory],
    render: function() {
        return (
            <div>
                <SocietyNav  />
            </div>
        )
    }
});

module.exports = NavApp;