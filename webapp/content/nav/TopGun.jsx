
var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var TopGunNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    getInitialState: function () {
        return {
            update: Date.now(),
            data: []
        }
    },
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
        this.getData();
    },
    getData: function() {
        Util.getSomeData({url: '/api/team/get/' + this.getUser().id + '/current',
            callback: function(d){
            this.setState({data: d, update: Date.now()});
            }.bind(this),
                module: 'TeamNav',
                router: this.props.router}
        );
    },
    componentWillReceiveProps: function(nextProps) {
        this.getData();
    },
    render: function() {
        if (!this.getUser().challenge) {
            return null;
        }
        var s = null;
        this.getUser().handicapSeasons.forEach(function(hs) {
            if (hs.season.challenge) {
                s = hs.season;
            }
        });
        var topGunCls = "not-active" ; //this.props.location.pathname.indexOf("challenge") > 0 || this.props.params.seasonId == s.id ? "active" : "not-active";
        return(
            <li className={topGunCls + ' dropdown'}>
                <a onClick={this.toggleDivision(s)} href="#">Top Gun<span className="fa arrow"></span></a>
                <ul className={"nav nav-second-level collapse" + (s.toggle ? " selected in" : "")} aria-expanded="true">
                    <li>
                        <a onClick={this.goToChallenge(s)} href="#">Challenge</a>
                    </li>
                    <li>
                        <a onClick={this.goToSchedule(s)} href="#">Schedule</a>
                    </li>
                    <li className='selected'>
                        <a onClick={this.changeSeason(s)}href="#">Standings</a>
                    </li>
                </ul>
            </li>
        );
    }
});

module.exports = TopGunNav;