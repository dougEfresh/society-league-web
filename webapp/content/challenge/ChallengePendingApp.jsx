var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink= require('../../jsx/components/links/UserLink.jsx');
var TeamLink= require('../../jsx/components/links/TeamLink.jsx');
var moment = require('moment');
var Util = require('../../jsx/util.jsx');
var Handicap = require('../../lib/Handicap');
var Status = require('../../lib/Status');

var ChallengePendingApp =  React.createClass({
    mixins: [UserContextMixin,Router.History],
    contextTypes: {
        location: React.PropTypes.object
    },
    getInitialState: function() {
        return {challenge: this.props.challenge};
    },
    renderNoSelect: function() {
        var slots = [];
        if ( this.props.challengeGroup.selectedSlots != undefined) {
            this.props.challengeGroup.selectedSlots.forEach(function (s) {
                slots.push(<span className="label label-default" key={s.id}>{s.getTime()}</span>);
            }.bind(this));
        } else {
            this.props.challengeGroup.slots.forEach(function (s) {
                slots.push(<span className="label label-default" key={s.id}>{s.getTime()}</span>);
            }.bind(this));
        }

        return slots;
    },
     onSelectSlot: function(e) {
         e.preventDefault();
         var slot = React.findDOMNode(this.refs.slot).value;
         var  c = this.state.challenge;
         c.acceptedSlot = {id: slot};
         this.setState({challenge: c});
     },
    renderSelectOptions: function(){
        if (this.state.challenge.slots.length == 1) {
            return (<span className="label label-default">{this.props.challenge.slots[0].time}</span>);
        }
        var slots = [];
        slots.push(<option key={"-1"} value={"-1"}>{'choose'}</option>);
        var sorted = this.props.challenge.slots.sort(function(a,b){
           return a.timeStamp.localeCompare(b.timeStamp);
        });
        sorted.forEach(function (s) {
            slots.push(<option key={s.id} value={s.id}>{moment(s.timeStamp).format('h:mm')}</option>);
        }.bind(this));
        return (
             <form id="request-game">
                  <div className="form-field form-group challenge-form-time">
                      <div className="form-group">
                          <select ref='slot' onChange={this.onSelectSlot}
                                  className="form-control challenge-form-time-select"
                                  value={this.state.challenge.acceptedSlot == undefined ? -1 : this.state.challenge.acceptedSlot.id }
                                  type={'select'}>
                              {slots}
                          </select>
                      </div>
                  </div>
             </form>
        );
    },
    accept: function() {
        var  request = {
            id: this.state.challenge.id,
            acceptedSlot: {id: this.state.challenge.acceptedSlot.id}
        };
        Util.postSomeData({
            url: '/api/challenge/accept',
            data: request,
            module: 'ChallengePendingApp',
            router: this.history,
            callback: function(d) {this.history.pushState(null,'/app/challenge',{refresh: true})}.bind(this)
        })
    },
    valid: function() {
        return this.state.challenge.acceptedSlot  != null;
    },
    render: function() {
        if (this.state.challenge == undefined) {
            return null;
        }
        if (this.state.challenge.status != Status.PENDING) {
            return null;
        }

        if (this.state.challenge != null  && this.state.challenge != undefined) {
            if (this.state.challenge.slots.length == 1) {
                this.state.challenge.acceptedSlot = this.state.challenge.slots[0];
            }
        }

        var challenge = this.state.challenge;
        var opponent = challenge.userOpponent;
        if (opponent.id == this.getUser().id) {
            opponent = challenge.userChallenger;
        }
        var accept = (
            <button className="btn btn-sm btn-success accept-button"  disabled={!this.valid()}
                    onClick={this.accept} key={'accept'}
                              bsStyle={!this.valid() ? 'primary' : 'success'} >
            <span className="glyphicon glyphicon-ok"></span>
            </button>);

        var m = moment(challenge.date);
        return (
            <tr>
                <td className="date">{m.format('MMM Do ')}</td>
                    <td className="user" >
                        <UserLink user={opponent}/>
                    </td>
                    <td className="slot-options">{this.renderSelectOptions()}</td>

                <td className="challenge-actions">
                        {accept}
                        <Link to={'/app/challenge/' + challenge.id + '/cancel'} >
                        <button type="button" className="btn btn-sm btn-danger btn-responsive challenge-decline">
                            <span className="glyphicon glyphicon-remove"></span>
                        </button>
                        </Link>
                    </td>
            </tr>
        );
    }
});


module.exports = ChallengePendingApp;