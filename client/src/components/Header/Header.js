import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { removeToken } from '../../common/token-handlers.js';
import { useAuth } from '../../custom-hooks/authContext.js';
import { PropTypes } from 'prop-types';
import './Header.css';

const Header = (props) => {
  const { user, setUser } = useAuth();

  const handleClickLogout = () => {
    props.history.push('/home');
    removeToken();
    setUser(null);
  }


  return (
    <>
      <header className="bg-light text-dark">
        <nav className="container navbar navbar-expand-sm navbar-light">

          <div className="navbar-brand font-weight-bold" to="#top">TOP SHOTS</div>

          <div className="collapse navbar-collapse">


            <ul className="navbar-nav mr-auto">

              {
                user ?
                  <>

                    <li className="nav-item">
                      <NavLink to="/contests/phaseone" className="nav-link">Phase I</NavLink>
                    </li>
                    {
                      user.role === "Organizer"
                        ?
                        <>
                          <li className="nav-item">
                            <NavLink to="/contests/phasetwo" className="nav-link">Phase II</NavLink>
                          </li>
                        </>
                        :
                        null
                    }
                    <li className="nav-item">
                      <NavLink to="/contests/finished" className="nav-link">Finished</NavLink>
                    </li>
                    {
                      user.role === "Photo Junkie" ?
                        <li className="nav-item">
                          <NavLink to="/contests/usercontests" className="nav-link">My Contests</NavLink>
                        </li>
                        :
                        <li className="nav-item">
                          <NavLink to="/users" className="nav-link">Users</NavLink>
                        </li>

                    }
                  </>
                  :
                  <li className="nav-item">
                    <NavLink to="/home" className="nav-link">Home</NavLink>
                  </li>
              }
            </ul>

            {
              user ?
                <button className="btn btn-primary" onClick={() => handleClickLogout()} type="button">Logout</button>
                :
                <>
                  <button to="/users" className="btn btn-primary mr-1" onClick={() => props.history.push('/users')}>Register</button>
                  <button to="/signin" className="btn btn-primary ml-1" onClick={() => props.history.push('/signin')}>Login</button>
                </>
            }


          </div>

        </nav>
      </header>
      {
        user ?
          <div className="container">
            <div className="header-background">
              <div className="welcome-header font-italic">
                Welcome, {user.username}
              </div>
            </div>
          </div>
          :
          null
      }

    </>
  );
}

Header.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default withRouter(Header);
