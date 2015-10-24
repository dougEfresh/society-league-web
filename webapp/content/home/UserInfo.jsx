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
                    record = (
                        <div style={{display: 'inline'}} className="ss-label-group">
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
        var lnk = null;
        if (user.profile) {
            var query = '?';
            if (this.props.height)
                query += 'height=' + this.props.height + '&';
            if (this.props.width)
                query += 'height=' + this.props.width + '&';
            if (this.props.type)
                query += 'type=' + this.props.type + '&';

            lnk = (
                <Link to={'/app/scout/' + user.id + '/stats'}>
                    <img src={user.userProfile.imageUrl + query}> </img>
                    {user.firstName}
                </Link>
            );
        } else {
            lnk = (<Link to={'/app/scout/' +user.id + '/stats'}> <span className="glyphicon glyphicon-user"></span>{'user.firstName} </Link>);
        }
        //lnk = (<Link to={'/app/scout/' +user.id + '/stats'}> <span className="glyphicon glyphicon-user"></span>{user.firstName} </Link>);
        return (
            <div className="welcome-wrap">
                <h2 className="welcome" >
                    {lnk}
                </h2>
                {record}
            </div>
        );
    }
});

module.exports = UserInfo;