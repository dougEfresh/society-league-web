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
        if (this.context.location.pathname.indexOf("stat") >=0 ) {
            active = "active";
        }
        return (
        <li className="hide selected">
            <a  href="#"><i className="fa fa-fw fa-bar-chart-o"></i>Stats
                <span className="fa arrow"></span>
            </a>
            <ul className={"nav nav-second-level collapse"}>
                <li>
                    <a href="#">Current</a>
                </li>
                <li>
                    <a href="#">Historic</a>
                </li>
            </ul>
        </li>
        );
    }
});

module.exports = StatNav;