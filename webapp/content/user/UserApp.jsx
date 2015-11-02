var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var UserApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            update: Date.now(),
        }
    },
    getData: function() {
        Util.getData('/api/user/' + this.getUser().id , function(d){
            this.setState({stats: d});
        }.bind(this));
    },
    componentDidMount: function () {

    },
    componentWillReceiveProps: function (o, n) {
    },

    render: function() {
        return (
            <div id="user-profile-app">
                <h3>Coming Soon</h3>
            </div>
        );
    }
});

module.exports=UserApp;