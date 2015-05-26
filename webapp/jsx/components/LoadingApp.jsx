var React = require('react/addons');
var BootStrap = require('react-bootstrap');
var Panel = BootStrap.Panel;
var LoadingApp = React.createClass({
    render: function () {
        return (<div id="loadingApp">
            <Panel>
                <h1>Loading....please wait</h1>
            </Panel>
        </div>);
    }
});

module.exports = LoadingApp;