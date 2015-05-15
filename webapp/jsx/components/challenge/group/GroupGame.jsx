var React = require('react/addons');
var GroupMixin = require('./GroupListMixin.jsx');
var ChallengeActions = require('../../../actions/ChallengeActions.jsx');
var BallIcon = require('../../../components/BallIcon.jsx');

var GroupGame = React.createClass({
    mixins: [GroupMixin],
    onSelectGame: function() {
        ChallengeActions.selectChallengeGroupGame(
            this.props.challengeGroup,
            this.refs.game.getValue(),
            this.getUserId(),
            this.props.type
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
            return (<div><BallIcon type={g} /></div>);
        }
        var games = [];
        games.push(<option key={0} value={0}>{'choose'}</option>);
        this.props.challengeGroup.games.forEach(function(g) {
            games.push(<option key={g} value={g}><BallIcon type={g}/></option>);
        }.bind(this));
        return (<Input ref='game' onChange={this.onSelectGame} value={this.props.challengeGroup.selectedGame} type='select' >{games}</Input>);
    },
    render: function() {
        if (this.props.noSelect)
            return (<div>{this.renderNoSelect()}</div>);

        return (<div>{this.renderSelectOptions()}</div>);
    }
});


module.exports = GroupGame;