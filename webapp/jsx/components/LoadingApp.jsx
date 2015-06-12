var React = require('react/addons');
var BootStrap = require('react-bootstrap');
var Panel = BootStrap.Panel;
var LoadingApp = React.createClass({
    render: function () {
        return (<div id="loadingApp">
             <div class="form-group col-lg-12">
                        <div class="text-center">
                            <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
                        </div>
                    </div>
        </div>);
    }
});

module.exports = LoadingApp;