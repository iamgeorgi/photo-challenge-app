import React, { useState } from 'react';
import Loader from '../../components/Loader/Loader.js';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import { PropTypes } from 'prop-types';
import { isInputValid } from '../../common/input-validation-function.js';
import Swal from 'sweetalert2'

const CreateScore = ({ contestId, currPhoto, toggleScoreMode }) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    score: {
      placeholder: 'Score',
      value: '',
      validations: {
        required: true,
        min: 1,
        max: 10
      },
      valid: false,
      touched: false
    },
    comment: {
      placeholder: 'Comment',
      value: '',
      validations: {
        required: true,
        minLength: 3,
        maxLength: 256
      },
      valid: false,
      touched: false
    },
    wrong_category: {
      value: '',
      checked: false,
      validations: {
        required: false,
      },
      valid: true,
      touched: false
    },
  });


  const uploadScore = () => {
    setLoading(true);
    const data = {
      score: form.score.value,
      comment: form.comment.value,
      wrong_category: form.wrong_category.value
    }
    fetch(`${BASE_URL}/contests/phasetwo/${contestId}/user-submit/${currPhoto.id}/jury-scoring`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data)
    })
      .then(r => r.json())
      .then((data) => {
        if (data.message) {
          setError(data.message);
        } else {
          Swal.fire({
            title: 'Success',
            toast: true,
            position: 'top-end',
            text: 'Successfully voted',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false,
            timerProgressBar: true,
          })
        }
      })
      .finally(() => setLoading(false));
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

    if (name === 'wrong_category') {
      updatedElement.checked = !updatedElement.checked;
      if (updatedElement.checked === true) {
        updatedElement.value = 1;
        setIsFormValid(true);
      } else {
        updatedElement.value = 0;
        setIsFormValid(false);
      }
    } else {
      const formValid = Object.values(updatedForm).every(elem => elem.valid);
      setIsFormValid(formValid);
    }
  }

  const handleSendScore = () => {
    setTimeout(() => toggleScoreMode(), 50);
    uploadScore();

  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    Swal.fire({
      title: 'Error!',
      toast: true,
      position: 'top-end',
      text: error,
      icon: 'error',
      confirmButtonText: 'ОК'
    })
  }


  return (
    <div className="container text-center pt-5">
      <div className="row">
        <div className="col-12">
          <img className="h-100 w-100" src={`http://localhost:3000/public/${currPhoto.photo}`} />
        </div>
        <div className="col-12 pt-2 text-center">
          <h2 className="text-center">{currPhoto.title}</h2>
          <h2 className="text-center">{currPhoto.story}</h2>
        </div>
      </div>
      <div className="row justify-content-center pt-4">
        <div className="col-6">

          <div className="form-group">
            <input
              name="score"
              type="number"
              className="form-control"
              min={form.score.validations.min}
              max={form.score.validations.max}
              placeholder={form.score.placeholder}
              defaultValue={form.score.value}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              name="comment"
              type="text"
              className="form-control"
              placeholder={form.comment.placeholder}
              defaultValue={form.comment.value}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-check">
            <input
              name="wrong_category"
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              checked={form.wrong_category.checked}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor="exampleCheck1">Wrong Category</label>
          </div>
          <div className="form-group pt-2">
            <button type="button" disabled={!isFormValid} onClick={() => handleSendScore()} className="btn btn-primary">Send</button>
          </div>

        </div>
      </div>
    </div>
  )
}
CreateScore.propTypes = {
  contestId: PropTypes.string.isRequired,
  currPhoto: PropTypes.object,
  toggleScoreMode: PropTypes.func
};

export default CreateScore;
