var React = require('react/addons');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Input = Bootstrap.Input
    ,Panel = Bootstrap.Panel
    ,Label = Bootstrap.Label;

var DataFactory = require('./../DataFactoryMixin.jsx');

var ErrorApp = React.createClass({
    mixins: [DataFactory],
    render: function () {
        return (
            <Panel header={'Error'} >
                <h2>ERROR</h2>
            </Panel>
        );
    }
});

module.exports = ErrorApp;