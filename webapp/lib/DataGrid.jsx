var React = require('react/addons');
var UserLink = require('../jsx/components/links/UserLink.jsx');
var TeamLink = require('../jsx/components/links/TeamLink.jsx');

var DataGrid = React.createClass({
    getDefaultProps: function (){
        return {limit: 100};
    },
    getInitialState: function() {
        return {loading: false, dataSource : this.props.dataSource, sortColumn: this.props.defaultSortColumn}
    },
    componentWillReceiveProps: function(n){
        this.setState({dataSource: n.dataSource});
    },
    defaultSort: function(c){
        return function(e) {
            e.preventDefault();
            if (this.props.sortFn && c.sort != undefined) {
                c.sort = c.sort == 'asc' ? 'dsc' :'asc';
                var ds = this.state.dataSource;
                this.setState({loading: true, dataSource: []});
                setTimeout(
                    function(){
                        var start = Date.now();
                        this.props.sortFn(c, ds);
                        console.log(' Sorting took ' + (Date.now() - start) + ' ' + JSON.stringify(c));
                        this.setState({loading: false, dataSource: ds, sortColumn: c.name });
                        }.bind(this),
                    700
                );
            }
        }.bind(this);
    },
    getHeader: function() {
        var rows = [];
        var cnt =0;
        this.props.columns.forEach(function(c) {
            var style={};
            if (c.width != undefined) {
                style.width = c.width;
            }
            var sortIcon  = null;
            if (c.name == this.state.sortColumn) {
                if (c.sort != undefined && c.sort == 'asc') {
                    if (!c.number)
                        sortIcon = <span className="glyphicon  glyphicon-sort-by-alphabet"></span>
                    else
                        sortIcon = <span className="glyphicon  glyphicon-sort-by-order"></span>
                }
                if (c.sort != undefined && c.sort == 'dsc') {
                     if (!c.number)
                        sortIcon = <span className="glyphicon  glyphicon-sort-by-alphabet-alt"></span>
                    else
                        sortIcon = <span className="glyphicon  glyphicon-sort-by-order-alt"></span>
                }
            }
            rows.push(
                <th key={cnt++} style={style}>
                    <a style={{color: 'black', cursor: 'pointer'}}
                       onClick={this.defaultSort(c)}>
                        {c.title + " "}
                        <div style={{display: 'inline'}} className="sort-icon">{sortIcon}</div>
                    </a>
                </th>);
        }.bind(this));
        return (<tr>{rows}</tr>);
    },
    getRows: function() {
        var rows = [];
        for(var i = 0 ; i < this.state.dataSource.length && i < this.props.limit; i++) {
            var td = [];

            var d = this.state.dataSource[i];
            this.props.columns.forEach(function(c) {
                var style={};
                if (c.width != undefined ) {
                    style.width = c.width;
                }
                if (c.style != undefined) {
                    style = c.style;
                }
                var cp={className: ""};
                if (c.render){
                    var r = c.render(d[c],d,cp);
                    td.push(<td className={cp.className} style={style} key={c.name}>{r}</td>);
                }
                else {
                    td.push(<td style={style} key={c.name}>{d[c.name]}</td>);
                }
            });

            if (this.props.rowStyle) {
                var style={};
                var cls= {className: ""};
                this.props.rowStyle(d,cls,style);
                rows.push(<tr style={style} className={cls.className} key={i}>{td}</tr>)
            } else {
                rows.push(<tr key={i}>{td}</tr>)
            }
        }
        return rows;
    },
    render: function() {
        var cls = this.props.cls ? this.props.cls : "";
        if (this.props.loading || this.state.loading) {
            return (
                <div style={{height: 200}} className="text-center loading">
                    <span className="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
                </div>
            );
        }

        return (
            <div className="table-responsive" >
                <table className={"table table-bordered table-condensed table-striped table-grid "  + cls}>
                    <thead>{this.getHeader()}</thead>
                    <tbody>{this.getRows()}</tbody>
                </table>
            </div>
        );
    }
});

module.exports = DataGrid;