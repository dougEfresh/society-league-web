var React = require('react/addons');
var Router = require('react-router')
    , History = Router.History
    , Route = Router.Route
    , Link = Router.Link;

var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var Util = require('../../jsx/util.jsx');

var SeasonApp = React.createClass({
    mixins: [UserContextMixin,History],
    getInitialState: function () {
        return {
            update: Date.now(),
            seasons: []
        }
    },
    componentWillMount: function () {
    },
    componentWillUnmount: function () {
    },
    componentDidMount: function () {
        this.getData();
    },
    componentWillReceiveProps: function() {
        var now = Date.now();
        if (now - this.state.update > 1000*60) {
            this.getData();
        }
    },
    getData: function() {
        Util.getData('/api/season/active', function(d){
            this.setState({seasons: d});
        }.bind(this), null, 'SeasonApp');
    },
    onChange: function (e) {
        e.preventDefault();
        if (this.props.location.pathname.indexOf('/standings') >=0 ) {
            this.history.pushState(null,'/app/season/' + e.target.value +'/standings');
            return;
        }

        if (this.props.location.pathname.indexOf('/leaders') >=0 ) {
            this.history.pushState(null,'/app/season/' +  e.target.value +'/leaders');
            return;
        }

        if (this.props.location.pathname.indexOf('/results') >=0 )  {
            this.history.pushState(null,'/app/season/' +  e.target.value +'/results');
            return;
        }
    },
    render: function() {
        if (this.state.seasons.length == 0)
            return null;

        var display = 'inline';
        var seasons = [];
        var season = {};
        if (this.getUser().admin) {
            seasons = this.state.seasons;
             this.state.seasons.forEach(function (s) {
                 if (s.id == this.props.params.seasonId) {
                    season = s;
                }
             }.bind(this));
        } else {
            this.state.seasons.forEach(function (s) {
                this.getUser().handicapSeasons.forEach(function(hs){
                    if (s.id == hs.season.id) {
                        seasons.push(s);
                    }
                }.bind(this));
                if (s.id == this.props.params.seasonId) {
                    season = s;
                }
            }.bind(this))
        }

        var leaders =
            (<Link to={'/app/season/' + this.props.params.seasonId + '/leaders' }>
            <button className={this.props.location.pathname.indexOf('leaders') >0 ? 'btn btn-success' : 'btn btn-default'} >
                <span className="fa  fa-list-ol"></span><span className="main-item">Leaders</span>
            </button>
        </Link>);

        if (season.division != undefined && season.division.indexOf('CHALLENGE')>=0) {
            leaders = null;
        }

        var header = (
                <div className="btn-group bot-margin">
                    <div id={display == 'none' ? 'season-standings-link-hidden' : 'season-standings-link'}
                         style={{display:display}}>
                        <Link to={'/app/season/' + this.props.params.seasonId + '/standings' }>
                            <button className={this.props.location.pathname.indexOf('standings') > 0 ? 'btn btn-success' : 'btn btn-default'}>
                            <span className="fa fa-trophy"></span><span className="main-item">Standings</span>
                            </button>
                        </Link>
                    </div>
                    <Link to={'/app/season/' + this.props.params.seasonId+ '/results' }>
                        <button className={this.props.location.pathname.indexOf('results') > 0 ? 'btn btn-success' : 'btn btn-default'} >
                            <span className="fa  fa-history"></span><span className="main-item">Matches</span>
                        </button>
                    </Link>
                    {leaders}
                </div>
        );

        var options = [];
        seasons = seasons.sort(function(a,b){
            return b.startDate.localeCompare(a.startDate);
        });
        seasons.forEach(function(s) {
            options.push(<option key={s.id} value={s.id}>{s.displayName}</option>);
        });
        if (this.props.params.seasonId == undefined) {
            setTimeout(function(){
                this.history.pushState(null,'/app/season/' +  seasons[0].id + '/standings');
            }.bind(this),250);
            return null;
        }
        return (
            <div id={'season-app'} className="panel panel-default">
                    <div className="panel-heading">
                        <select
                            ref='season'
                            onChange={this.onChange}
                            className="form-control"
                            value={this.props.params.seasonId}
                            type={'select'}>
                            {options}
                         </select>
                        {header}
                    </div>
                    <div className="panel-body">
                        {this.props.children}
                    </div>
            </div>
        );
    }
});

module.exports = SeasonApp;

