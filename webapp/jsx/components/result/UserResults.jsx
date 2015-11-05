var React = require('react/addons');
var UserLink = require('../links/UserLink.jsx');
var Util = require('../../util.jsx');
var Handicap = require('../../../lib/Handicap');
var SeasonLink = require('../links/SeasonLink.jsx');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Route = Router.Route
    , Link = Router.Link;
var ReactDataGrid = require('react-datagrid');
var sorty = require('sorty');
var DataGridUtil = require('../../../lib/DataGridUtil.jsx');

var UserResults = React.createClass({
     getInitialState: function() {
         return {
             results: [],
             stats: [],
             user: this.props.user,
             season: this.props.season
        }
    },
    componentDidMount: function() { this.getData();  },
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.user == undefined || nextProps.season == undefined) {
            this.setState({user:null});
            return;
        }
        if (this.state.user == undefined || this.state.season == undefined || this.state.season == null || this.state.user == null) {
            this.state.user = nextProps.user;
            this.state.season = nextProps.season;
            this.getData();
            return;
        }
        if (this.state.user.id != nextProps.user.id  || this.state.season.id != nextProps.season.id ){
            this.state.user = nextProps.user;
            this.state.season = nextProps.season;
            this.getData();
            return;
        }

    },
    getData: function() {
        if (this.state.user == null || this.state.user == undefined || this.state.season == null || this.state.season == undefined) {
            return ;
        }
        Util.getSomeData(
            { url:'/api/playerresult/user/' + this.state.user.id + '/' + this.state.season.id,
                callback: function(d){this.setState({results: d});}.bind(this), module: 'UserResult'}
        );
        Util.getSomeData({url: '/api/stat/user/' + this.state.user.id  + '/' + this.state.season.id,
            callback: function(d){this.setState({stats: d});}.bind(this), module: 'UserResult'}
        );
    },
    render: function() {
        if (this.state.user == null || this.state.user == undefined || this.state.results.length == 0 || this.state.stats.length == 0) {
            return null;
        }
        return (
            <div id="user-results">
                <SeasonResults limit={this.props.limit}
                               stats={this.state.stats}
                               season={this.state.season}
                               results={this.state.results}
                               onUserClick={this.props.onUserClick}
                    />
                </div>
        );

    }
});

var SeasonResults =  React.createClass({
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        if (this.props.season.challenge) {
            return <ResultChallenge onUserClick={this.props.onUserClick} stats={this.props.stats} season={this.props.season} results={this.props.results} limit={this.props.limit} />
        } else if (this.props.season.nine) {
            return <ResultNine onUserClick={this.props.onUserClick} stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />
        } else if (this.props.season.scramble) {
            return <ResultScramble onUserClick={this.props.onUserClick} stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />;
        }
        return <ResultEight onUserClick={this.props.onUserClick} stats={this.props.stats} season={this.props.season} results={this.props.results}limit={this.props.limit}  />;
    }
});

var ResultScramble = React.createClass({
     getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;

        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            rows.push(
                <tr key={r.id}>
                    <td className={"racks win-lost " + (r.win ? "win" : "lost")}>{r.win ? 'W' : 'L'}</td>
                    <td className="user"><UserLink onClick={this.props.onUserClick(r.opponent)} type={'small'} user={r.opponent}  /></td>
                    <td className="user" ><UserLink type={'small'} user={r.opponentPartner}  /></td>
                    <td className="date"><Link to={'/app/schedule/'  + r.season.id  + '/' + r.teamMatch.id}>{Util.formatDateTime(r.teamMatch.matchDate)}</Link></td>
                    <td className="hc" >{Handicap.formatHandicap(r.teamMemberHandicap)}</td>
                </tr>);
        }
           var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);
        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }

        return (
             <div className="table-responsive">
                 <table className={ Util.tableCls + " table-users"} >
                     <thead>
                     <tr>
                         <th className="racks">W/L</th>
                         <th>Opponent</th>
                         <th>Opponent</th>
                         <th>Date</th>
                         <th className="racks hc">HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});


var ResultEight = React.createClass({
     getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;
        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            rows.push(
                <tr key={r.id}>
                    <td className="date"><Link to={'/app/schedule/'  + r.season.id  + '/' + r.teamMatch.id}>{Util.formatDateTime(r.teamMatch.matchDate)}</Link></td>
                    <td className={"racks win-lost " + (r.win ? "win" : "lost")}>{r.win ? 'W' : 'L'}</td>
                    <td className="user"><UserLink onClick={this.props.onUserClick(r.opponent)} season={r.teamMatch.home.season} type={'small'} user={r.opponent} /></td>
                    <td className="hc op-hc">{Handicap.formatHandicap(r.opponentHandicap)}</td>
                    <td className="hc">{Handicap.formatHandicap(r.teamMemberHandicap)}</td>
                </tr>);
        }
           var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);
        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }

        return (
             <div className="table-responsive">
                 <table className={ Util.tableCls + " table-users"} >
                     <thead>
                     <tr>
                         <th>Date</th>
                         <th className="racks">W/L</th>
                         <th>Op.</th>
                         <th>Op. HC</th>
                         <th className="racks hc">HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});

var SORT_INFO = [ { name: 'date', dir: '-1'}];
function sort(arr){
	return sorty(SORT_INFO, arr)
}


var ResultNine = React.createClass({
    getDefaultProps: function() {
        return {season : null, results:[], originalRows: [] };
    },
    getInitialState: function() {
        this.props.results.forEach(function(r) {
            r.opponent.onUserClick = this.props.onUserClick(r.opponent);
        }.bind(this));
        return {
            results: this.props.results,
            originalRows: this.props.results
        }
    },
    componentWillReceiveProps: function(n){
        n.results.forEach(function(r) {
            r.opponent.onUserClick = this.props.onUserClick(r.opponent);
        }.bind(this));
        this.setState({
            results: n.results,
            originalRows: n.results
        });
    },
    handleSortChange: function(sortInfo) {
        console.log(JSON.stringify(sortInfo));
        SORT_INFO = sortInfo;
        this.state.results = [].concat(this.state.results);
        this.state.results = sorty(sortInfo,this.state.results);
        this.setState({});
    },
    render: function() {
        var limit = this.props.limit == null ? this.state.results.length : this.props.limit;
        var columns = [
            DataGridUtil.columns.playerMatchDate,
            DataGridUtil.columns.result,
            DataGridUtil.columns.score,
            DataGridUtil.columns.race,
            window.isMobile ? DataGridUtil.columns.opponentMobile: DataGridUtil.columns.opponent,
            //DataGridUtil.columns.opponentMobile,
            DataGridUtil.columns.opponentHandicap,
            DataGridUtil.columns.teamMemberHandicap
        ];

        if (this.state.results.length == 0) {
                    return (
            <div className="table-responsive">
                <ReactDataGrid
				idProperty='id'
                loading={true}
				dataSource={this.state.results}
				columns={columns}
				//style={{height: ((this.state.results.length + 1) * 50 < 500 ? (this.state.results.length + 1) * 50 : 500)}}
                rowHeight={40}
                showCellBorders={true}
                sortInfo={SORT_INFO}
				//sortInfo={SORT_INFO}
				onSortChange={this.handleSortChange}
				//onColumnOrderChange={this.handleColumnOrderChange}
                    />
            </div>);

        }

        return (
            <div className="table-responsive">
                <ReactDataGrid
				idProperty='id'
				dataSource={this.state.results}
				columns={columns}
				style={{height: ((this.state.results.length) * 50 < 500 ? (this.state.results.length ) * 50 : 500)}}
                rowHeight={40}
                showCellBorders={true}
                filterable={false}
                columnMinWidth={50}
                cellPadding={'0px 0px'}
                headerPadding={'0px 0px'}
                filterIconColor={'#6EB8F1'}
                menuIconColor={'#6EB8F1'}
				sortInfo={SORT_INFO}
				onSortChange={this.handleSortChange}
                loadMaskOverHeader={false}
                cellEllipsis={false} liveFilter={false}
                styleAlternateRowsCls={'datagrid-alt-row'}
                menuIcon={false}
                filterIcon={false}
                scrollbarSize={(this.state.results.length) * 50 < 500 ? 0 : 20}
				//onColumnOrderChange={this.handleColumnOrderChange}
			/>
                </div>);

        /*
        return (
         <div className="table-responsive">
            <ReactDataGrid
                columns={columns}
                enableCellSelect={false}
                onGridSort={this.handleGridSort}
                rowGetter={rowGetter}
                rowHeight={40}
                rowsCount={this.state.results.length}
                minHeight={this.state.results.length * 35 > 500 ? 500 : this.props.results.length * 70}
                height={this.state.results.length * 35 > 500 ? 500 : this.props.results.length * 70}
                />
            </div>
        );
        */
        /*
        return (

                 <table className={ Util.tableCls + " table-users"} >
                     <thead>
                     <tr>
                         <th>Date</th>
                         <th className="racks">W/L</th>
                         <th className="score">S</th>
                         <th className="race" >Race</th>
                         <th>Op.</th>
                         <th>Op. HC</th>
                         <th className="ranks hc">HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );
*/
    }
});

var ResultChallenge = React.createClass({
    getDefaultProps: function() {
        return {season : null, results: []};
    },
    render: function() {
        var rows = [];
        var limit = this.props.limit == null ? this.props.results.length : this.props.limit;
        for (var i = 0; i< limit && i< this.props.results.length; i++ ) {
            var r = this.props.results[i];
            if (r == undefined) {
                continue;
            }
            rows.push(<tr key={r.id}>
                <td className="date" >
                   <Link to={'/app/schedule/'  + r.season.id  + '/' + r.teamMatch.id}>{Util.formatDateTime(r.teamMatch.matchDate)}</Link>
                </td>
                <td className={"racks " + (r.win ? "win" : "lost") }  >{r.win ? 'W' : 'L'}</td>
                <td className="points">{r.matchPoints ? r.matchPoints.points : '0'}</td>
                <td className="points">{r.matchPoints ? r.matchPoints.weightedAvg.toFixed(3) : '0'}</td>
                <td className="racks">{r.matchPoints ? r.matchPoints.matchNum : '0'}</td>
                <td className="formula">{r.matchPoints ? r.matchPoints.calculation  : ''}</td>
                <td className={"score" + (r.hill ? " hill" : "")} >{r.score}</td>
                <td className={"user"}>
                    <UserLink onClick={this.props.onUserClick(r.opponent)} season={r.season} type={'small'} user={r.opponent} handicap={r.opponentHandicap} season={r.season.id} /></td>
                <td className="hc">{Handicap.formatHandicap(r.teamMemberHandicap)}</td>
                </tr>);
        }
        var statDisplay = (<div>
                <span className="label label-success">{'W:' + this.props.stats.wins} </span>
                <span className="label label-danger">{'L:' + this.props.stats.loses} </span>
            </div>);

        if (this.props.stats.wins == undefined || this.props.stats.wins+this.props.stats.loses <= 0){
            statDisplay = null;
        }
        return (
             <div className="table-responsive">
                 <table className="table table-users table-bordered table-striped table-condensed" >
                     <thead>
                     <tr>
                         <th className="date">Date</th>
                         <th>W/L</th>
                         <th className="racks points">P</th>
                         <th>Avg P</th>
                         <th className="racks rank">#</th>
                         <th>Formula</th>
                         <th>Score</th>
                         <th>Opponent</th>
                         <th className="racks hc">HC</th>
                     </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
             </div>
        );

    }
});


module.exports = UserResults;
