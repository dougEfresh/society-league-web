var Util = require('../jsx/util.jsx');
var moment = require('moment');
var React = require('react');
var DataGridUtil = require('./DataGridUtil.jsx');

function MatchHelper(component,seasonId) {
    this.seasonId = seasonId;
    this.component = component;
    this.upcoming = null;
    this.pending = [];
    this.played = null;
    this.teams = [];
    this.teamOptions = [];
}

MatchHelper.prototype.receiveMatches = function() {
    Util.getSomeData({
            url: '/api/teammatch/season/' + this.seasonId + '/upcoming',
            callback: function (d) {
                this.upcoming = d;
                this.processResults(d);
                this.component.forceUpdate();
            }.bind(this),
            module: 'Upcoming'
     });
    Util.getSomeData({
        url: '/api/teammatch/season/' + this.seasonId + '/pending',
        callback: function (d) {
            this.processResults(d);
            Object.keys(d).forEach(function(m) {
                this.pending = this.pending.concat(d[m]);
            }.bind(this));
            this.component.forceUpdate();
        }.bind(this),
        module: 'results'
    });
    Util.getSomeData({
        url: '/api/teammatch/season/' + this.seasonId + '/played',
        callback: function (d) {
            this.played = d;
            this.processResults(d);
            this.component.forceUpdate();
        }.bind(this),
        module: 'Played'
    });
    Util.getSomeData({
        url: '/api/team/season/' + this.seasonId,
        callback: function (d) {
            this.teams = d;
            this.teams.forEach(function(t) {
                this.teamOptions.push(<option key={t.id} value={t.id} >{t.name}</option>);
            }.bind(this));
        }.bind(this),
        module: 'Teams'
    });
};

MatchHelper.prototype.processResults = function(data) {
    Object.keys(data).forEach(function(md) {
       data[md].forEach(function(m) {
           m.onDelete = function(d) {
               return function(e) {
                   e.preventDefault();
                   this.handleDelete(d);
                   this.component.forceUpdate();
               }.bind(this);
           }.bind(this);
           m.onChange = function(d,type) {
               return function(e) {
                   e.preventDefault();
                   this.handleUpdate(d,e.target.value,type);
                   this.component.forceUpdate();
               }.bind(this);
           }.bind(this);

       }.bind(this));
    }.bind(this));
};

MatchHelper.prototype.getPending = function() {
    return this.pending;
};

MatchHelper.prototype.getUpcoming = function() {
    return this.upcoming;
};

MatchHelper.prototype.getPlayed = function() {
    return this.played;
};

MatchHelper.prototype.handleDelete = function(d) {
    console.log('Deleting '  + d.id);
};

MatchHelper.prototype.getTeamSelect = function(type) {
    var c = {};
    c.name = type;
    c.title = type;
    c.width = 140;
    c.render = function(v,data,cp) {
        if (data.new) {
            return (
                <select ref={type}
                        onChange={data.onChange(data,type,cp)}
                        className="form-control"
                        value={data[type].id}
                        type={'select'}>
                    {this.teamOptions}
                </select>
            )
        } else {
            if (DataGridUtil.columns[type]) {
                return DataGridUtil.columns[type].render(v,data,cp);
            }
        }
    }.bind(this);
    return c;
};

MatchHelper.prototype.handleUpdate = function(d,newValue,type) {
    console.log('changing  '  + d.id  + ' ' + type);
    d.new = false;
    if (type == 'homeRacks') {
        d.homeRacks = newValue;
        Util.getSomeData({
            url: '/api/teammatch/racks/' + d.id + '/' + d.home.id + '/' + newValue,
            callback: function(r) { console.log('HomeRacks now ' + r.homeRacks); this.component.forceUpdate()}.bind(this),
            module: 'HomeRacks'
        });
        return ;
    }

    if (type == 'awayRacks') {
        d.awayRacks = newValue;
        Util.getSomeData({
            url: '/api/teammatch/racks/' + d.id + '/' + d.away.id + '/' + d.awayRacks,
            callback: function(r) {console.log('AwayRacks now ' + r.awayRacks) ; this.component.forceUpdate()}.bind(this),
            module: 'AwayRacks'
        });
        return;
    }

};



module.exports = MatchHelper;
