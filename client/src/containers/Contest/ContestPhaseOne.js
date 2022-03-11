import React, { useState } from 'react';
import Loader from '../../components/Loader/Loader';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import useFetch from '../../custom-hooks/useFetch.js';
import { PropTypes } from 'prop-types';
import Timer from 'react-compound-timer';
import CreateSubmission from '../CreateSubmission/CreateSubmission.js';
import { useAuth } from '../../custom-hooks/authContext.js';
import { Modal } from 'react-bootstrap';

const ContestPhaseOne = (props) => {
  const { user } = useAuth();
  const { id } = props.match.params;
  const [toggleInfo, setToggleInfo] = useState(false);

  const options = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  }

  const { data, loading, error } = useFetch(`${BASE_URL}/contests/phaseone/${id}`, options);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <h1 className="text-center">{error}</h1>;
  }

  const toggleUserInfo = () => {
    setToggleInfo((prevState) => !prevState);
  }

  const contestSubmissions = (data.submissions)?.map(contestPhotos => {
    return (
      <div key={contestPhotos.id}>
        <div className="col-4 pb-4">
          <img className="h-100 w-100" src={`http://localhost:3000/public/${contestPhotos.photo}`} alt="Photo" onClick={toggleUserInfo} />
        </div>
        {toggleInfo
          ?
          <Modal show={toggleInfo} onHide={toggleUserInfo}>
            <Modal.Header closeButton>
              <Modal.Title>{contestPhotos.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{contestPhotos.story}</Modal.Body>
          </Modal>
          :
          null}
      </div>
    )
  });

  return (
    <div>
      <div className="text-center pb-5">
        <h1>{data.title}</h1>
        <h3>{data.category}</h3>
        <h5>

          <Timer
            initialTime={(new Date(data.phase1)) - (new Date())}
            direction="backward"
          >
            <Timer.Days /> days
              <span>-</span>
            <Timer.Hours /> hours
              <span>-</span>
            <Timer.Minutes /> minutes
          </Timer>

        </h5>
        {

          user?.role === "Photo Junkie" ?

            <CreateSubmission contestId={id} />

            :
            <>
              <div className="container">
                <div className="row justify-content-center">
                  {contestSubmissions}
                </div>
              </div>
            </>
        }

      </div>
    </div>
  );
}
ContestPhaseOne.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }),
};

export default ContestPhaseOne;
