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
    },
    _onChange: function() {
        console.log('onchange');
        this.transitionTo('home');
        this.setState({user: this.getUser()});
    },
    render: function() {
        if (this.getUser().userId == 0) {
            return null;
        }
        if (this.getUser().challenge) {
            this.transitionTo('request');
        }
        return (
            <div id="challenge-signup" >
               <button onClick={this.onClick} className='btn btn-primary'>Sign up now</button>
            </div>
        );
    }
});

module.exports = SignUp;