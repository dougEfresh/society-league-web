var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var DataStore = require('../../jsx/stores/DataStore.jsx');
var DataActions= require('../../jsx/actions/DataActions.jsx');

var SignUp = React.createClass({
    mixins: [Router.Navigation,UserContextMixin],
    onClick: function(e) {
        e.preventDefault();
        DataActions.challengeSignUp(this.getUser().userId);
        this.transitionTo('home');
    },
    _onChange: function() {
        console.log('signup');
        this.transitionTo('request');
        this.setState({user: this.getUser()});
    },
    componentWillMount: function() {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        DataStore.removeChangeListener(this._onChange);
    },
    render: function() {
        if (this.getUser().userId == 0) {
            return null;
        }
        return (
             <div id="challenge-signup" className="panel panel-default">
                 <div className="panel-heading" >Challenge League </div>
                 <div className="panel-body" >
                     <p>
                         The Challenge league is an individual 8 or 9 ball league.
                         You request a challenge through a <strong>challenge portal</strong>
                     </p>
                     <p>
                         You choose a time, opponent and game type. A notification is sent to your opponent and they can accept or decline
                     </p>
                     <p>Click the sign up button below to begin challenging other users</p>
                 </div>
                 <div classnName="panel-footer">
                     <button onClick={this.onClick} className='btn btn-primary'>Sign up now</button>
                 </div>
             </div>


        );
    }
});

module.exports = SignUp;