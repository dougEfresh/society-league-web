var React = require('react/addons');
var RequestApp =  require('./../request/ChallengeRequestApp.jsx');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var DataStore = require('../../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('./../../../jsx/mixins/UserContextMixin.jsx');
var util = require('../challengeUtil');

var CancelApp = React.createClass({
    mixins: [Router.State,Router.Navigation,UserContextMixin],
    backup: function(e) {
        e.preventDefault();
        this.transitionTo('challengeMain');
    },
    cancel: function(e) {
        e.preventDefault();
        var message = React.findDOMNode(this.refs.message).value;
        var request = {
            challenger: null,
            opponent: null,
            message: message,
            challenges: []
        };
        var query = this.getQuery();
        query.challenges.forEach(function(id){
           request.challenges.push({id: id});
        });
        util.sendStatus('/api/challenge/cancel/' + this.getUser().id,request, function(d) {
            this.transitionTo('challengeMain');
        }.bind(this));
    },
    render: function() {
        var query = this.getQuery();
        //if (query.id == undefined) {
          //  return null;
        //}
        var challenges = DataStore.getChallenges();
        var toCancel = [];
        challenges.forEach(function(c){
            query.challenges.forEach(function(q){
                if (q == c.id) {
                    toCancel.push(c);
                }
            });
        });
        if (toCancel.length == 0) {
            return null;
        }
        var challenge = toCancel[0];
        var op = challenge.getOpponent(this.getUser());
        return (
                <div onKeyDown={this.handleSubmit} id="cancel-app" >
                    <h2 className="form-signin-heading">{'Cancel Challenge against  ' + op.sName() + '?'}</h2>
                    <div className="form-field form-group">
                        <div  className="form-group">
                            <h4>{'Message to ' + op.sName().replace('.',':')} </h4>
                            <textarea ref='message' id="message" type="textarea" name="message" className="form-control">

                            </textarea>
                        </div>
                        <div className="form-group">
                            <button onClick={this.backup} type="button" className="btn btn-sm btn-primary btn-responsive ">
                                <b>Go Back</b>
                            </button>
                            <button onClick={this.cancel} type="button" className="btn btn-sm btn-warning btn-responsive ">
                                <b>Cancel</b>
                            </button>
                        </div>
                    </div>
                </div>
        );
    }
});

module.exports = CancelApp;