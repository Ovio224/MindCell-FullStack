import React, { Component } from 'react';
import Select from 'react-select';

export default class LookupFriends extends Component {
  componentDidMount() {
    this.props.getData('users', 'get');
  }

  handleSelectChange = selectedOption => {
    const id = selectedOption.id;
    this.props.history.push(`/friendsOf/${id}`);
  };
  render() {
    // schimbam proprietatile userilor pentru a-i putea afisa
    // corespunzator ca si optiuni, folosind libraria react-select
    // care necesita ca fiecare obiect sa aiba proprietatile {value si label}
    const { selectedOption, users } = this.props;
    users.map((user, index) => {
      user.value = user.nume;
      user.label = user.nume;
      return null;
    });
    return (
      <>
        <h2>Selecteaza un user ai carui prieteni doresti sa-i vezi!</h2>
        <Select value={selectedOption} onChange={this.handleSelectChange} options={users} className="dropdown" />
      </>
    );
  }
}
