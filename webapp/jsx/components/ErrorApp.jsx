var React = require('react/addons');
var Router = require('react-router') ;
var UserContextMixin = require('./../mixins/UserContextMixin.jsx');

var ErrorApp = React.createClass({
    mixins: [UserContextMixin],
    render: function () {
        return (
            <div className="alert alert-error" role="alert">
                <h3>Error!  Please refresh your browser and try again</h3>
            </div>

        );
    }
});

module.exports = ErrorApp;