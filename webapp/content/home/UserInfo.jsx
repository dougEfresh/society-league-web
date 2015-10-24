var React = require('react/addons');
var Router = require('react-router');
var Link = Router.Link;
var Util = require('../../jsx/util.jsx');
var UserLink = require('../../jsx/components/links/UserLink.jsx');

var UserInfo = React.createClass({
    componentDidMount: function () {},
    componentWillReceiveProps: function (n) {},
    render: function () {
        var user = this.props.user;
        var record = null;
        if (user == null || this.props.stats.length == 0) {
            return null;
        }
        if (this.props.stats.length > 0) {
            this.props.stats.forEach(function(s){
                if (s.type == 'ALL') {
                    record = (<div style={{display: 'inline'}} className="ss-label-group">
                        <ul>
                            <li className="ss-label-win">W</li>
                            <li className="ss-label-default">{s.wins}</li>
                        </ul>
                        <ul>
                            <li className="ss-label-lose">L</li>
                            <li className="ss-label-default">{s.loses}</li>
                        </ul>
                    </div>);
                }

            });
        }
        var season = null;
        user.handicapSeasons.forEach(function(s){
            if (s.season.active)
                season = s.season;
        });
        var img = <UserLink user={user} season={season} type={'normal'} />;
        if (!user.userProfile) {
             img = <span className="glyphicon glyphicon-user"></span>;
        }
        return (
            <div className="welcome-wrap">
                <h2 className="welcome" >
                    {img}
                </h2>
                {record}
            </div>
        );
    }
});

module.exports = UserInfo;