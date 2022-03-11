import React from 'react';
import PropTypes from 'prop-types';
import Header from '../Header/Header.js';
import Footer from '../Footer/Footer.js';
import { useAuth } from '../../custom-hooks/authContext.js';
import { NavLink } from 'react-router-dom';

const Layout = props => {
  const { user } = useAuth();
  return (
    <>
      <Header />

      <main>
        <div className="container pt-2">
          {user && user.role === 'Organizer' 
          ?
          (<NavLink to="/contests/create"><button className="btn btn-primary" type="button">Create Contest</button></NavLink>) 
          : null}
        </div>
        {props.children}
      </main>

      <Footer />
    </>
  );
}
Layout.propTypes = {
  children: PropTypes.element
};


export default Layout;
