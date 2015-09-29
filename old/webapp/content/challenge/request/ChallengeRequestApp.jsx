var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link
    ,RouteHandler = Router.RouteHandler;

var ChallengeRequestDate = require('./ChallengeRequestDate.jsx');
var ChallengeRequestSlots = require('./ChallengeRequestSlots.jsx');
var ChallengeRequestOpponent= require('./ChallengeRequestOpponent.jsx');
var ChallengeRequestGame= require('./ChallengeRequestGame.jsx');
var DataStore = require('../../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../../jsx/mixins/UserContextMixin.jsx');
var ChallengeGroup = require('../../../lib/ChallengeGroup');
var util = require('../challengeUtil');


var ChallengeRequestApp = React.createClass({
    mixins: [UserContextMixin,Router.Navigation,Router.State],
    componentDidMount: function () {
        //this.setState({user: this.getUser()});
    },
    componentWillMount: function() {
        //DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        //DataStore.removeChangeListener(this._onChange);
    },
    getErrors: function() {
        var c = util.convertToChallenge(this.getQuery());
        var errors = [];
        if (c == undefined) {
            errors.push('no challenge');
            return errors;
        }
        if (c.opponent == null || c.opponent == undefined || c.opponent.userId == 0)
            errors.push('Need an opponent');

        if (c.selectedSlots.length == 0)
            errors.push('Please choose a slot');

        if (!c.date)
            errors.push('Please choose a date');

        return errors;
    },
    challenge: function(e) {
        e.preventDefault();
        var opponent = { id: 0};
        var c = util.convertToChallenge(this.getQuery());
        opponent.id = c.opponent.userId;
        var slots = [];
        c.selectedSlots.forEach(function(s) {
            var slot = { id: 0 };
            slot.id = s.id;
            slots.push(slot);
        });
        var nine = false;
        var eight = false;
        /*
        c.selectedGames.forEach(function(g){
            if (g == DivisionType.EIGHT_BALL_CHALLENGE)
                eight = true;
            if (g == DivisionType.NINE_BALL_CHALLENGE)
                nine = true;
        });
        */
        nine = true;
        var request = {
            challenger: {id : this.getUserId()},
            opponent: opponent,
            nine: nine,
            eight: eight,
            slots: slots
        };
        util.create(request,this._onAdd);
    },
    _onAdd: function(d) {
        console.log('onAdd');
        DataStore.replaceUser(d);
        this.transitionTo('challengeMain');
    },
   // confirm: function() {
     //   this.transitionTo('challengeMain',this.getParams(),this.getQuery());
    //},
    isValid: function() {
        return this.getErrors().length == 0;
    },
    render: function(){
        if (this.getUser().id == 0 ) {
            return null;
        }
        var c = util.convertToChallenge(this.getQuery());
        if (c == undefined || c == null) {
            c = new ChallengeGroup();
        }
        var submit = (
            <Link to="challengeConfirm" params={this.getParams()} query={this.getQuery()}>
                <button type="button" disabled={!this.isValid()} onClick={this.challenge} className="btn btn-default btn-lg success">
                    <span className="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> Challenge!
                </button>
            </Link>
        );
        //<ChallengeRequestGame challengeGroup={c} />
        return (
            <div className="panel panel-primary">
                <div className="panel-heading" >  <span className={"glyphicon glyphicon-plus"}></span>New Request</div>
                <div className="panel-body" >
                    <div className="page-elements">
                        <form id="request-app"  >
                            <ChallengeRequestDate  challengeGroup={c} />
                            <ChallengeRequestOpponent opponent={c.opponent} />
                            <ChallengeRequestSlots  challengeGroup={c} />
                            <div>
                    <p>
                    {submit}
                </p>
                </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
});
var ChallengeRequestOpponent = React.createClass({
    mixins: [UserContextMixin],
    componentDidMount: function() {
    },
    onChange: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        q.opponent = e.target.value;
        this.transitionTo('challengeMain',this.getParams(),q);
    },
    getOptions: function() {
        var options = [];
        var potentials  = [];
        var users = this.getUsers();
        var chosenDate = this.getQuery().date;

        for(var i = 0; i < users.length ; i++) {
            var user = users[i];
            if (user.isChallenge() && user.userId != this.getUserId() ) {
                potentials.push(user);
            }
        }
        options.push(<option key={0} value={0}>{'Choose Your Enemy'}</option>);

        potentials.forEach(function(p) {
            if (chosenDate) {
                var taken = false;
                p.challenges[Status.ACCEPTED].forEach(function (c) {
                    if (c.date == chosenDate) {
                        taken = true;
                    }
                }.bind(this));

                if (taken)
                    return;
            }
            options.push(<option key={p.userId} value={p.userId}>{p.name + ' (' + p.getChallengeHandicap() + ')'}</option>);
        }.bind(this));
        return options;
    },
    render: function() {
        var q = this.getQuery();
        var opponent = q.opponent != undefined ? q.opponent : 0;

        return (
              <div className="form-field form-group">
                  <div className="form-group">
                      <select name='challenge-opponent'
                              id='challenge-opponent'
                              className="form-control"
                              type='select'
                              value={opponent}
                              ref='opponents'
                              onChange={this.onChange} >
                          {this.getOptions()}
                      </select>
                    </div>
                  <ChallengeRequestRace />
              </div>
        );
    }
});

var ChallengeRequestRace = React.createClass({
    mixins: [UserContextMixin,SeasonMixin,Router.Navigation,Router.State],
    render: function() {
        var q = this.getQuery();
        if (q.opponent == undefined || q.opponent == 0)  {
            return null;
        }
        var opponent = this.getUser(q.opponent);
        return <span>Race: {Handicap.race(this.getUser().getRawChallengeHandicap(),opponent.getRawChallengeHandicap())}</span>
    }
});



module.exports = ChallengeRequestApp;