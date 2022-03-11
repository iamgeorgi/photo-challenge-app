import React, { useState } from 'react';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import Loader from '../../components/Loader/Loader.js';
import Swal from 'sweetalert2';
import { useAuth } from '../../custom-hooks/authContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { PropTypes } from 'prop-types';

const CreateContest = (props) => {
  const [showCreateForm, setCreateForm] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(null);
  const [searchData, setSearchData] = useState('');
  const [usersChecklist, setUsersChecklist] = useState([]);
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: {
      placeholder: 'Title',
      value: '',
      validations: {
        required: true,
        minLength: 3,
        maxLength: 50
      },
      valid: false,
      touched: false
    },
    category: {
      placeholder: 'Category',
      value: '',
      validations: {
        required: true,
        minLength: 3,
        maxLength: 50
      },
      valid: false,
      touched: false
    },
    isopen: {
      value: '',
      validations: {
        required: true,
      },
      valid: true,
      touched: false,
    },
    phase1: {
      value: '',
      validations: {
        required: true,
        minNumber: 1,
        maxNumber: 30
      },
      valid: false,
      touched: false
    },
    phase2: {
      value: '',
      validations: {
        required: true,
        minNumber: 1,
        maxNumber: 24
      },
      valid: false,
      touched: false
    },
    photo: {
      files: '',
      validations: {
        required: true,
      },
      valid: false,
      touched: false
    },
  });

  const handleChange = event => {
    const { name, value, checked, files } = event.target;
    const updatedElement = { ...form[name] };
    if (name === 'photo') {
      updatedElement.files = files[0];
    } else {
      updatedElement.value = value;
    }

    updatedElement.checked = checked;

    if (name === 'isopen') {
      setIsPrivate(updatedElement.checked);
    }

    updatedElement.touched = true;
    updatedElement.valid = isInputValid(value, updatedElement.validations);

    const updatedForm = { ...form, [name]: updatedElement }
    setForm(updatedForm);

    const formValid = Object.values(updatedForm).every(elem => elem.valid);
    setIsFormValid(formValid);
  }

  const isInputValid = (input, validations) => {
    let isValid = true;

    if (validations.required) {
      isValid = isValid && input.length !== 0;
    }
    if (validations.minLength) {
      isValid = isValid && input.length >= validations.minLength;
    }
    if (validations.maxLength) {
      isValid = isValid && input.length <= validations.maxLength;
    }
    if (validations.minNumber) {
      isValid = isValid && input >= validations.minNumber;
    }
    if (validations.maxNumber) {
      isValid = isValid && input <= validations.maxNumber;
    }
    return isValid;
  };

  const submitCreateContest = () => {
    if (form) {
      const formData = new FormData();

      form.isopen.checked ? form.isopen.value = 0 : form.isopen.value = 1;

      formData.append('title', form.title.value);
      formData.append('category', form.category.value);
      formData.append('isopen', form.isopen.value);
      formData.append('phase1', form.phase1.value);
      formData.append('phase2', form.phase2.value);
      formData.append('photo', form.photo.files);
      formData.append('users', JSON.stringify(usersChecklist));

      if (form.isopen.value === 0 && usersChecklist.length < 1) {
        return (Swal.fire({
          title: 'Add users for private contest',
          toast: true,
          position: 'top-end',
          timer: 5000,
          timerProgressBar: true,
        }))
      }

      // setLoading(true);
      fetch(`${BASE_URL}/contests/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      })
        .then(r => r.json())
        .then((data) => {
          if (data.message || data[0]) {
            Swal.fire({
              title: data.message || data[0],
              toast: true,
              position: 'top-end',
              timer: 5000,
              timerProgressBar: true,
            })
          } else {
            Swal.fire({
              title: 'You created a new contest!',
            })
            props.history.push(`/contests/phaseone`)
          }
        })
        // .finally(() => setLoading(false));
    }
  }

  const handleSearch = event => {
    const { value } = event.target;
    value ? fetch(`${BASE_URL}/users?search=${value}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(r => r.json())
      .then(data => {
        if (data.message) {
          setSearchData(data.message);
        } else {
          const currentUser = user.username;
          setSearchData(data.map(user => {
            if (currentUser !== user.username) {
              return (
                <div className="list-group" key={user.id}>
                  <li
                    className="list-group-item list-group-item-action"
                    onClick={() => handleUsers(user.username, user.id)}
                  >
                    {user.username}
                  </li>
                </div>
              )
            }
          }))
        }
      })
      : setSearchData('');
  }

  const removeUsers = (username, key) => {
    setUsersChecklist((prev) => prev.filter(user => user.username !== username));
  };

  const handleUsers = (username, key) => {
    setUsersChecklist((prev) => {
      const isUserAdded = prev.filter(user => user.username !== username);
      return [...isUserAdded, { username, key }];
    })
  }


  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {
        showCreateForm
          ?
          <div className="container pb-5 col-6">
            <form>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  name="title"
                  type="text"
                  className="form-control"
                  id="title"
                  placeholder={form.title.placeholder}
                  defaultValue={form.title.value}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  name="category"
                  type="text"
                  className="form-control"
                  id="category"
                  placeholder={form.category.placeholder}
                  defaultValue={form.category.value}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phase1">Phase I duration (days)</label>
                <input
                  name="phase1"
                  type="number"
                  className="form-control"
                  id="phase1"
                  defaultValue={form.phase1.value}
                  onChange={handleChange}
                  min={form.phase1.validations.minNumber}
                  max={form.phase1.validations.maxNumber}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phase2">Phase II duration (hours)</label>
                <input
                  type="number"
                  className="form-control"
                  id="phase2"
                  defaultValue={form.phase2.value}
                  name="phase2"
                  onChange={handleChange}
                  min={form.phase2.validations.minNumber}
                  max={form.phase2.validations.maxNumber}
                />
              </div>
              <div className="form-group custom-file">
                <input
                  name="photo"
                  type="file"
                  className="form-control custom-file-input"
                  id="inputGroupFile02"
                  onChange={handleChange}
                />
                <label className="custom-file-label" htmlFor="inputGroupFile02">Choose file</label>
              </div>
              <div className="form-check">
                <input type="checkbox" className="form-check-input" id="isOpen" name="isopen" onChange={handleChange} />
                <label className="form-check-label" htmlFor="isOpen" onChange={handleChange}>Private</label>
              </div>
              {
                isPrivate
                  ?
                  <>
                    <input
                      name="search"
                      type="search"
                      className="form-control mr-sm-2"
                      placeholder='Search for users to add'
                      aria-label="Search"
                      onChange={handleSearch}
                    />
                    {searchData}
                    {usersChecklist
                      ? usersChecklist.map(user => {
                        return (
                          <ul className="list-group" key={user.key}>
                            <li className="list-group-item list-group-item-secondary d-flex justify-content-between align-items-center">
                              {user.username}
                              <span
                                className="badge badge-primary badge-pill badge-danger"
                                onClick={() => removeUsers(user.username, user.key)}
                              >
                                <FontAwesomeIcon
                                  icon={faTimes}
                                  size='1x'
                                />
                              </span>
                            </li>
                          </ul>
                        )
                      })
                      : setUsersChecklist([])}
                  </>
                  :
                  null
              }
              <div className="form-group pt-2">
                <button type="button" disabled={!isFormValid} onClick={submitCreateContest} className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
          :
          null
      }
    </>
  )
}

CreateContest.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default CreateContest;
