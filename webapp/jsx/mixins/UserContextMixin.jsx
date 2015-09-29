var React = require('react/addons');
var Router = require('react-router');
var DataStore = require('./../stores/DataStore.jsx');

var UserContextMixin = {
    getUser: function() {
        return DataStore.getUser();
    },

    validUser: function() {
        return DataStore.getUser().id != undefined && DataStore.getUser().id.length > 2;
    }
};

module.exports = UserContextMixin;