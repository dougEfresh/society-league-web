var React = require('react/addons');
var UserLink = require('../jsx/components/links/UserLink.jsx');
var TeamLink = require('../jsx/components/links/TeamLink.jsx');

var DataGrid = React.createClass({
    getDefaultProps: function (){
        return {limit: 100};
    },
    componentWillReceiveProps: function(){
        this.forceUpdate();
    },
    getHeader: function() {
        var rows = [];
        var cnt =0;
        this.props.columns.forEach(function(c) {
            if (c.width != undefined)  {
                rows.push(<th key={cnt++} style={{width: c.width}}>{c.title}</th>);
            } else {
                rows.push(<th key={cnt++}>{c.title}</th>);
            }
        }.bind(this));
        return (<tr>{rows}</tr>);
    },
    getRows: function() {
        var rows = [];
        for(var i = 0 ; i < this.props.dataSource.length && i < this.props.limit; i++) {
            var td = [];

            var d = this.props.dataSource[i];
            this.props.columns.forEach(function(c) {
                var style={};
                if (c.width != undefined) {
                    style.width = c.width;
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