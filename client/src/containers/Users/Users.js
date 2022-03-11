import React from 'react';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import Loader from '../../components/Loader/Loader.js';
import useFetch from '../../custom-hooks/useFetch.js';


const Users = () => {
  const options = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  }

  const { data, loading, error } = useFetch(`${BASE_URL}/users`, options);

  
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <h1 className="text-center">{error}</h1>;
  }

  const loadedUsers = data.map((user) => {
    return (
      <tr key={user.id}>
        <th scope="row">{user.id}</th>
        <td>{user.username}</td>
        <td>{user.firstname}</td>
        <td>{user.lastname}</td>
        <td>{user.email}</td>
        <td>{user.role}</td>
      </tr>
    )
  });


  return (
    <>
      <div className="container pt-2 pb-5">

        <table className="table">

          <thead className="thead-light">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Firstname</th>
              <th scope="col">Lastname</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
            </tr>
          </thead>

          <tbody>
            {loadedUsers}
          </tbody>

        </table>

      </div>
    </>
  )
}

export default Users;
