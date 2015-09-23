var React = require('react/addons');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var CancelApp = React.createClass({
    mixins: [UserContextMixin],
    getInitialState: function() {
         return {
             challenges: []
        }
    },
    componentWillMount: function() {
    },
    componentWillUnmount: function() {
    },
    componentDidMount: function() {
        Util.getSomeData({
            url: '/api/challenge/user/' + this.getUser().id,
            callback: function(d){this.setState({challenges: d});}.bind(this),
            module: 'UpcomingChallenges',
            router: this.props.history
        });
    },
    backup: function(e) {
        e.preventDefault();
        this.props.history.pushState(null,'/app/challenge');
    },
    cancel: function(e) {
        e.preventDefault();
        var request = { id: this.props.params.challengeId };
        util.sendData('/api/challenge/cancel',request, function(d) {
            this.props.history.pushState(null,'/app/challenge');
        }.bind(this));
    },
    render: function() {
        var challenge = null;
        this.state.challenges.forEach(function(c){
            if (c.id == this.props.params.challengeId)
                challenge = c;
            }.bind(this)
        );
        if (challenge == null){
            return null;
        }
        var opponent = challenge.userOpponent;
        if (opponent.id == this.getUser().id) {
            opponent = challenge.userChallenger;
        }
        return (
                <div id="cancel-app" >
                    <h2 className="form-signin-heading">{'Decline Challenge against  ' + opponent.name + '?'}</h2>
                    <div className="form-field form-group">
                        <div  className="form-group">
                            <h4>{'(Optional) Message to ' + opponent.name} </h4>
                            <textarea ref='message' id="message" type="textarea" name="message" className="form-control">

                            </textarea>
                        </div>
                        <div className="form-group">
                            <button onClick={this.backup} type="button" className="btn btn-sm btn-primary btn-responsive ">
                                <b>Go Back</b>
                            </button>
                            <button onClick={this.cancel} type="button" className="btn btn-sm btn-warning btn-responsive ">
                                <b>Decline Challenge</b>
                            </button>
                        </div>
                    </div>
                </div>
        );
    }
});

module.exports = CancelApp;