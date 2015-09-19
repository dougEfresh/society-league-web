var React = require('react/addons');
var Router = require('react-router')
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var BallIcon = require('../../jsx/components/BallIcon.jsx');

var SeasonNav = React.createClass({
    mixins: [UserContextMixin],
    contextTypes: {
        location: React.PropTypes.object
    },
    componentWillMount: function ()
    {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
    },
    render: function() {
        var user = this.getUser();
        if (user.id.length < 2) {
            return null;
        }
        var clName = "dropdown";
        if (this.context.location.pathname.indexOf('/app/season')>=0) {
            clName = clName + " active";
        }
        return (
             <li id="season-nav" role="presentation" className={clName} >
                 <Link className='season-nav' to={'/app/season'}>
                     <span className="fa fa-server"></span>
                     <span className="main-item">Seasons</span>&nbsp;
                 </Link>
             </li>
        );
    }
});

module.exports = SeasonNav;