var React = require('react/addons');
var Router = require('react-router');
var GroupSlot = React.createClass({
    mixins: [Router.State,Router.Navigation],
    onSelectSlot: function(e) {
        e.preventDefault();
        var q = this.getQuery();
        q.id = this.props.challengeGroup.getId();
        q.selectedSlot = React.findDOMNode(this.refs.slot).value;
        this.transitionTo(this.getPathname(),this.getParams(),q);
    },
    renderNoSelect: function() {
        var slots = [];
        if ( this.props.challengeGroup.selectedSlots != undefined) {
            this.props.challengeGroup.selectedSlots.forEach(function (s) {
                slots.push(<span className="label label-default" key={s.id}>{s.getTime()}</span>);
            }.bind(this));
        } else {
            this.props.challengeGroup.slots.forEach(function (s) {
                slots.push(<span className="label label-default" key={s.id}>{s.getTime()}</span>);
            }.bind(this));
        }

        return slots;
    },
    renderSelectOptions: function(){
        if (this.props.challengeGroup.slots.length == 1) {
            return (<span className="label label-default">{this.props.challengeGroup.slots[0].getTime()}</span>);
        }
        var slots = [];
        slots.push(<option key={0} value={0}>{'choose'}</option>);
        var sorted = this.props.challengeGroup.slots.sort(function(a,b){
           return a.getTime().localeCompare(b.getTime());
        });
        sorted.forEach(function (s) {
            slots.push(<option key={s.id} value={s.id}>{s.getTime()}</option>);
        }.bind(this));
        var q = this.getQuery();
        return (
             <form id="request-game">
                  <div className="form-field form-group">
                      <div className="form-group">
                          <select ref='slot' onChange={this.onSelectSlot}
                                  className="form-control"
                                  value={q.selectedSlot}
                                  type={'select'}>
                              {slots}
                          </select>
                      </div>
                  </div>
             </form>
        );
    },
    render: function() {
        if (this.props.noSelect)
            return (<div>{this.renderNoSelect()}</div>);

        return (<div>{this.renderSelectOptions()}</div>);
    }
});

module.exports = GroupSlot;
