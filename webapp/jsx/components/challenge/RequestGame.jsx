var React = require('react/addons');
var RequestMixin = require('./RequestMixin.jsx');
var Bootstrap = require('react-bootstrap')
    ,Button = Bootstrap.Button
    ,Panel = Bootstrap.Panel
    ,ListGroup = Bootstrap.ListGroup
    ,ListGroupItem = Bootstrap.ListGroupItem
    ,Table =  Bootstrap.Table
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,Input = Bootstrap.Input
    ,Label = Bootstrap.Label;

var RequestGame = React.createClass({
    mixins: [RequestMixin],
    onSelectGame: function() {

    },
    renderNoSelect: function() {
        var games = [];
        this.props.request.games.forEach(function(g) {
            games.push(<div key={g}>{this.getBall(g)}</div>);
        }.bind(this));
        return (<div>{games}</div>);
    },
    renderSelectOptions: function(){
        if (this.props.request.games.length == 1) {
            return (<div>{this.getBall(this.props.request.selectedGame)}</div>);
        }
        var games = [];
        this.props.request.games.forEach(function(g) {
            games.push(<option key={g} value={g}>{this.getBall(g)}</option>);
        }.bind(this));
        return (<Input onChange={this.onSelectGame} value={this.props.request.selectedGame} type='select' >{games}</Input>);
    },
    render: function() {
        if (this.noSelect)
            return (<div>{this.renderNoSelect()}</div>);

        return (<div>{this.renderSelectOptions()}</div>);
    }
});


module.exports = RequestGame;