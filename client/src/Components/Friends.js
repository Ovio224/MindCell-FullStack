import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { Modal, Button } from 'react-bootstrap';

import axios from 'axios';
import '../Users.css';

export default class Friends extends Component {
  _isMounted = true;
  state = {
    show: false,
    selectedOption: '',
    selectedUserId: '',
    friends: [],
    users: [],
    nume: '',
    data_nastere: '',
  };

  componentDidMount() {
    this._isMounted = true;
    const userId = this.props.location.pathname.split('/')[2];

    userId && this.getFriends(`friendsOf/${userId}`, 'get');
    axios
      .get('http://localhost:5000/api/users')
      .then(res => {
        this.setState({ users: res.data });
      })
      .catch(err => console.error(err));
  }

  componentWillReceiveProps() {
    const userId = this.props.location.pathname.split('/')[2];
    userId && this.getFriends(`friendsOf/${userId}`, 'get');
  }

  //  aplicatia functioneaza si fara acest lifecycle;
  //  am folosit-o mai mult pentru a nu fi nevoit sa apesi
  //  de 2 ori pe un user pentru a-i vedea prietenii - hacky way
  componentDidUpdate() {
    const userId = this.props.location.pathname.split('/')[2];
    userId && this.getFriends(`friendsOf/${userId}`, 'get');
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getFriends = (route, method) => {
    axios({ method, url: `http://localhost:5000/api/${route}` })
      .then(res => {
        if (this._isMounted) {
          this.setState({ friends: res.data });
        }
      })
      .catch(err => console.error(err));
  };

  handleDelete() {
    this.setState({ show: false });
    const userId = this.props.location.pathname.split('/')[2];
    const friendId = this.props.location.pathname.split('/')[3];
    axios
      .delete(`http://localhost:5000/api/friendsOf/${userId}/${friendId}`)
      .then(res => {
        this.props.history.push(`/friendsOf/${userId}`);
      })
      .catch(err => console.error(err));
  }

  handleSubmit = e => {
    e.preventDefault();
    const id_prieten = this.state.selectedUserId;
    const userId = this.props.location.pathname.split('/')[2];

    axios({
      method: 'post',
      url: `http://localhost:5000/api/friendsOf/${userId}`,
      data: {
        id_prieten,
      },
    }).catch(error => console.error(error));
  };

  handleNameChange = e => {
    this.setState({
      nume: e.target.value,
    });
  };

  handleSelectChange = selectedOption => {
    this.setState({ selectedOption, selectedUserId: selectedOption.id });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  render() {
    const { selectedOption, users } = this.state;
    const userId = this.props.location.pathname.split('/')[2];
    let selectedUser = '';
    users.map((user, index) => {
      user.value = user.nume;
      user.label = user.nume;
      if (userId.toString() === user.id.toString()) {
        return (selectedUser = user.nume);
      } else return null;
    });

    return (
      // am folosit un snippet de html pentru a fi macar putin estetic din punct de vedere vizual
      <>
        <link
          rel="stylesheet"
          type="text/css"
          href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css"
        />
        <h2>Prietenii lui {selectedUser}</h2>
        <hr />
        <div className="container bootstrap snippet">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-box no-header clearfix">
                <div className="main-box-body clearfix">
                  <div className="table-responsive">
                    <table className="table user-list">
                      <thead>
                        <tr>
                          <th>
                            <span>Nume</span>
                          </th>
                          <th>
                            <span>Data de Nastere</span>
                          </th>
                          <th className="text-center" />
                        </tr>
                      </thead>
                      <tbody>
                        {/* Iteram prin toti userii si ii afisam pe fiecare in parte */}
                        {this.state.friends.length >= 1 ? (
                          this.state.friends.map((user, index) => (
                            <tr key={index}>
                              <td>
                                <img src="https://bootdey.com/img/Content/user_1.jpg" alt="random" />
                                <Link to={`/friendsOf/${user.id}`} className="user-link">
                                  {user.nume}
                                </Link>
                              </td>
                              <td>{user.data_nastere.slice(0, 10)}</td>
                              <td style={{ width: '20%' }}>
                                <Link to={`/friendsOf/${user.persoana_a}/${user.id}`} className="table-link danger">
                                  <span className="fa-stack" onClick={this.handleShow.bind(this)}>
                                    <i className="fa fa-square fa-stack-2x" />
                                    <i className="fa fa-trash-o fa-stack-1x fa-inverse" />
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td>
                              <div>Nu exista niciun user in baza de date.</div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Un custom modal luat de pe bootstrap */}
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Stergere user</Modal.Title>
          </Modal.Header>
          <Modal.Body>Esti sigur ca vrei sa stergi acest user? Aceasta actiune nu poate fi inversata!</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.handleClose}>
              Nu
            </Button>
            <Button variant="secondary" onClick={this.handleDelete.bind(this)}>
              Da
            </Button>
          </Modal.Footer>
        </Modal>
        <form onSubmit={this.handleSubmit}>
          <Select value={selectedOption} onChange={this.handleSelectChange} options={users} className="dropdown" />
          <Button type="submit">Adauga un prieten nou!</Button>
        </form>
      </>
    );
  }
}
