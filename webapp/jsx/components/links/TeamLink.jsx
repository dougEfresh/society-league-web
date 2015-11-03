var React = require('react/addons');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router')
    ,Link = Router.Link;
var UserContextMixin = require('../../mixins/UserContextMixin.jsx');
var UserLink = require('./UserLink.jsx');

var TeamLink = React.createClass({
    mixins: [UserContextMixin,Router.History],
    propTypes: {
        team: ReactPropTypes.object.isRequired
    },
    getDefaultProps: function(){
        return {
            team: null
        }
    },
    toString: function() {
        return this.props.team.name;
    },
    render: function() {
        if (this.props.team == null) {
            return null;
        }
        //Challenge users should point to UserLink
        if (this.props.team.challengeUser != undefined && this.props.team.challengeUser != null ) {
            return <UserLink user={this.props.team.challengeUser} season={this.props.team.season.id} />;
        }

        /*
        if (this.props.onClick)
        return (
            <a onClick={this.props.onClick} className="teamLink" href='#'>
                {this.props.team.name}
            </a>
        );
        */
        var name = this.props.team.name;
        //if (this.props.team.rank < 4) {
            name = <div style={{display: 'inline'}}><span>{this.props.team.name}</span><span className={'badge rank rank-' + this.props.team.rank}>{this.props.team.rank}</span></div>
        //}

        //if (this.props.noRank != undefined)
            name = this.props.team.name;
        if (this.props.onClick != null && this.props.onClick != undefined) {
            return (<div className="team-link"> <a onClick={this.props.onClick} href='#'>{name}</a></div>);
        }
        return (<div className="team-link"><Link to={'/app/display/' + this.props.team.season.id + '/' + this.props.team.id}>{name}</Link></div>);
    }
});

module.exports = TeamLink;