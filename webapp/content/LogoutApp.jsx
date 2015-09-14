var React = require('react/addons');
var Router = require('react-router');
var History = Router.History;
var Util = require('../jsx/util.jsx');

var LogoutApp = React.createClass({
    mixins: [History],
    componentDidMount: function () {
           $.ajax({
            url: '/api/logout',
            success: function (d) {
                this.history.pushState(null, '/login');
            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({error: true});
                console.error('logout', status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div id="loadingApp">
             <div className="form-group col-lg-12">
                        <div className="text-center">
                            <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
                        </div>
             </div>
        </div>);
    }
});

module.exports = LogoutApp;
