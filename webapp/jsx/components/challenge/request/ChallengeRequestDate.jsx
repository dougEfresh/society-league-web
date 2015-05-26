var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var RequestActions = require('../../../actions/RequestActions.jsx');
var UserContextMixin  = require('../../../mixins/UserContextMixin.jsx');
var Util  = require('../../../util.jsx');
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input;
var moment = require('moment');

var ChallengeRequestDate = React.createClass({
    mixins: [UserContextMixin],
    getOptions: function(){
        var nextChallengeDate = Util.nextChallengeDate();
        var dates = [];
        // Add the next 4 weeks as options
        [0,1,2,3,4].forEach(function(i) {
            dates.push(moment(nextChallengeDate).add(i,'weeks').format('YYYY-MM-DD'));
        });
        var found = false;
        dates.forEach(function (d) {
                if (d == this.props.date) {
                    found = true;
                }
            }.bind(this)
        );
        var dateOptions = [];
        dateOptions.push(<option key={-1} value={-1}>{'Choose date'}</option>);
        dates.forEach(function(d) {
            dateOptions.push(<option key={d} value={d}>{d}</option>);
        });

        return dateOptions;
    },

    componentDidMount: function() {
        //Init the date
        //RequestActions.changeDate(Util.nextChallengeDate());
    },
    onChange: function() {
        RequestActions.changeDate(this.refs.date.getValue());
    },
    render: function() {
        if (this.props.challengeGroup)
            return (
                <Input type='select' ref='date' value={this.props.challengeGroup.date} label={'Choose Date'} onChange={this.onChange} >{this.getOptions()}</Input>
            );
        return null;
    }
});

module.exports = ChallengeRequestDate;
