var AppDispatcher = require('../AppDispatcher.jsx');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Util = require('../util.jsx');
var season = null;
var matches;
var teams;
var teamOptions;
var React = require('react/addons');

var defaultState = function() {
    matches = null;
    teams = [];
    teamOptions = [];
};

var TeamMatchStore = assign({}, EventEmitter.prototype, {
    init: function(seasonId) {
        defaultState();
        this.emitChange('loading');
        Util.getSomeData({
            url: '/api/teammatch/season/' + seasonId  + '/all',
            callback: function (d) {
                matches = d;
                this.emitChange('loading');
                this.emitChange('MATCHES');
            }.bind(this),
            module: 'Upcoming'
        });

        Util.getSomeData({
            url: '/api/team/season/' + seasonId,
            callback: function (d) {
                teams = d;
                this.emitChange('loading');
                for (var i = 0; i< teams.length; i++){
                    teamOptions.push(<option key={i} value={teams[i].id}>{teams[i].name}</option>);
                }
            }.bind(this),
            module: 'Teams'
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
        return teams.length == 0 || matches == null;
    },
    getType: function(type) {
        var results = {};
        if (matches == null)
            return results;

        Object.keys(matches).forEach(function(d) {
            matches[d].forEach(function(p) {
                if (p.status != type)
                    return;
                if (!results.hasOwnProperty(d)) {
                    results[d] = [];
                }
                results[d].push(p);
            });
        }.bind(this));
        return results;
    },
    getPending: function() {
        return this.getType('PENDING');
    },
    getPlayed: function() {
        return this.getType('COMPLETE');
    },
    getUpcoming: function() {
        return this.getType('UPCOMING');
    },
    onChange: function(d,type) {
        return function (e) {
            e.preventDefault();
            this.handleUpdate(d,e.target.value,type);
        }.bind(this)
    },
    getTeamsOptions: function() {
        return teamOptions;
    },
    handleUpdate: function(d,newValue,type) {
        console.log('updating '  + type  + ' '+ newValue);
        var m = null;
        var date = d.matchDate.split('T')[0];
        matches[date].forEach(function (tm) {
            if (tm.id == d.id) {
                m = tm;
            }
        });
        switch (type) {
            case 'homeRacks':
                m.homeRacks = newValue;
                break;
            case 'awayRacks':
                m.awayRacks = newValue;
                break;
            case 'setHomeWins':
                m.setHomeWins = newValue;
                break;
            case 'setAwayWins':
                m.setAwayWins = newValue;
                break;
            case 'home':
            case 'away':
                teams.forEach(function (t) {
                    if (t.id == newValue) {
                        d[type] = t;
                    }
                });
                return;
                break;
            case 'date':
                var dt = m.matchDate.split('T');
                dt[0] = newValue;
                m.matchDate = dt[0] + 'T' + dt[1];
                break;
            case 'time':
                var dt = m.matchDate.split('T');
                dt[1] = newValue;
                m.matchDate = dt[0] + 'T' + dt[1];
                break;
            case 'gameType':
                m.division = newValue;
                break;
        }
        this.emitChange(m.status);
    },
    addNew : function(seasonId) {
        this.emitChange('loading');
        Util.getSomeData({
            url: '/api/teammatch/admin/add/' + seasonId,
            callback: function(d) {
                this.init(seasonId);
            }.bind(this),
            module: 'TeamMatchAdd'
        });
    },
    handleDelete: function(d){
        return function(e) {
            e.preventDefault();
            this.emitChange('loading');
            Util.getSomeData({
                url: '/api/teammatch/admin/delete/' + d.id,
                callback: function(data) {
                    this.init(d.season.id)
                }.bind(this),
                module: 'TeamMatchDelete'
            });
        }.bind(this);
    },
    handleSubmit: function(d) {
        return function(e) {
            e.preventDefault();
            var submitData = {};
            submitData.id = d.id;
            submitData.home = {id: d.home.id};
            submitData.away = {id: d.away.id};
            submitData.homeRacks = d.homeRacks;
            submitData.awayRacks = d.awayRacks;
            submitData.setHomeWins = d.setHomeWins;
            submitData.setAwayWins = d.setAwayWins;
            submitData.matchDate = d.matchDate;
            submitData.division = d.division;
            matches = null;
            this.emitChange('loading');
            setTimeout(function () {
                Util.postSomeData({
                    url: '/api/teammatch/admin/modify',
                    data: submitData,
                    callback: function (data) {
                        this.init(d.home.season.id);
                    }.bind(this)
                })
            }.bind(this), 500);
        }.bind(this)
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

module.exports = TeamMatchStore;
