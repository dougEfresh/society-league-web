var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var BallIcon = require('../../jsx/components/BallIcon.jsx');

var SeasonNav = React.createClass({
    mixins: [UserContextMixin,Router.State,Router.Navigation],
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
        this.setState({user: this.getUser()});
    },
    _onChange: function () {
        this.setState({user: {}});
    },
    render: function() {
        var user = this.getUser();
        if (user.id == "0") {
            return null;
        }
        var seasons = [];
        user.handicapSeasons.forEach(function(hs) {
            var title = "unknown";

            if (hs.season.name.toLowerCase().indexOf('9-ball') >=0 ) {
                //title = (<div><BallIcon type={"nine"}/> Tue </div>);
                title = (<div>Tue</div>);
            }
            if (hs.season.name.toLowerCase().indexOf('weds') >=0 ) {
                title = (<div>Wed</div>);
                //title = (<div><BallIcon type={'eight'} /> Wed</div>);
            }
            if (hs.season.name.toLowerCase().indexOf('thur') >=0 ) {
                //<BallIcon type={'eight'} />
                 title = (<div>Thu </div>);
            }
            if (hs.season.name.toLowerCase().indexOf('mix') >=0 ) {
//                <BallIcon type={'eight'} />
///                <BallIcon type={'nine'} />

                title = (<div>Mon</div>);
            }
            if (hs.season.name.toLowerCase().indexOf('top') >=0 ) {
                title = (<div>
                    <BallIcon type={'nine'} />
                </div>);
            }

            seasons.push(
                <div key={hs.season.id}>
                <li id={'season-link-'+ hs.season.id} key={hs.season.id} role="presentation">
                    <Link  to="seasonStandings" params={{seasonId: hs.season.id}} >
                        {title}
                    </Link>
                </li>
                </div>
            );
        }.bind(this));

        if (seasons.length == 0){
            return null;
        }
        var clName = "dropdown";
        //if (this.isActive('season')) {
//            clName = clName + " active";
  //      }
        return (
             <li id="season-nav" role="presentation" className={clName} >
                 <a className="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">
                     <span className="fa fa-server"></span>
                     <span className="main-item">Seasons</span>&nbsp;
                     <span className="caret"></span>
                 </a>
                 <ul className="dropdown-menu" role="menu">
                     {seasons}
                 </ul>
             </li>
        );
    }
});

module.exports = SeasonNav;