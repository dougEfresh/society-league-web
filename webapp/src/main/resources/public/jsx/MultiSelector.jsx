var React = require('react/addons');
var Util = require('./util.jsx');
var Bootstrap = require('react-bootstrap');
var Input = Bootstrap.Input;
var Label = Bootstrap.Label;
var Button = Bootstrap.Button;
var ListGroup = Bootstrap.ListGroup;
var ListGroupItem = Bootstrap.ListGroupItem;
var PanelGroup = Bootstrap.PanelGroup;
var Panel = Bootstrap.Panel;

var MultiSelector = React.createClass({
    getInitialState: function () {
        return {
            data: [],
            selected: {
                chosen: [], //Array of strings
                chosenIds: [] //Array of objects
            },
            filtered: []
        }
    },
    resolveIds: function(chosen,available) {
        if (chosen == null || chosen == undefined ||  available == null ||  available == undefined)
            return [] ;

        var ids = [];
        chosen.forEach(function(name) {
            for(var i = 0; i < available.length ; i++) {
                if (available[i].name == name) {
                    ids.push(available[i].id);
                    break;
                }
            }
        });
        return ids;
    },
    getValue: function() {
        return this.state.selected.chosenIds;
    },
    isValid: function() {
        return this.state.selected != null && this.state.selected.chosen.length > 0;
    },
    onChange: function() {
        var selected = this.refs[this.props.label].getValue();
        var chosen = this.state.selected.chosen;
        if (selected !== null) {
            //Add what was selected, but exclude a selected item if it was already 'chosen'
            var alreadyExists = function(s) {
                var exists = false;
                chosen.forEach(function(c) {
                    if (c == s) {
                        exists = true;
                    }
                });
                return exists;
            };
            selected.forEach(function (s) {
                if (!alreadyExists(s)) {
                    chosen.push(s);
                }
            });
        }
        this.state.selected.chosen = chosen;
        chosen = chosen.sort();
        var state = {selected: {chosen: chosen, chosenIds: this.resolveIds(chosen,this.state.data)} };
        this.setState(
            state
        );

        if (this.props.onChange !== undefined) {
            this.props.onChange();
        }
    },
    componentDidMount: function () {
        Util.getData(this.props.url, function (d) {
            var list = [];
            d.forEach(function(d) {
                list.push(<option key={d.id} value={d.name}>{d.name}</option>)
            });
            this.setState({ data : d , list: list});
        }.bind(this));
    },
    onRemove: function(item) {
        var name = item.target.textContent;
        var chosen = this.state.selected.chosen;
        var newChosen = [];
        chosen.forEach(function(c) {
            if (c != name) {
                newChosen.push(c);
            }
        });
        this.setState({selected: {chosen: newChosen, chosenIds: this.resolveIds(newChosen,this.state.data)} });
    },
    handleFilter: function(e) {
        var list = [];
        this.state.data.forEach(function(d) {
            if (d.name.indexOf(e.target.value) === -1)
                return;
            list.push(<option key={d.id} value={d.name}>{d.name}</option>)
        });
        this.setState({list: list});
    },
    render: function() {
        var disp = this.state.selected.chosen.length === 0  ? 'none' : 'inline';
        var chosen = [];
        this.state.selected.chosen.forEach(function(c) {
            var removeIcon = (<i className="fa fa-times" ><div style={{display: 'none'}}>{c}</div></i>);
            chosen.push(<ListGroupItem  key={c}><Button onClick={this.onRemove}>{removeIcon}</Button>{c}</ListGroupItem>);
        }.bind(this));

        var chosenGroup = (
            <div style={{display: disp}}>
            <ListGroup label={"Chosen"}>
                {chosen}
            </ListGroup>
            </div>);
        return (
            <div>
                <Input className={'multi-select-filter'} type={'text'} ref={'search'} onChange={this.handleFilter} placeholder={'Filter...'} />
                {chosenGroup}
                <Input className={'multi-select'} ref={this.props.label} onChange={this.onChange} multiple help="Help Me" type="select" label={this.props.label}>{this.state.list}</Input>

            </div>
        );
    }
});

module.exports = MultiSelector;