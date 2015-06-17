var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;

var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Season = require('../../lib/Season.js');
var Team = require('../../lib/Team.js');
var User = require('../../lib/User.js');
var Status = require('../../lib/Status');

var ChallengeNav = React.createClass({
    mixins: [UserContextMixin,Router.State],
    getInitialState: function () {
        return {
            user: this.getUser()
        }
    },
    componentWillMount: function () {
        DataStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        DataStore.removeChangeListener(this._onChange);
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    _onChange: function () {
        this.setState({
            user: this.getUser()
        });
    },
    genLink: function(c,type,glyph,name) {
        if (type == Status.REQUEST) {
            return (
                <Link to={'challengeMain'} >
                    <span className={"glyphicon glyphicon-" + glyph}></span>
                    {'Request'}
                </Link>
            )
        }
        return c[type].length != 0 ? (

                <Link to={'challengeMain'} >
                    <span id={type.toLowerCase() +'-link'}>
                        <span className={"glyphicon glyphicon-" + glyph}></span>
                    {name}
                     <span id={type.toLowerCase() +'-counter'} className="badge">
                         {c[type].length}</span>
                    </span>
                </Link>
            )
            : null;
    },
    render: function() {
        var u = this.getUser();
        if (u.userId == 0) {
            return null;
        }
        var c = u.challenges;
        var counter = c[Status.SENT].length
            + c[Status.PENDING].length
            + c[Status.ACCEPTED].length;

        var active = "";
        if (this.getPath().indexOf('/challenge/') >= 0) {
            active = "active";
        }
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

        return (
             <li id="challenge-nav" role="presentation" className={'dropdown ' + active}>
                 <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                     <span className='fa fa-trophy'></span>
                     <span className="main-item">
                         Challenges
                     </span>
                     <span className="badge" id={'challenge-counter'}>
                         {counter}
                     </span>
                     <span className="caret"></span>
                 </a>
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
             </li>
        );
    }
});

module.exports = ChallengeNav;
