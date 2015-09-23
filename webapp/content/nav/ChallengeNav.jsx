var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;
var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var ChallengeNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            challenges: []
        }
    },
    componentWillMount: function () {

    },
    componentWillUnmount: function () {

    },
    componentDidMount: function () {
    },
    render: function () {
        if (!this.getUser().challenge) {
            return null;
        }
        var className = "dropdown ";
        if (this.context.location.pathname.indexOf('app/challenge') >= 0) {
            className += "active";
        }
        return (
              <li id="challenge-nav" role="presentation" className={className}>
                 <Link to="/app/challenge" >
                     <span className='fa fa-trophy'></span>
                     <span className="main-item">
                         Challenges
                     </span>
                 </Link>
             </li>
        )
    }
});

        /*
        var c = u.challenges;
        var counter = c[Status.SENT].length
            + c[Status.PENDING].length
            + c[Status.ACCEPTED].length;


        var noChallenge = (
            <ul className="dropdown-menu" role="menu">
                <li id="challenge-signup-link" className="teamNavLink" role="presentation">
                    <Link to='challengeSignUp'>What's This?</Link>
                </li>
            </ul>);

        if (!this.getUser().isChallenge()) {
                 return (
                     <li role="presentation" className={'dropdown ' + active}>
                         <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                             <span className="fa fa-trophy"></span> <span className="main-item"> Challenges </span>
                             <span className="badge">{counter}</span>
                             <span className="caret"></span>
                         </a>
                         {noChallenge}
                     </li>
                 )
        }
*/
/*
                 <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                   <ul className="dropdown-menu" role="menu">
                     <li className="teamNavLink" role="presentation">
                         {this.genLink(c,Status.PENDING,'alert','Pending')}
                     </li>
                     <li className="teamNavLink" role="presentation">
                         {this.genLink(c,Status.ACCEPTED,'calendar','Accepted')}
                     </li>
                     <li className="teamNavLink" role="presentation">
                         {this.genLink(c,Status.SENT,'ok','Sent')}
                     </li>
                     <li className="teamNavLink" role="presentation">
                         {this.genLink(c,Status.REQUEST,'plus-sign','Request')}
                     </li>
                 </ul>

        return (
             <li id="challenge-nav" role="presentation" className={'dropdown ' + active}>
                 <Link to="challengeMain" >
                     <span className='fa fa-trophy'></span>
                     <span className="main-item">
                         Challenges
                     </span>
                     <span className="badge" id={'challenge-counter'}>
                         {counter}
                     </span>
                 </Link>
             </li>
        );

    }
});
*/

module.exports = ChallengeNav;

