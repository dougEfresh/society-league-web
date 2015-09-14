var React = require('react/addons');

var BallIcon = React.createClass({
    getDefaultProps: function(){
        return {
            type: "eight"
        }
    },
    getEight: function() {
        return  <span className="badge eightBall">8</span>;
    },

    getNine: function() {
        return  <span className="badge nineBall">9</span>;
    },
    render: function() {
        if (this.props.type.toLowerCase().indexOf('eight') >=0) {
            return this.getEight();
        }
        return this.getNine();
    }
});

module.exports = BallIcon;