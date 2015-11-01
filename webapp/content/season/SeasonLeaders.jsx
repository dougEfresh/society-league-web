var React = require('react/addons');
var Router = require('react-router')
    , RouteHandler = Router.RouteHandler
    , Link = Router.Link;
var DataGrid = require('react-datagrid')
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var UserLink = require('../../../webapp/jsx/components/links/UserLink.jsx');
var TeamLink = require('../../../webapp/jsx/components/links/TeamLink.jsx');
var Util = require('../../jsx/util.jsx');
var LoadingApp = require('../../jsx/components/LoadingApp.jsx');
var UserResults = require('../../jsx/components/result/UserResults.jsx');
var Handicap = require('../../lib/Handicap');
var teamRender = function(v,d,cp) {return <TeamLink team={v} /> }
//var userRender = function(v,d,cp) {return <UserLink user={d.user} /> }
var userRender = function(v,d,cp) {return d.user.name};
var  nineMobileColumns = [
    { name: 'index', title: '#', width: 40 },
    { name: 'name', flex: 1, render: userRender , width: 100},
    { name: 'handicap', title: 'HC', width:50 , flex: 1, render: function(v) {return Handicap.formatHandicap(v)}},
    { name: 'team', flex: 1 , width: 100, render: teamRender },
    { name: 'wins',  width: 40  ,title: 'W', flex: 1, type: 'number' },
    { name: 'loses', width: 40 ,title: 'L', flex: 1 , type: 'number'},
    { name: 'racksWon', width: 50 ,title: 'RW', flex: 1, type: 'number' },
    { name: 'racksLost',width: 50 , title: 'RL', flex: 1 ,type: 'number'}
];

var  nineColumns = [
    { name: 'index', title: '#', width: 40 },
    { name: 'name', flex: 1, render: userRender , width: 100},
    { name: 'handicap', title: 'HC', flex: 1, render: function(v) {return Handicap.formatHandicap(v)}},
    { name: 'wins',  title: 'W', flex: 1, type: 'number' },
    { name: 'loses', title: 'L', flex: 1 , type: 'number'},
    { name: 'racksWon' ,title: 'RW', flex: 1, type: 'number' },
    { name: 'racksLost', title: 'RL', flex: 1 ,type: 'number'},
    { name: 'team', flex: 1 , render: teamRender }
];
var sorty  = require('sorty');
var SORT_INFO = [ { name: 'index', dir: 'asc'}];

var SeasonLeaders = React.createClass({
    mixins: [UserContextMixin],
    getDefaultProps: function() {
        return {limit: 100}
    },
    getInitialState: function() {
        return {
            update: Date.now(),
            stats: [],
            season: null,
            selectedUser: null,
            loading: true,
            toggleLeaders: true
        }
    },
    getData: function(id) {
        var cb = function (d) {
            var ind = 1;
            d.forEach(function(s){
                s.id = s.user.id;
                s.index = ind++;
            });

            this.setState({stats: d, season: d.length > 0 ? d[0].season : null, loading: false});
        }.bind(this);
        Util.getSomeData({ url: '/api/stat/season/players/' + id,
            callback: cb,
            module: 'SeasonLeaders',
            router: this.props.history
        })
    },
    componentDidMount: function () {
        this.getData(this.props.params.seasonId);
    },
    componentWillReceiveProps: function(n) {
        if (n.params.seasonId != this.props.params.seasonId) {
            this.getData(n.params.seasonId);
        }
    },
    handleFilter: function(column, value, allFilterValues){
		//reset data to original data-array
	    data = data1000

	    //go over all filters and apply them
    	Object.keys(allFilterValues).forEach(function(name){
    		var columnFilter = (allFilterValues[name] + '').toUpperCase()

    		if (columnFilter == ''){
    			return
    		}

    		data = data.filter(function(item){
    		    if ((item[name] + '').toUpperCase().indexOf(columnFilter) === 0){
    		        return true
    		    }
    		})
    	});
	    this.setState({});
	},
    handleSortChange: function(sortInfo){
		SORT_INFO = sortInfo

		data = [].concat(data1000)
		data = sort(data)

		this.setState({})
	},
	handleColumnOrderChange: function (index, dropIndex){
		var col = columns[index]
		columns.splice(index, 1) //delete from index, 1 item
		columns.splice(dropIndex, 0, col)
		this.setState({})
	},
    onSelectionChange: function(newSelectedId, data){
        console.log('Selected ' + data.user.id);
		this.setState({selectedUser: data.user});
	},
    render: function() {
        if (this.state.stats.length == 0) {
             return (<DataGrid
				idProperty='id'
				columns={nineColumns}
				style={{height: 200}}
                loading={true}
			/>);
        }
        return (
            <div className="row">
                <div className="col-xs-12 col-md-4">
                    <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                        <div className="panel panel-default panel-leaders">
                            <div className="panel-heading" role="tab" id="headingOne">
                                <h4 className="panel-title">
                                    {this.state.season.displayName  +' Leaders'}
                                    <a href="#" >
                                        <span className={"fa arrow" + (this.state.toggleSeason ? " active" : "")}></span>
                                    </a>
                                </h4>
                            </div>
                            <div className={"panel-collapse " + (this.state.toggleLeaders ? "show" : "collapse") } role="tabpanel" aria-labelledby="headingOne">
                                <div className="panel-body">
                                    <DataGrid
                                        idProperty='id'
                                        dataSource={this.state.stats}
                                        columns={nineColumns}
                                        onSelectionChange={this.onSelectionChange}
                                        selected={this.state.selectedUser == null ? null : this.state.selectedUser.id}

                                        //style={{height: 700}}
                                        //onFilter={this.handleFilter}
                                        //liveFilter={true}
                                        //sortInfo={SORT_INFO}
                                        //onSortChange={this.handleSortChange}
                                        //onColumnOrderChange={this.handleColumnOrderChange}
                                        showCellBorders={true}
                                        showRowBorders={true}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-md-4">
                    <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                        <div className="panel panel-default panel-results">
                            <div className="panel-heading" role="tab" id="headingOne">
                                <h4 className="panel-title">
                                    {this.state.selectedUser != null ? this.state.selectedUser.firstName + " Results" : ""}
                                    <a href="#" >
                                        <span className={"fa arrow" + (this.state.toggleSeason ? " active" : "")}></span>
                                    </a>
                                </h4>
                            </div>
                            <div className={"panel-collapse " + (this.state.toggleLeaders ? "show" : "collapse") } role="tabpanel" aria-labelledby="headingOne">
                                <div className="panel-body">
                                    <UserResults user={this.state.selectedUser} season={this.state.season} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = SeasonLeaders;
