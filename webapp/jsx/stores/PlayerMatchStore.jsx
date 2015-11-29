var AppDispatcher = require('../AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Util = require('../util.jsx');
var season = null;
var matches = [];
var members;
var memberOptions;
var React = require('react/addons');
var TeamMatchStore = require('./TeamMatchStore.jsx');

var defaultState = function() {
    matches = [];
    members = null;
    memberOptions = {};
};

var PlayerMatchStore = assign({}, EventEmitter.prototype, {
    init: function(id) {
        defaultState();
        this.emitChange('loading');
          Util.getSomeData({
            url: '/api/playerresult/teammatch/' + id,
            callback: function(d) {
                matches = d;
                this.emitChange('MATCHES')
            }.bind(this)
        });
        Util.getSomeData({
            url: '/api/teammatch/members/' + id,
            callback: function(d) {
                members = d;
                memberOptions.home = [];
                memberOptions.away = [];
                members.home.forEach(function(m){
                    if (m.real)
                        memberOptions.home.push(<option key={m.id} value={m.id}>{m.name}</option> );
                });

                members.away.forEach(function(m){
                    if (m.real)
                        memberOptions.away.push(<option key={m.id} value={m.id}>{m.name}</option> );
                });
                members.home.push({id: '-1', name: '-----'});
                members.away.push({id: '-1', name: '-----'});
                memberOptions.home.push(<option key={'-1'} value={'-1'}>{'----'}</option>);
                memberOptions.away.push(<option key={'-1'} value={'-1'}>{'----'}</option>);
                this.emitChange('MATCHES')
            }.bind(this)
        });
    },
    emitChange: function (type) {
        console.log('Emit Change ' + type);
        this.emit(type);
    },
    addListener: function(type,callback) {
        this.on(type,callback);
    },
    remove: function(type,callback) {
        this.removeListener(type, callback);
    },
    isLoading: function(){
        return matches.length == 0 || members == null;
    },
    getPlayed: function() {
        matches = matches.sort(function(a,b){
            return a.matchDate.localeCompare(b.matchDate);
        });
        return matches;
    },
    getTeamMatch: function() {
        if (matches.length > 0)
            return matches[0].teamMatch;
        return null;
    },
    onChange: function(d,type) {
        return function (e) {
            e.preventDefault();
            this.handleUpdate(d,e.target.value,type);
        }.bind(this)
    },
    getMemberOptions: function() {
        return memberOptions;
    },
    submit: function(e) {
        this.emitChange('loading');
        var data = [];
        matches.forEach(function(d){
            if (d.homeRacks + d.awayRacks <= 0) {
                return;
            }
            var submitData = {};
            submitData.id = d.id;
            submitData.teamMatch = {id : d.teamMatch.id};

            submitData.playerHome = {id: d.playerHome.id};
            if (d.playerHomePartner != null && d.playerHomePartner.id != '-1') {
                submitData.playerHomePartner = {id: d.playerHomePartner.id};
            }
            submitData.homeRacks = d.homeRacks;

            submitData.playerAway = {id: d.playerAway.id};
            submitData.awayRacks = d.awayRacks;
            if (d.playerAwayPartner != null && d.playerAwayPartner.id != '-1') {
                submitData.playerAwayPartner = {id: d.playerAwayPartner.id};
            }
            submitData.matchNumber =  d.matchNumber;
            data.push(submitData);
        });

        Util.postSomeData({
            url: '/api/playerresult/admin/modify',
            data: data,
            callback: function(d) {this.init(matches[0].teamMatch.id) ; TeamMatchStore.init(d[0].season.id);}.bind(this)
        });
    },
    handleUpdate: function(d,newValue,type) {
        console.log('updating '  + type  + ' '+ newValue);
        var m = null;
        matches.forEach(function(r) {
            if (r.id == d.id)
                m = r;
        });
        var tm = d.teamMatch;
        switch (type) {
            case 'matchNumber':
                m.matchNumber = newValue;
                break;
            case 'homeRacks':
                if (!tm.nine && !tm.challenge) {
                    m.homeRacks = newValue >= 1 ?  1 : 0;
                    m.awayRacks = newValue == 1 ? 0 : 1;
                } else {
                    m.homeRacks = newValue;
                }
                break;
            case 'awayRacks':
                if (!tm.nine && !tm.challenge) {
                    m.awayRacks = newValue >=  1 ? 1 : 0;
                    m.homeRacks = newValue == 1 ? 0 : 1;
                }
                else {
                    m.awayRacks = newValue;
                }
                break;
            case 'setHomeWins':
                m.setHomeWins = newValue;
                break;
            case 'setAwayWins':
                m.setAwayWins = newValue;
                break;
            case 'playerHome':
                members.home.forEach(function(t){
                    if (t.id == newValue) {
                        m.playerHome = t;
                    }
                });
                break;
            case 'playerHomePartner':
                members.home.forEach(function(t){
                    if (t.id == newValue) {
                        m.playerHomePartner = t;
                    }
                });
                break;
            case 'playerAway':
                members.away.forEach(function(t){
                    if (t.id == newValue) {
                        m.playerAway = t;
                    }
                });
                break;
            case 'playerAwayPartner':
                members.away.forEach(function(t){
                    if (t.id == newValue) {
                        m.playerAwayPartner = t;
                        console.log('Away Partner :' +  m.playerAwayPartner.name );
                    }
                });

                break;
        }
        this.emitChange('MATCHES');
    },
    addNew : function() {
        this.emitChange('loading');
        Util.getSomeData({
            url: '/api/playerresult/' + this.getTeamMatch().id + '/add',
            callback: function(d) {
                this.init(this.getTeamMatch().id);
            }.bind(this),
            module: 'TeamMatchAdd'
        });
    },
    handleDelete: function(d) {
        return function(e) {
            e.preventDefault();
            this.emitChange('loading');
            Util.getSomeData({
                url: '/api/playerresult/admin/delete/' + d.id,
                callback: function(data) {
                    this.init(d.teamMatch.id);
                    TeamMatchStore.init(this.getTeamMatch().season.id);
                }.bind(this),
                module: 'TeamMatchDelete'
            });
        }.bind(this);
    }
});

AppDispatcher.register(function(action) {
     switch(action.actionType) {
         case 'INIT':
             TeamMatchStore.init(action.seasonId);
             break;
         case 'CHECK':
      //       DataStore.checkLogin();
             break;
         case 'CHALLENGE_SIGN_UP':
             break;
         default:
            //console.log('Unknown Action ' + JSON.stringify(action));
     }
});

module.exports = PlayerMatchStore;
