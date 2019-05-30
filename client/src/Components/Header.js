import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';

const Header = () => {
  return (
    <Nav variant="tabs" defaultActiveKey="/users">
      <ul>
        <li>
          <Nav.Item>
            {/* <Nav.Link href="/users">Useri</Nav.Link> */}
            <NavLink to="/users" className="navigation" style={{ textDecoration: 'none' }}>
              Useri
            </NavLink>
          </Nav.Item>
        </li>
        <li>
          <Nav.Item>
            <NavLink to="/friendsOf" className="navigation" style={{ textDecoration: 'none' }}>
              Friends
            </NavLink>
          </Nav.Item>
        </li>
      </ul>
    </Nav>
  );
};

export default Header;
