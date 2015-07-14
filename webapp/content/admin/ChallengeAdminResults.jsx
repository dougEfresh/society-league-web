var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var Util = require('../../jsx/util.jsx');

var ChallengeResults = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
    onSelectChallengerRacks: function(e) {
        var id = e.target.id.replace('challenger-',"");
        var racks = e.target.value;
        this.transitionTo('challengeAdminResults', null,
            {id: id, chracks: racks, opracks: this.getQuery().opracks});
    },
     onSelectOpponentRacks: function(e) {
         var id = e.target.id.replace('opponent-',"");
         var racks = e.target.value;
         this.transitionTo('challengeAdminResults', null,
             {id: id, opracks: racks, chracks: this.getQuery().chracks});
     },
    onClick: function() {
        var id = this.getQuery().id;
        var chRacks = this.getQuery().chracks;
        var opRacks = this.getQuery().opracks;
        Util.getData('/api/admin/challenge/result/' + id +'/' + chRacks + '/' + opRacks,
            function() {
                DataStore.init();
                this.transitionTo('challengeAdminResults');
            }.bind(this));
    },
    disable: function(id) {
        if (parseInt(this.getQuery().id) == id) {
            return !(this.getQuery().chracks != undefined || this.getQuery().opracks != undefined);
        }
        return true;
    },
    render: function() {
        var challenges = DataStore.getChallenges();
        var accepted = [];
        challenges.forEach(function(c){
            if(c.status == 'ACCEPTED') {
                accepted.push(c);
            }
        }.bind(this));
        var acceptedRows = [];
        accepted = accepted.sort(function(a,b) {
            if (a.slot && b.slot)
                return a.slot.date.localeCompare(b.slot.date);
            return 0;
        }.bind(this));
        var racks = [];
        for(var i=0; i < 12; i++) {
            racks.push(<option key={i} value={i}>{i}</option>)
        }

        accepted.forEach(function(c) {
            var chRacks = this.getQuery().chracks;
            var opRacks = this.getQuery().opracks;
            if (c.id != this.getQuery().id) {
                chRacks = 0;
                opRacks = 0;
                if (c.teamMatch) {
                    var cResult = c.challenger.getResult(c.teamMatch.id);
                    if (cResult) {
                        chRacks = cResult.getRacks(c.challenger);
                    }
                    var oResult = c.opponent.getResult(c.teamMatch.id);
                    if (oResult) {
                        opRacks = oResult.getRacks(c.opponent);
                    }
                }
            }

            acceptedRows.push(
                <tr key={c.id}>
                <td><button className="btn btn-sm"
                                    disabled={this.disable(c.id)}
                                    onClick={this.onClick}
                                    bsStyle={this.disable(c.id) ? 'primary' : 'success'} >
                            <span className="fa fa-check"></span>Submit
                    </button>
                </td>
                <td><UserLink user={c.challenger} /></td>
                <td><UserLink user={c.opponent} /></td>
                <td>{c.slot.getFullDate()} </td>
                <td>
                    <select id={'challenger-' + c.id} ref='handicap'
                            onChange={this.onSelectChallengerRacks}
                            className="form-control"
                            value={chRacks}
                            type={'select'}>
                        {racks}
                    </select>
                </td>
                 <td>
                    <select id={'opponent-' + c.id} ref='handicap'
                            onChange={this.onSelectOpponentRacks}
                            className="form-control"
                            value={opRacks}
                            type={'select'}>
                        {racks}
                    </select>
                </td>
            </tr>)
        }.bind(this));

        return (
            <div>
                <div className="table-responsive">
                    <table className="table table-hover table-condensed">
                        <tr>
                            <th></th>
                            <th>Challenger</th>
                            <th>Opponent</th>
                            <th>Time</th>
                            <th>Challenger Racks</th>
                            <th>Opponent Racks</th>
                        </tr>
                        <tbody>
                        {acceptedRows}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
});

module.exports = ChallengeResults;