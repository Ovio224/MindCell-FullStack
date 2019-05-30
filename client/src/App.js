import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import axios from 'axios';

// Components
import Users from './Components/Users';
import Header from './Components/Header';
import Friends from './Components/Friends';
import LookupFriends from './Components/LookupFriends';

class App extends Component {
  state = {
    users: [],
  };

  getData = (route, method) => {
    axios({ method, url: `http://localhost:5000/api/${route}` })
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(err => console.error(err));
  };
  render() {
    return (
      <BrowserRouter>
        <Route path="/" component={Header} />
        <div className="App">
          <Route
            path="/users"
            render={({ location, history }) => (
              <Users users={this.state.users} getData={this.getData} location={location} history={history} />
            )}
          />
          <Route
            path="/friendsOf/:id"
            render={({ location, history }) => (
              <Friends users={this.state.users} location={location} history={history} />
            )}
          />
          <Route
            exact
            path="/friendsOf"
            render={({ history }) => (
              <LookupFriends history={history} getData={this.getData} users={this.state.users} />
            )}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
