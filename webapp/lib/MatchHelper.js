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
    Util.getSomeData({
        url: '/api/team/season/' + this.seasonId,
        callback: function (d) {
            this.teams = d;
            this.teams.forEach(function(t) {
                this.teamOptions.push(<option key={t.id} value={t.id} >{t.name}</option>);
                this.component.forceUpdate();
            }.bind(this));
        }.bind(this),
        module: 'Teams'
    });
    this.dateOptions = [];
    this.newMatches = [];
    this.timeOptions = [];
    var dt;
    var dates = [];
    for(var i = 0; i<9; i++) {
        dt = moment().subtract(i,'days').format('YYYY-MM-DD');
        //this.dateOptions.push(<option key={dt} value={dt}>{dt}</option>)
        dates.push(dt);
    }

    for(var i = 1; i<31; i++) {
        dt = moment().add(i,'days').format('YYYY-MM-DD');
        //
        dates.push(dt);
    }

    dates = dates.sort();
    dates.forEach(function(d) {
        this.dateOptions.push(<option key={d} value={d}>{d}</option>)
    }.bind(this));

    this.timeOptions.push(<option key={'11:00'} value={'11:00'}>{'11:00'}</option>);
    this.timeOptions.push(<option key={'12:00'} value={'12:00'}>{'12:00'}</option>);
    for (var i = 1; i<7;i ++) {
        this.timeOptions.push(<option key={i + ':00'} value={ (i + 12) + ':00'}>{i+':00'}</option>);
    }
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
            this.played = {};
             var orderd = Object.keys(d).sort(function(a,b){
                 return b.localeCompare(a);
             });
            orderd.forEach(function(dt){
                this.played[dt] = d[dt];
            }.bind(this));
            this.processResults(d);
            this.component.forceUpdate();
        }.bind(this),
        module: 'Played'
    });

};

MatchHelper.prototype.processResults = function(data) {
    Object.keys(data).forEach(function(md) {
       data[md].forEach(function(m) {
            m.onSubmit = function(d) {
               return function(e) {
                   e.preventDefault();
                   this.handleSubmit(d);
                   this.component.forceUpdate();
               }.bind(this);
           }.bind(this);

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

MatchHelper.prototype.createNew = function() {
     Util.getSomeData({
            url: '/api/teammatch/admin/add/' + this.seasonId,
            callback: function(d) {
                this.newMatches.push(d);
                this.processResults({blah: this.newMatches});
                this.component.forceUpdate();
            }.bind(this),
            module: 'TeamMatchAdd'
        });
};

MatchHelper.prototype.getNewMatches= function() {
    return this.newMatches;
}

MatchHelper.prototype.handleDelete = function(d) {
    console.log('Deleting '  + d.id);
    if (this.upcoming != null) {
        Object.keys(this.upcoming).forEach(function (md) {
            this.upcoming[md] = this.upcoming[md].filter(function (m) {
                return m.id != d.id;
            });
        }.bind(this));
    }
    if (this.played != null) {
        Object.keys(this.played).forEach(function (md) {
            this.played[md] = this.played[md].filter(function (m) {
                return m.id != d.id;
            });
        }.bind(this));
    }
    this.pending = this.pending.filter(function(m) {
        return m.id != d.id;
    });
    Util.getSomeData({
        url: '/api/teammatch/admin/delete/' + d.id,
        callback: function(d) {this.component.forceUpdate()}.bind(this),
        module: 'TeamMatchDelete'
    });
};

MatchHelper.prototype.getTeamSelect = function(type) {
    var c = {};
    c.name = type;
    c.title = type;
    c.width = 140;
    c.style = {minWidth: 130};
    c.render = function(v,data,cp) {
        return (
            <select ref={type}
                    onChange={data.onChange(data,type)}
                    className="form-control"
                    value={data[type].id}
                    type={'select'}>
                {this.teamOptions}
            </select>
        )
    }.bind(this);
    return c;
};

MatchHelper.prototype.getDateSelect = function() {
    var c = {};
    c.name = 'date';
    c.title = 'date';
    c.width = 110;
    c.style = {minWidth: 130};
    c.render = function(v,data,cp) {
        var d = data.matchDate.split('T')[0];
        return (
            <select ref={'date'}
                    onChange={data.onChange(data,'date')}
                    className="form-control"
                    value={d}
                    type={'select'}>
                {this.dateOptions}
            </select>
        )
    }.bind(this);
    return c;
};



MatchHelper.prototype.getTimeSelect = function() {
    var c = {};
    c.name = 'time';
    c.title = 'time';
    c.width = 100;
    c.style = {minWidth: 100};
    c.render = function(v,data,cp) {
        var d = data.matchDate.split('T')[1];
        return (
            <select ref={'time'}
                    onChange={data.onChange(data,'time')}
                    className="form-control"
                    value={d}
                    type={'select'}>
                {this.timeOptions}
            </select>
        )
    }.bind(this);
    return c;
};

MatchHelper.prototype.handleSubmit = function(d) {
    //console.log(JSON.stringify(d));
    var submitData = {};
    submitData.id = d.id;
    submitData.home = {id: d.home.id};
    submitData.away = {id: d.away.id};
    submitData.homeRacks = d.homeRacks;
    submitData.awayRacks = d.awayRacks;
    submitData.setHomeWins = d.setHomeWins;
    submitData.setAwayWins = d.setAwayWins;
    submitData.matchDate = d.matchDate;

    Util.postSomeData({
        url: '/api/teammatch/admin/modify',
        data: submitData,
        router: this.component.props.history,
        callback: function(data) {
            this.newMatches = this.newMatches.filter(function(a){
                return a.id != data.id;
            });
            this.receiveMatches();
        }.bind(this)
    })
};

MatchHelper.prototype.handleUpdate = function(d,newValue,type) {
    console.log('changing  '  + d.id  + ' ' + type);
    if (type == 'homeRacks') {
        d.homeRacks = newValue;
        /*
        Util.getSomeData({
            url: '/api/teammatch/racks/' + d.id + '/' + d.home.id + '/' + newValue,
            callback: function(r) { console.log('HomeRacks now ' + r.homeRacks); this.component.forceUpdate()}.bind(this),
            module: 'HomeRacks'
        });
        */
        return ;
    }

    if (type == 'awayRacks') {
        d.awayRacks = newValue;
        /*
        Util.getSomeData({
            url: '/api/teammatch/racks/' + d.id + '/' + d.away.id + '/' + d.awayRacks,
            callback: function(r) {console.log('AwayRacks now ' + r.awayRacks) ; this.component.forceUpdate()}.bind(this),
            module: 'AwayRacks'
        });
        */
        return;
    }

    if (type =='home' || type == 'away') {
        this.teams.forEach(function(t){
            if (t.id == newValue) {
                d[type] = t;
            }
        });
        /*
        Util.getSomeData({
            url: '/api/teammatch/admin/change/' + type + '/' + d.id + '/' + d[type].id,
            callback: function(r) {this.component.forceUpdate()}.bind(this),
            module: 'Change' +type
        });
        */
        return;
    }

    if (type =='date' ) {

        var dt = d.matchDate.split('T');
        dt[0] = newValue;
        d.matchDate = dt[0] + 'T' + dt[1];
        /*
          Util.getSomeData({
            url: '/api/teammatch/admin/change/date/' + d.id + '?date=' +  d.matchDate,
            callback: function(r) {this.component.forceUpdate()}.bind(this),
            module: 'Change' +type
        });
        */
    }

    if (type =='time' ) {
        var dt = d.matchDate.split('T');
        dt[1] = newValue;
        d.matchDate = dt[0] + 'T' + dt[1];
        /*
          Util.getSomeData({
            url: '/api/teammatch/admin/change/date/' + d.id + '?date=' +  d.matchDate,
            callback: function(r) {this.component.forceUpdate()}.bind(this),
            module: 'Change' +type
        });
        */
    }
};



module.exports = MatchHelper;
