var React = require('react/addons');
var Router = require('react-router') ;
var UserContextMixin = require('./../mixins/UserContextMixin.jsx');
//<pre>{JSON.stringify(JSON.parse(this.props.location.query),null,2)}</pre>
var ErrorApp = React.createClass({
    mixins: [UserContextMixin],
    render: function () {
        return (
        <div id={'error-app'} className="panel panel-danger">
            <div className="panel-heading">
                Error
            </div>
            <div className="panel-body">
                <pre>{JSON.stringify(this.props.location.query,null,2)}</pre>
            </div>
        </div>
        );
    }
});

module.exports = ErrorApp;