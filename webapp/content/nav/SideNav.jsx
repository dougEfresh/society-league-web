var React = require('react/addons');
var ReactRouter = require('react-router');
var History = ReactRouter.History;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var LoginApp = require('../login/LoginApp.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var TeamNav = require('./TeamNav.jsx');
var AdminNav = require('./AdminNav.jsx');
var SeasonNav = require('./SeasonNav.jsx');
var HomeNav = require('./HomeNav.jsx');
var StatNav = require('./StatNav.jsx');
var ChallengeNav = require('./ChallengeNav.jsx');
var HomeApp = require('../home/HomeApp.jsx');
var Util = require('../../jsx/util.jsx');


var SideNav = React.createClass({
    mixins: [UserContextMixin, History],

    render: function() {
    }
});

module.exports =  SideNav;