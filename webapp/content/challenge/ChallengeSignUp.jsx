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
                 <div className="panel-heading" ><h1>Challenge League</h1></div>
                 <div className="panel-body challenge-content" >
                    <h2>
                        The Top Gun league is an individual 9 ball league.
                    </h2>
                     <h2>Requesting a Challenge</h2>
                     <p>
                        <ol className="request-directions">
                            <li>Click the 
                                <button className="btn btn-default btn-success request-signup">
                                    <span className="glyphicon glyphicon-plus-sign"></span><b>Request</b>
                                </button> button
                            </li>
                            <li>Choose a Date</li>
                            <li>Choose an Opponent</li>
                            <li>Choose a time or multiples times</li>
                            <li>Hit Confirm</li>
                        </ol>
                     </p>
                      <p>A notification is sent to your opponent which they can accept or decline.</p>
                     <p>Click the sign up button below to begin challenging other users</p>
                     <div classnName="panel-footer">
                     <button onClick={this.onClick} className='btn btn-primary'>Sign up now</button>
                 </div>
                 </div>
             </div>


        );
    }
});

module.exports = SignUp;