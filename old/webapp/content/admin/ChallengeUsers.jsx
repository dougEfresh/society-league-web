var React = require('react/addons');
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');
var Handicaps = require('../../lib/Handicap');
var Util = require('../../jsx/util.jsx');

var ChallengeUsers = React.createClass({
    mixins: [UserContextMixin, Router.Navigation, Router.State],
    disable: function(userId) {
        var q = this.getQuery();
        if (q.userId == undefined)
            return true;

        return !(q.userId == userId);
    },
    onClick: function() {
        Util.getData(
            '/api/admin/challenge/modify/' + this.getQuery().userId +'/' + this.getQuery().hc,
            function() {
                DataStore.init();
                this.transitionTo('challengeUsers');
            }.bind(this)
        );
    },
    onSelectHandicap: function(e) {
        var userId = e.target.id.replace('-handicap');
        this.transitionTo('challengeUsers',null,{userId: userId,hc:e.target.value});
    },
    render: function () {
        var users = this.getUsers();
        var query = this.getQuery();
        var challengeUser = [];
        users.forEach(function (u) {
            if (u.isChallenge()) {
                challengeUser.push(u);
            }
        });
        var rows = [];
        var selectHandicaps = [];
        Handicaps.handicaps.forEach(function(h){
            selectHandicaps.push(<option key={h} value={h}>{Handicaps.formatHandicap(h)}</option>);
        });
        challengeUser.forEach(function (u) {
                var rawHc = u.getRawChallengeHandicap();
                if (query.userId == u.userId) {
                    if (query.hc != rawHc) {
                        rawHc = query.hc;
                    }
                }
                rows.push(
                    <tr key={u.id}>
                        <td><button className="btn btn-sm"
                                    disabled={this.disable(u.id)}
                                    onClick={this.onClick}
                                    bsStyle={this.disable(u.id) ? 'primary' : 'success'} >
                            <span className="fa fa-check"></span>Modify
                        </button>
                        </td>
                        <td><UserLink user={u}/></td>
                        <td>
                            <select id={u.id} ref='handicap' onChange={this.onSelectHandicap}
                                  className="form-control"
                                  value={rawHc}
                                  type={'select'}>
                                {selectHandicaps}
                            </select>
                        </td>
                    </tr>)
            }.bind(this)
        );



        return (
            <div className="table-responsive">
                <table className="table table-hover table-condensed">
                    <tr>
                        <th>Modify</th>
                        <th>User</th>
                        <th>Handicap</th>
                    </tr>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        );
    }
});

module.exports = ChallengeUsers;

