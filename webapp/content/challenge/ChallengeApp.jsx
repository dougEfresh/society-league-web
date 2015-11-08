var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');
var Util = require('../../jsx/util.jsx');
var Handicap = require('../../lib/Handicap');
var Status = require('../../lib/Status');
var ChallengePendingApp = require('../challenge/ChallengePendingApp.jsx');
var ChallengeAcceptedApp = require('../challenge/ChallengeAcceptedApp.jsx');
var UpcomingChallenges = require('../home/UpcomingChallenges.jsx');
var SeasonStandings = require('../season/SeasonStandings.jsx');

var ChallengeApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             slots: [],
             dates: [],
             challengers: [],
             refresh : false,
             challenges: []
        }
    },
    componentWillReceiveProps: function(n){
        if (this.state.refresh) {
            Util.getSomeData({
                url: '/api/challenge/user/' + this.getUser().id,
                callback: function(d) {this.setState({challenges: d})}.bind(this),
                module: 'ChallengeApp',
                router: this.props.history
            }
        );
        }
    },
    componentDidMount: function() {
        var dateFunc = function(d){
            var dates = {};
            d.forEach(function(s){
                dates[s.timeStamp.split('T')[0]] = 1;
            });
            for(var dt in dates) {
                this.state.dates.push(dt);
            }
            this.setState({slots: d});
        }.bind(this);

        Util.getSomeData({
                url: '/api/challenge/slots',
                callback: dateFunc,
                module: 'ChallengeApp',
                router: this.props.history
            }
        );
        Util.getSomeData({
                url: '/api/challenge/users',
                callback: function(d) {this.setState({challengers: d})}.bind(this),
                module: 'ChallengeApp',
                router: this.props.history
            }
        );
         Util.getSomeData({
                url: '/api/challenge/user/' + this.getUser().id,
                callback: function(d) {this.setState({challenges: d})}.bind(this),
                module: 'ChallengeApp',
                router: this.props.history
            }
        );
    },
    challenge: function(e) {
        e.preventDefault();
        var opponent = { id: this.props.location.query.opponent};
        var slots = this.props.location.query.slots;
        var selected = [];
        for (var s in slots)  {
            var i = parseInt(this.props.location.query.slots[s]);
            if ( i > 0 ) {
                selected.push({id : s});
            }
        }
        var challenger = null;
        this.state.challengers.forEach(function(c) {
            if (c.challengeUser.id == this.getUser().id) {
                challenger = c;
            }
        }.bind(this));
        var request = {
            challenger: {id : challenger.id},
            opponent: opponent,
            slots: selected,
            status: Status.PENDING
        };
        Util.postSomeData({
            url: '/api/challenge/create',
            module: 'CreateChallenge',
            callback: function(d) {
                this.state.refresh = true;
                this.props.history.pushState(null,'/app/challenge',null);
            }.bind(this),
            router: this.props.history,
            data: request
        });
    },
    isValid: function() {
        var q = this.props.location.query;
        if (q && q.opponent != undefined && q.slots != undefined){
            var selected = 0;
            for(var s in q.slots){
                selected += parseInt(q.slots[s]);
            }
            return selected > 0;
        }
        return false;
    },
    render: function() {
        if (this.state.slots.length == 0) {
            return null;
        }
        var refresh = this.state.refresh || this.props.location.query.refresh != undefined;
        if (this.state.refresh)
            this.state.refresh = false;

        var season;
        this.getUser().handicapSeasons.forEach(function(s){
            if (s.season.challenge) {
                season = s.season;
            }
        });
        return (
            <div>
                <div className="row">
                    <div className="col-xs-12 col-md-6" >
                        <div className="panel panel-primary">
                            <div className="panel-heading panel-challenge-heading" > <span className={"glyphicon glyphicon-plus"}></span> New Request</div>
                            <div className="panel-body panel-challenge-body" >
                                <div className="page-elements challenge-form">
                                    <form id="request-app" >
                                        <div>
                                            <ChallengeRequestDate query={this.props.location.query}
                                                      history={this.props.history}
                                                      dates={this.state.dates} />
                                            <ChallengeRequestOpponent query={this.props.location.query} history={this.props.history} />
                                            <ChallengeRequestSlots query={this.props.location.query} history={this.props.history} />
                                        </div>
                                    </form>
                                </div>
                                <div className={"btn-challenge" + (!this.isValid() ? " hide" : "") }>
                                    <button type="button" onClick={this.challenge} className="btn btn-sm  btn-success">
                                        <span className="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> Challenge!
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <UpcomingChallenges data={this.state.challenges} refresh={refresh}/>
            </div>
        );
    }
});
//
var ChallengeRequestDate = React.createClass({
    getOptions: function(){
        var dates =  this.props.dates;
        if (this.props.dates ==undefined) {
            return null;
        }
        var dateOptions = [];
        dateOptions.push(<option key={-1} value={-1}>{'Select date'}</option>);
        dates.forEach(function(d) {
            dateOptions.push(<option id={'date-' + d } key={d} value={d}>{d}</option>);
        });
        return dateOptions;
    },
    onChange: function(e) {
        e.preventDefault();
        var q = this.props.query;
        if (!q) {q = {};}
        q.date = React.findDOMNode(this.refs.date).value;
        this.props.history.pushState(null, '/app/challenge', q);
    },
    render: function() {
        var dt = this.props.query == undefined ? -1 : this.props.query.date;
        if (dt == undefined) {
            dt = -1;
        }
        return (
            <div className="form-field form-group">
                <div className="form-group">
                    <select name={'challenge-date'}
                            id={'challenge-date'}
                            type='select' ref='date'
                            className="form-control"
                            value={dt}
                            onChange={this.onChange}>
                        {this.getOptions()}
                    </select>
                </div>
            </div>
        );
    }
});

var ChallengeRequestOpponent = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
        return {
            date: this.props.query.date,
            opponents: []
        }
    },
    getData: function(date) {
        if (!date)
            return;
        var userFunc = function(d) {
            this.setState({opponents: d, date: date})
        }.bind(this);
        Util.getSomeData({
            url: '/api/challenge/date/' + date,
            callback: userFunc,
            router: this.props.history,
            module: 'ChallengeRequestOpponent'
        });
    },
    componentDidMount: function() {
        this.getData(this.props.query.date);
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.state.date != nextProps.query.date)
            this.getData(nextProps.query.date);
    },
    onChange: function(e) {
        e.preventDefault();
        this.props.query.opponent = e.target.value;
        this.props.history.pushState(null,'/app/challenge',this.props.query);
    },
    getOptions: function() {
        var options = [];
        var challengerHc = 'UNKNOWN';
         this.getUser().handicapSeasons.forEach(function(hs) {
            if (hs.season.challenge){
                challengerHc = hs.handicap;
            }
         });
        options.push(<option key={0} value={0}>{'Choose Your Enemy'}</option>);
        this.state.opponents.forEach(function(t) {
            var handicapSeason = {};
            if (t.challengeUser == null || t.challengeUser == undefined) {
                return;
            }
            t.challengeUser.handicapSeasons.forEach(function(hs) {
                if (hs.season.challenge)
                    handicapSeason = hs;
            });
            options.push(<option key={t.id} value={t.id}>
                {t.challengeUser.name + '  - ' + handicapSeason.handicapDisplay + ' - (' + Handicap.race(challengerHc,handicapSeason.handicap) + ')'}
            </option>);
        }.bind(this));
        return options;
    },
    render: function() {
        if (!this.props.query.date)
            return null;

        return (
            <div className="form-field form-group">
                <div className="form-group">
                    <select name='challenge-opponent'
                            id='challenge-opponent'
                            className="form-control"
                            type='select'
                            value={ this.props.query.opponent == undefined ? 0 : this.props.query.opponent}
                            ref='opponents'
                            onChange={this.onChange} >
                        {this.getOptions()}
                    </select>
                </div>
            </div>
        );
    }
});

var ChallengeRequestSlots = React.createClass({
    mixins: [UserContextMixin],
     getInitialState: function() {
        return {
            date: undefined,
            opponent: "0",
            slots:  []
        }
    },
    getData: function(date,op) {
        if (!date || !op)
            return;
        var userFunc = function(d) {
            this.setState({slots: d, date: date, opponent: op})
        }.bind(this);
        Util.getSomeData({
            url: '/api/challenge/slots/' + date + '/'+ op,
            callback: userFunc,
            router: this.props.history,
            module: 'ChallengeRequestOpponent'
        });
    },
    componentDidMount: function() {
        this.getData(this.props.query.date,this.props.query.opponent);
    },
    componentWillReceiveProps: function(nextProps) {
        if (this.state.date == undefined || this.state.date != nextProps.query.date || this.state.opponent != nextProps.query.opponent)
            this.getData(nextProps.query.date,nextProps.query.opponent);
    },
    render: function() {
        if (this.props.query.date == undefined || this.props.query.opponent == undefined) {
            return null;
        }
        if (this.state.slots.length == 0) {
            return null;
        }
        var buttons = [];
        var slots = this.state.slots;
        slots.forEach(function (s) {
            buttons.push(
                    <SlotButton key={s.id} slot={s} query={this.props.query} history={this.props.history} />
                );
            }.bind(this));
          return (
                <div className="btn-group btn-group-xs select-time">
                    {buttons}
                </div>
            );
    }
});

var SlotButton = React.createClass({
    mixins: [UserContextMixin],
    onClick: function(e) {
        e.preventDefault();
        var q = this.props.query;
        if (q.slots == undefined) {
            q.slots = {};
            q.slots[this.props.slot.id] = 1;
            this.props.history.pushState(null, '/app/challenge',q);
            return;
        }
        q.slots[this.props.slot.id] =  q.slots[this.props.slot.id] == 1 ? 0: 1;
        this.props.history.pushState(null, '/app/challenge',q);
    },
    render: function() {
        var q = this.props.query;
        var m = moment();
        var selected = false;
        if (q.slots != undefined) {
             if (q.slots[this.props.slot.id] > 0) {
                 selected = true;
             }
        }
        return (
                <button className={selected ? 'btn btn-xs btn-success' : 'btn btn-xs btn-default'}
                        onClick={this.onClick}>
                    <span className={selected ? 'fa fa-check' : 'fa fa-times'}></span>
                    {moment(this.props.slot.timeStamp).format(' h:mm')}
                </button>
         );
    }
});



module.exports = ChallengeApp;