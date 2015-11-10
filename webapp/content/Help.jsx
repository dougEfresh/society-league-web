var React = require('react/addons');
var Router = require('react-router');
var UserContextMixin = require('./../jsx/mixins/UserContextMixin.jsx');
var Link = Router.Link;
var HelpApp = React.createClass({
    render: function () {
        return (
            <div id="help" >
                  <main>
                      <header className="post">
                          <h2>Society Leagues Help</h2>
                      </header>
                      <div className="help-section">
                          <h3>About</h3>
                          <p>This guide contains help for</p>
                              <ul>
                                  <li>Facebook Login</li>
                                  <li>Username Login</li>
                                  <li>Reset password</li>
                                  <li>Navigation</li>
                                  <li>Definitions</li>
                              </ul>
                      </div>

                      <div className="help-section">
                      <h3>Login</h3>
                      <p>There are <strong>two ways</strong> to access the society leagues</p>
                      <ul>
                          <li>
                              <Link to='/login'>
                                  <button className="btn btn-sm btn-social btn-facebook btn-primary btn-responsive">
                                      <i className="fa fa-facebook"></i> <b>Facebook</b>
                                  </button>
                              </Link>
                              <p> You can login using your facebook username and password <strong>(Recommended)</strong></p>
                          </li>
                          <li>
                              <Link to='/legacy'>
                                  <button type="button" className="btn btn-sm btn-default btn-responsive">
                                      <b>Username/Pass</b>
                                  </button>
                              </Link>
                              <p> You can also use a username and password.
                                  If this your first time logging in you should <Link to='/reset'><b>Reset</b></Link> your password</p>
                          </li>
                      </ul>
                      </div>
                      <div className="help-section">
                      <h3>
                          Facebook Login
                      </h3>
                      <p>On the <Link to='/login'>login</Link> page: </p>
                      <div style={{maxWidth: 330, padding:10}}>
                      <img  style={{height: 100}} className="img-responsive" src={'/img/login.png'}>
                      </img>
                      </div>
                      <p>Click the Facebook button and you be redirected to FB for login</p>
                      <p>FB may also ask you to <strong>authorize </strong>Society Leagues.</p>
                       <div style={{maxWidth: 600, minHeight: 300}}>
                      <img  style={{backgroundSize: '100%', height:250, width:500}} className="img-responsive" src={'/img/fb.png'}>
                      </img>
                      </div>
                      <p></p>
                      <p> <strong style={{color: 'red'}} >NOTE: </strong><strong>
                          Society does not have any access to your facebook profile.
                          It has access to your <strong>profile image </strong> which is already publicly available</strong>
                      </p>
                      </div>
                      <div className="help-section">
                      <h3>Username Login</h3>
                      <p>If you choose username (email registered with society) as your login method than you need to click on the <strong>username</strong> button on the
                          <Link to='/login'> login</Link> page
                      </p>
                      </div>
                      <div className="help-section">
                          <h3>Reset Password</h3>
                          <p><strong>If you use your email to login</strong> and do not know your password then <Link to='/reset'><strong>reset</strong></Link></p>
                           <div style={{maxWidth: 330, padding:10}}>
                               <img style={{height: 100}}   className="img-responsive" src={'/img/login.png'}>
                               </img>
                           </div>
                          <p>Click the username button on the login page</p>
                            <div style={{maxWidth: 330, padding:10}}>
                               <img style={{height: 110}}  className="img-responsive" src={'/img/reset.png'}>
                               </img>
                           </div>
                      <p>Enter the <strong>email </strong>you gave to society and click the button. An email should appear in your email in a minute or two</p>
                      </div>
                      <div className="help-section">
                      <h3>Navigation</h3>
                      <ul>
                          <li>
                              <strong>Home</strong> - Displays your upcoming matches and 'leaders' within your division
                          </li>
                              <li><strong>My Team(s)</strong>
                                  <ul>
                                      <li>Standings  - the division standings (1st,2nd, wins/losses)</li>
                                      <li>Schedule & Matches - displays team match results and upcoming matches</li>
                                      <li>Division Leaders  - display a ranking of all players in the league</li>
                                  </ul>
                              </li>
                           <li><strong>Top Gun</strong>
                               <p> Similar to <stong>My Teams</stong></p>
                           </li>
                          <li>
                              <strong>History</strong> - Shows history of the divisions you participated in
                          </li>
                      </ul>
                      </div>
                        <div className="help-section">
                            <h3>Definitions</h3>
                            <ul>
                                <li><strong>RW</strong>: Racks Won </li>
                                <li><strong>RL</strong>: Racks Lost </li>
                                <li><strong>SW</strong>: Set Wins (number of nine ball matches your team won) </li>
                                <li><strong>SL</strong>: Set Lost (number of nine ball matches your team lost) </li>
                                <li><strong>HC</strong>: Handicap </li>
                            </ul>
                        </div>
                  </main>
            </div>

        );
    }
});


module.exports = HelpApp;
