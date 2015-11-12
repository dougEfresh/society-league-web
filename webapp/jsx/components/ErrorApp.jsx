var React = require('react/addons');
var Router = require('react-router') ;
var Link = Router.Link;
var UserContextMixin = require('./../mixins/UserContextMixin.jsx');
var ErrorApp = React.createClass({
    mixins: [UserContextMixin],
    backup: function(e) {
        e.preventDefault();
        this.props.history.pushState(null,'/login')
    },
    render: function () {
        var msg = "";
        if (this.props.location.query.err != undefined) {
            msg = JSON.stringify(JSON.parse(this.props.location.query.err),null,2);
        }
        var errMsg =
            <div className="panel-body">
                <span><b>Unexpected error occurred</b> Please Login again:</span>
                <div>
                  <button onClick={this.backup} type="button" className="btn btn-sm btn-primary btn-responsive ">
                      <b>Login</b>
                  </button>
                </div>
                <p>
                    <pre>{msg}</pre>
                </p>
        </div>;

        return (
        <div id={'error-app'} className="panel panel-danger">
            <div className="panel-heading">
                Error
            </div>
            {this.getUser().admin ? errMsg : "Error"}
        </div>
        );
    }
});

module.exports = ErrorApp;