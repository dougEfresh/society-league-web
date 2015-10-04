var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,RouteHandler = Router.RouteHandler;
var UserContextMixin = require('./../../jsx/mixins/UserContextMixin.jsx');
var Handicap = require('../../lib/Handicap');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var Util = require('../../jsx/util.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');

var StatHistory = React.createClass({
    mixins: [UserContextMixin],
       getInitialState: function() {
         return {
             user: null,
             season: null
         }
       },
    getData: function(statsId) {
        Util.getSomeData({
            url: '/api/user/' + statsId,
            module: 'StatHistory',
            router: this.props.history,
            callback: function(d) {this.setState({user: d})}.bind(this)
        })
    },
    componentDidMount: function () {
        this.getData(this.props.params.statsId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.statsId);
    },
    onChange: function(e) {
        e.preventDefault();
        this.setState({selectedSeason: e.target.value});
    },
    render: function() {
        if (this.state.user == null) {
            return null;
        }

        var rows = [];
        this.state.user.seasons.forEach(function(s){
            if (s.active)
                rows.push(<UserResults key={s.id} user={this.state.user} season={s} />);
        }.bind(this));

        return (
            <div>
                {rows}
            </div>
        );
    }
});

module.exports = StatHistory;