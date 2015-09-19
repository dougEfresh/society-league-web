var React = require('react/addons');
var LoadingApp = React.createClass({
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

module.exports = LoadingApp;
