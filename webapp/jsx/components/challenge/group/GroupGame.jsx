var React = require('react/addons');
var GroupMixin = require('./GroupListMixin.jsx');
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

var ChallengeActions = require('../../../actions/ChallengeActions.jsx');

var GroupGame = React.createClass({
    mixins: [GroupMixin],
    onSelectGame: function() {
        ChallengeActions.selectChallengeGroupGame(
            this.props.challengeGroup,
            this.refs.game.getValue()
        );
    },
    renderNoSelect: function() {
        var games = [];
        this.props.challengeGroup.games.forEach(function(g) {
            games.push(<div key={g}>{this.getBall(g)}</div>);
        }.bind(this));
        return (<div>{games}</div>);
    },
    renderSelectOptions: function(){
        if (this.props.challengeGroup.games.length == 1) {
            return (<div>{this.getBall(this.props.challengeGroup.games[0])}</div>);
        }
        var games = [];
        games.push(<option key={0} value={0}>{'choose'}</option>);
        this.props.challengeGroup.games.forEach(function(g) {
            games.push(<option key={g} value={g}>{this.getBall(g)}</option>);
        }.bind(this));
        return (<Input ref='game'onChange={this.onSelectGame} value={this.props.challengeGroup.selectedGame} type='select' >{games}</Input>);
    },
    render: function() {
        if (this.props.noSelect)
            return (<div>{this.renderNoSelect()}</div>);

        return (<div>{this.renderSelectOptions()}</div>);
    }
});


module.exports = GroupGame;