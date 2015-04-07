var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Bootstrap = require('react-bootstrap')
    ,Input = Bootstrap.Input
    ,Badge = Bootstrap.Badge
    ,ButtonGroup = Bootstrap.ButtonGroup
    ,DropdownButton = Bootstrap.DropdownButton
    ,MenuItem = Bootstrap.MenuItem
    ,SplitButton = Bootstrap.SplitButton;

var ChallengeActions = require('../../actions/ChallengeActions.jsx');

var ChallengeRequestGame = React.createClass({
    propTypes: {
        game: ReactPropTypes.object.isRequired
    },
    update: function(props) {
    },
    componentWillReceiveProps: function(props) {
      // console.log(JSON.stringify(props));
    },
    componentDidMount: function() {
    },
    onChange: function() {
        var g = this.props.game;
        ['nine','eight'].forEach(function(type) {
                g[type].selected = this.refs[type] ? this.refs[type].getChecked() : false;
            }.bind(this)
        );
        ChallengeActions.setGame(g);
    },
    getLabel: function(type) {
        return (<Badge>{type == 'nine' ? '9' : '8'}</Badge>);
    },
    getOptions: function() {
        var options = [];
        ['nine','eight'].forEach(function(type) {
            if (this.props.game[type].available) {
                options.push(
                    <Input key={type}
                           className={type}
                           ref={type}
                           type='checkbox'
                           label={this.getLabel(type)}
                           onChange={this.onChange}
                        />
                );
            }
        }.bind(this));
        return options;
    },
    onSelect: function(type,h,t) {
        var g = this.props.game;
        g[type].selected = !g[type].selected;
        ChallengeActions.setGame(g);
    },
    getTitle: function() {
        var g = this.props.game;
        if (g.nine.selected && g.nine.selected ) {
            return 'Game: 8 or 9'
        }
        if (g.nine.selected) {
            return 'Game: 9'
        }
        if (g.eight.selected) {
            return 'Game: 8'
        }

        return 'Choose Game';
    },
    render: function() {
        var g = this.props.game;
        var disp = g.nine.available && g.eight.available  ? 'inline' : 'none';
        var eight = g.eight.selected ? (<i className="fa fa-check">8</i>) :  (<i className="fa fa-times">8</i>);
        var nine = g.nine.selected ? (<i className="fa fa-check">9</i>) :  (<i className="fa fa-times">9</i>);
        debugger;
        return (
            <div style={{display: disp}}>
                <SplitButton bsStyle={'primary'} title={this.getTitle()} >
                    <MenuItem eventKey='eight' onSelect={this.onSelect} >{eight}</MenuItem>
                    <MenuItem eventKey='nine'  onSelect={this.onSelect} >{nine}</MenuItem>
                </SplitButton>
            </div>
        );
    }
});
module.exports = ChallengeRequestGame;
