import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Lottery from './pages/Lottery';
import GroupPurchase from './pages/GroupPurchase';
import Prize from './pages/Prize';
import Refund from './pages/Refund';
import Share from './pages/Share';
import Team from './pages/Team';
import Member from './pages/Member';
import Finance from './pages/Finance';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/lottery" component={Lottery} />
        <Route path="/group-purchase" component={GroupPurchase} />
        <Route path="/prize" component={Prize} />
        <Route path="/refund" component={Refund} />
        <Route path="/share" component={Share} />
        <Route path="/team" component={Team} />
        <Route path="/member" component={Member} />
        <Route path="/finance" component={Finance} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
      </Switch>
    </Router>
  );
};

export default App;