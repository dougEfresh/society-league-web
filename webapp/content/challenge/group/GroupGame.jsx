var React = require('react/addons');
var Router = require('react-router');
var BallIcon = require('../../../jsx/components/BallIcon.jsx');
var DivisionType = require('../../../lib/DivisionType');
var Handicap = require('../../../lib/Handicap');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');

var GroupGame = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
    onSelectGame: function() {
        var q = this.getQuery();
        q.id = this.props.challengeGroup.getId();
        q.selectedGame =  React.findDOMNode(this.refs.game).value;
        this.transitionTo(this.getPathname(),this.getParams(),q);
    },
    renderNoSelect: function() {
        /*
        var games = [];

        if (this.props.challengeGroup.selectedGames != undefined) {
            this.props.challengeGroup.selectedGames.forEach(function (g) {
                games.push(<div key={g}><BallIcon type={g} /></div>);
            }.bind(this));
        } else {
             this.props.challengeGroup.games.forEach(function (g) {
                 games.push(<div key={g}><BallIcon type={g} /></div>);
            }.bind(this));
        }
        return (<div>{games}</div>);
        */
        return <BallIcon type={DivisionType.NINE_BALL_CHALLENGE} />
    },
    getOpponent: function() {
        if (this.getUser().id == this.props.challengeGroup.opponent.id) {
            return this.props.challengeGroup.challenger
        }
        return this.props.challengeGroup.opponent;
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
                  <div className="form-field form-group">
                            <div className="form-group">
            <select ref='game'
                   onChange={this.onSelectGame}
                   value={this.getQuery().selectedGame}
                    className="form-control"
                   type='select' >{games}
            </select>
                            </div>
                  </div>
        </form>);
    },
    render: function() {
        //if (this.props.noSelect)
        var u = this.getUser();
        var opponent = this.getUser(this.props.challengeGroup.opponent);
        //return (<div>{this.renderNoSelect()}</div>);
        return <span>{Handicap.race(u.getRawChallengeHandicap(),this.getOpponent().getRawChallengeHandicap())}</span>
        //return (<div>{this.renderSelectOptions()}</div>);
    }
});


module.exports = GroupGame;
