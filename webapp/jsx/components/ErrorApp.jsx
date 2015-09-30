var React = require('react/addons');
var Router = require('react-router') ;
var Link = Router.Link;
var UserContextMixin = require('./../mixins/UserContextMixin.jsx');
var ErrorApp = React.createClass({
    mixins: [UserContextMixin],
    render: function () {
        var errMsg =
            <div className="panel-body">
                <span>Unexpected error occurred</span>
                <span>Click <Link to='/login' >here </Link> to login again</span>
                <pre>{JSON.stringify(this.props.location.query,null,2)}</pre>
        </div>;

        return (
        <div id={'error-app'} className="panel panel-danger">
            <div className="panel-heading">
                Error
            </div>
            {errMsg}
        </div>
        );
    }
});

module.exports = ErrorApp;