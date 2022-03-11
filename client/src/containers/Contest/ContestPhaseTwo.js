import React, { useState } from 'react';
import Loader from '../../components/Loader/Loader';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import useFetch from '../../custom-hooks/useFetch.js';
import { PropTypes } from 'prop-types';
import Timer from 'react-compound-timer';
import CreateScore from './../CreateScore/CreateScore.js';
import { Modal } from 'react-bootstrap';
import Swal from 'sweetalert2'
import { useAuth } from './../../custom-hooks/authContext';

const ContestPhaseTwo = (props) => {
  const { user } = useAuth();
  const { id } = props.match.params;
  const [currPhoto, setCurrPhoto] = useState([]);
  const [scoreMode, setScoreMode] = useState(false);

  const toggleScoreMode = () => {
    setScoreMode((prevState) => !prevState);
  };

  const options = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  }

  const { data, loading, error } = useFetch(`${BASE_URL}/contests/phasetwo/${id}`, options);

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

  const handlePhotoClick = (id, photo, title, story) => {
    toggleScoreMode();
    setCurrPhoto({ id, photo, title, story });
  }

  const contestSubmissions = (data.submissions)?.map(contestPhotos => {
    return (
      <div
        key={contestPhotos.id}
        className="col-4 pb-4"
        onClick={() => handlePhotoClick(contestPhotos.id, contestPhotos.photo, contestPhotos.title, contestPhotos.story)}
      >
        <img
          className="h-100 w-100"
          src={`http://localhost:3000/public/${contestPhotos.photo}`}
          alt="Photo"

        />
      </div>
    )
  });

  return (

    <div>
      {
        (data.id && user.role === "Organizer") ?
          <div className="text-center pb-5">
            <h1>{data.title}</h1>
            <h3>{data.category}</h3>

            <h5>
              <Timer
                initialTime={(((new Date(data.phase1)).valueOf() + (data.phase2 * 3600000)) - (new Date()))}
                direction="backward"
              >
                <Timer.Hours />
                <span>:</span>
                <Timer.Minutes />
                <span>:</span>
                <Timer.Seconds />
              </Timer>
            </h5>

            {
              scoreMode ?
                <Modal show={scoreMode} size="lg" onHide={toggleScoreMode}>
                  <CreateScore contestId={id} currPhoto={currPhoto} toggleScoreMode={toggleScoreMode} />
                </Modal>
                :
                null
            }

            <>
              <div className="container">
                <div className="row justify-content-center">
                  {contestSubmissions}
                </div>
              </div>
            </>

          </div>
          :
          null
      }
    </div>
  );
}
ContestPhaseTwo.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }),
};

export default ContestPhaseTwo;
