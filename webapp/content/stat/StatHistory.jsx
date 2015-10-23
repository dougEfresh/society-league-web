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
    getData: function(statsId,seasonId) {
        Util.getSomeData({
            url: '/api/user/' + statsId,
            module: 'StatHistory',
            router: this.props.history,
            callback: function(d) {
                this.setState({user: d})}.bind(this)
        });
        Util.getSomeData({
            url: '/api/season/' + seasonId,
            module: 'StatHistory',
            router: this.props.history,
            callback: function(d) {
                this.setState({season: d})}.bind(this)
        })
    },
    componentDidMount: function () {
        this.getData(this.props.params.statsId,this.props.params.seasonId);
    },
    componentWillReceiveProps: function (n) {
        this.getData(n.params.statsId,n.params.seasonId);
    },
    onChange: function(e) {
        e.preventDefault();
        console.log('sw  to ' + e.target.value);
        this.setState({user: null});
        this.props.history.pushState(null,'/app/scout/' + this.props.params.statsId + '/' + e.target.value + '/history');
    },
    render: function() {
        if (this.state.user == null || this.state.season == null) {
            return null;
        }
        var seasons = [];
        this.state.user.handicapSeasons.forEach(function(s){
            seasons.push(<option key={s.season.id} value={s.season.id}>{s.season.displayName}</option>);
        }.bind(this));

        var selectorSeason  = (<select
                ref='season'
                onChange={this.onChange}
                className="form-control"
                value={this.state.season.id}
                type={'select'}>
                {seasons}
            </select>);

        return (
            <div>
                <div>
                    {selectorSeason}
                </div>
            <div>
                <UserResults user={this.state.user} season={this.state.season} />
            </div>
            </div>
        );
    }
});

module.exports = StatHistory;