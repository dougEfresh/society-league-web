var React = require('react/addons');
var Router = require('react-router');
var DataStore = require('./../stores/DataStore.jsx');

var UserContextMixin = {
    getUser: function() {
        return DataStore.getUser();
    }
};

module.exports = UserContextMixin;