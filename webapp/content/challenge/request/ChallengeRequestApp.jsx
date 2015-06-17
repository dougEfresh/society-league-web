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
    confirm: function() {
        this.transitionTo('challengeMain',this.getParams(),this.getQuery());
    },
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
                <button type="button" disabled={!this.isValid()} onClick={this.confirm} className="btn btn-default btn-lg success">
                    <span className="glyphicon glyphicon-ok-sign" aria-hidden="true"></span> Confirm
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

module.exports = ChallengeRequestApp;