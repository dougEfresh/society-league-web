var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;
var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');

var StatNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    render: function() {
        var active = "";
        if (this.context.location.pathname.indexOf("stat") >=0) {
            active = "active";
        }
        return (
            <li id="stat-nav" className={"main-item dropdown " + active} >
                <Link className='scoutNav' to='stats' params={{statsId: this.getUser().id}}>
                    <span className="fa fa-bar-chart"/>
                    <span className="main-item">Stats</span>&nbsp;
                </Link>
            </li>
        );
    }
});

module.exports = StatNav;