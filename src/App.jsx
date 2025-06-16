import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.scss';

import Home from './pages/Home/Home';
import Property from './pages/Property/Property';
import AppHeader from './components/AppHeader/AppHeader';
import { ApiUtil } from './lib/apiUtil';

const App = () => {
  const [propertyLookupTree, setPropertyLookupTree] = useState();

  useEffect(() => {
    ApiUtil.getLookupTree().then((lookupTree) => {
      setPropertyLookupTree(lookupTree);
    });
  }, []);

  return (
    <Router>
      <div className="app">
        <AppHeader propertyLookupTree={propertyLookupTree} />
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/property/:propertyId">
            <Property />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
