var React = require('react/addons');
var Router = require('react-router')
    , State = Router.State
    , Navigation = Router.Navigation
    , Link = Router.Link
    , RouteHandler = Router.RouteHandler;

var DataStore = require('../../jsx/stores/DataStore.jsx');
var UserContextMixin = require('../../jsx/mixins/UserContextMixin.jsx');
var TeamMixin = require('../../jsx/mixins/TeamMixin.jsx');
var SeasonMixin = require('../../jsx/mixins/SeasonMixin.jsx');
var Util = require('../../jsx/util.jsx');

var UserApp = React.createClass({
    mixins: [UserContextMixin, State, Navigation],
    onClick: function(e) {
        e.preventDefault();
        var $form = document.getElementById('payment-form');
        // Disable the submit button to prevent repeated clicks
        Stripe.card.createToken($form, function (status, response) {
            var $form =  document.getElementById('payment-form');
            if (response.error) {
                // Show the errors on the form
                console.log(JSON.stringify(error));
                //$form.find('.payment-errors').text(response.error.message);
                //$form.find('button').prop('disabled', false);
            } else {
                // response contains id and card, which contains additional card details
                var token = response.id;
                // Insert the token into the form so it gets submitted to the server
                //$form.append($('<input type="hidden" name="stripeToken" />').val(token));
                // and submit
                //$form.get(0).submit();
                Util.getData("/api/billing/challenge/" + token + "/" + this.getUser().id, function(d) {
                    console.log(JSON.stringify(d));
                });
            }
        }.bind(this));
    },
    render: function () {
        return (
            <div id="user-app" className="panel panel-default">
                <div className="panel-heading">
                    Pay Up Bitches
                </div>
                <div className="panel-body">
                    <form action="" method="POST" id="payment-form">
                        <span className="payment-errors"></span>

                        <div className="form-row">
                            <label>
                                <span>Card Number</span>
                                <input type="text" size="20" data-stripe="number" value="4242 4242 4242 4242"/>
                            </label>
                        </div>

                        <div className="form-row">
                            <label>
                                <span>CVC</span>
                                <input type="text" size="4" data-stripe="cvc" value="123" />
                            </label>
                        </div>

                        <div className="form-row">
                            <label>
                                <span>Expiration (MM/YYYY)</span>
                                <input type="text" size="2" data-stripe="exp-month" value="05"/>
                            </label>
                            <span> / </span>
                            <input type="text" size="4" data-stripe="exp-year" value="16"/>
                        </div>
                        <button onClick={this.onClick} type="submit">Submit Payment</button>
                    </form>
                </div>
            </div>
        );
    }
});

module.exports = UserApp;

