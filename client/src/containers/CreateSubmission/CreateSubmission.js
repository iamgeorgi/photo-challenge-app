import React, { useState } from 'react';
import Loader from '../../components/Loader/Loader.js';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import { PropTypes } from 'prop-types';
import { isInputValid } from '../../common/input-validation-function.js';
import Swal from 'sweetalert2'

const CreateSubmission = ({ contestId }) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    title: {
      placeholder: 'Title',
      value: '',
      validations: {
        required: true,
        minLength: 3,
        maxLength: 45
      },
      valid: false,
      touched: false
    },
    story: {
      placeholder: 'Story',
      value: '',
      validations: {
        required: true,
        minLength: 3,
        maxLength: 256
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

  const uploadSubmission = () => {
    if (form) {
      const formData = new FormData();
      formData.append('photo', form.photo.files);
      formData.append('title', form.title.value);
      formData.append('story', form.story.value);

      setLoading(true);
      fetch(`${BASE_URL}/contests/${contestId}/user-submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
        body: formData
      })
        .then(r => r.json())
        .then((data) => {
          if (data.message) {
            setError(data.message);
          } else {
            Swal.fire({
              title: data.title,
              text: data.story,
              imageUrl: `http://localhost:3000/public/${data.photo}`,
              imageWidth: 400,
              imageHeight: 200,
              imageAlt: 'Photo',
            })
          }
        })
        .finally(() => {
          setLoading(false);
          setError(null);
        });
    }
  }


  const handleInputChange = event => {
    const { name, value, files } = event.target;

    const updatedElement = { ...form[name] };
    if (name === 'photo') {
      updatedElement.files = files[0];
    } else {
      updatedElement.value = value;
    }
    updatedElement.touched = true;
    updatedElement.valid = isInputValid(value, updatedElement.validations);

    const updatedForm = { ...form, [name]: updatedElement }
    setForm(updatedForm);

    const formValid = Object.values(updatedForm).every(elem => elem.valid);
    setIsFormValid(formValid);
  }

  const handleSendSubmissionClick = () => {
    Swal.fire({
      icon: 'warning',
      title: 'You can\'t change your data later. Are you sure?',
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        uploadSubmission();
      } else if (result.isDenied) {
        Swal.fire('Your submission is not saved', '', 'info');
      }
    })
  }

  if (loading) {
    return <Loader />;
  }
  if (error) {
    Swal.fire({
      title: 'Error!',
      position: 'center',
      text: error,
      icon: 'error',
      confirmButtonText: 'ОК'
    })
  }

  return (
    <div className="container text-center pt-5">
      <div className="row justify-content-center">
        <div className="col-6">

          <div className="form-group">
            <input
              name="title"
              type="text"
              className="form-control"
              placeholder={form.title.placeholder}
              defaultValue={form.title.value}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              name="story"
              type="text"
              className="form-control"
              placeholder={form.story.placeholder}
              defaultValue={form.story.value}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group custom-file">
            <input
              name="photo"
              type="file"
              className="form-control custom-file-input"
              id="inputGroupFile02"
              onChange={handleInputChange}
            />
            <label className="custom-file-label" htmlFor="inputGroupFile02">Choose file</label>
          </div>
          <div className="form-group pt-2">
            <button type="button" disabled={!isFormValid} onClick={handleSendSubmissionClick} className="btn btn-primary">Send</button>
          </div>

        </div>
      </div>
    </div>
  )
}
CreateSubmission.propTypes = {
  contestId: PropTypes.string.isRequired
};

export default CreateSubmission;
