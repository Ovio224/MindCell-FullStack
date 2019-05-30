import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

import axios from 'axios';
import '../Users.css';

export default class Users extends Component {
  state = {
    show: false,
    nume: '',
    data_nastere: '',
  };

  componentDidMount() {
    this.props.getData('users', 'get');
  }

  componentWillReceiveProps() {
    this.props.getData('users', 'get');
  }

  handleDelete() {
    this.setState({ show: false });
    const userId = this.props.location.pathname.split('/')[2];
    axios
      .delete(`http://localhost:5000/api/users/${userId}`)
      .then(res => {
        this.props.history.push('/users');
      })
      .catch(err => console.error(err));
  }

  handleSubmit = e => {
    e.preventDefault();
    const { nume, data_nastere } = this.state;

    axios({
      method: 'post',
      url: 'http://localhost:5000/api/users',
      data: {
        nume,
        data_nastere,
      },
    }).catch(error => console.error(error));
  };

  handleNameChange = e => {
    this.setState({
      nume: e.target.value,
    });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  render() {
    return (
      // am folosit un snippet de html pentru a fi macar putin estetic din punct de vedere vizual
      <>
        <link
          rel="stylesheet"
          type="text/css"
          href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css"
        />
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
                        {this.props.users.length > 1 ? (
                          this.props.users.map((user, index) => (
                            <tr key={index}>
                              <td>
                                <img src="https://bootdey.com/img/Content/user_1.jpg" alt="random" />
                                <Link to={`/friendsOf/${user.id}`} className="user-link">
                                  {user.nume}
                                </Link>
                              </td>
                              <td>{user.data_nastere.slice(0, 10)}</td>
                              <td style={{ width: '20%' }}>
                                <Link to={`/users/${user.id}`} className="table-link danger">
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
        {/* Un modal custom luat de pe bootstrap */}
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
        <div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <input id="nume" name="nume" type="text" onChange={this.handleNameChange} placeholder="Nume complet" />
            </div>
            <div>
              <input
                type="date"
                id="start"
                value={this.state.data_nastere}
                onChange={event => this.setState({ data_nastere: event.target.value })}
              />
            </div>
            <Button type="submit">Adauga un user nou</Button>
          </form>
        </div>
      </>
    );
  }
}
