var React = require('react/addons');
var Router = require('react-router');
var BallIcon = require('../../../jsx/components/BallIcon.jsx');

var GroupGame = React.createClass({
    mixins: [Router.Navigation,Router.State],
    onSelectGame: function() {
        var q = this.getQuery();
        q.id = this.props.challengeGroup.getId();
        q.selectedGame =  React.findDOMNode(this.refs.game).value;
        this.transitionTo(this.getPathname(),this.getParams(),q);
    },
    renderNoSelect: function() {
        var games = [];
        if (this.props.challengeGroup.selectedGames != undefined) {
            this.props.challengeGroup.selectedGames.forEach(function (g) {
                games.push(<div key={g}>{this.getBall(g)}</div>);
            }.bind(this));
        } else {
             this.props.challengeGroup.games.forEach(function (g) {
                games.push(<div key={g}>{this.getBall(g)}</div>);
            }.bind(this));
        }
        return (<div>{games}</div>);
    },
    renderSelectOptions: function(){
        if (this.props.challengeGroup.games != undefined && this.props.challengeGroup.games.length == 1) {
            return (<div><BallIcon type={this.props.challengeGroup.games[0]} /></div>);
        }
        var games = [];
        games.push(<option key={0} value={0}>{'choose'}</option>);
        this.props.challengeGroup.games.forEach(function(g) {
            games.push(<option key={g} value={g}><BallIcon type={g}/></option>);
        }.bind(this));
        return (
            <form id="request-game">
            <input ref='game'
                   onChange={this.onSelectGame}
                   value={this.getQuery().selectedGame}
                   type='select' >{games}
            </input>
        </form>);
    },
    render: function() {
        if (this.props.noSelect)
            return (<div>{this.renderNoSelect()}</div>);

        return (<div>{this.renderSelectOptions()}</div>);
    }
});


module.exports = GroupGame;
