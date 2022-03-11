import React, { useState } from 'react';
import Loader from '../../components/Loader/Loader';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import useFetch from '../../custom-hooks/useFetch.js';
import { PropTypes } from 'prop-types';
import SubmissionById from './../FinishedContests/SubmissionById';
import { Modal } from 'react-bootstrap';

const ContestFinished = (props) => {
  const { id } = props.match.params;
  const [currSubmission, setCurrSubmission] = useState(null);
  const [showSubmissionById, setShowSubmissionById] = useState(false);

  const toggleShowSubmissionMode = () => {
    setShowSubmissionById((prevState) => !prevState);
  };

  const options = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  }

  const { data, loading, error } = useFetch(`${BASE_URL}/contests/finished/${id}`, options);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <h1 className="text-center">{error}</h1>;
  }


  const handlePhotoClick = (data) => {
    toggleShowSubmissionMode();
    setCurrSubmission(data);
  }

  const contestSubmissions = (data.submissions)?.map(contestPhotos => {
    return (
      <div key={contestPhotos.id} className="col-4 pb-4" onClick={() => handlePhotoClick(contestPhotos)}>
        <img
          className="h-100 w-100"
          src={`http://localhost:3000/public/${contestPhotos.photo}`}
          alt="Photo"
        />
      </div>
    )
  });

  const currentUserSubmission = (
    <div key={data.currUserSubmission?.id} className="col-4 pb-4" onClick={() => handlePhotoClick(data.currUserSubmission)}>
      <img
        className="h-100 w-100"
        src={`http://localhost:3000/public/${data.currUserSubmission?.photo}`}
        alt="Photo"
        style={{ border: '5px solid yellow' }}
      />
    </div>
  );

  return (
    <div>
      <div className="text-center pb-5">
        <h1>{data.title}</h1>
        <h3>{data.category}</h3>
        <h5>
          ENDED
        </h5>

        <>
          {
            showSubmissionById ?
              <Modal show={showSubmissionById} size="lg" onHide={toggleShowSubmissionMode}>
                <SubmissionById id={id} currSubmission={currSubmission} />
              </Modal>
              :
              null
          }
        </>

        <>
          <div className="container">
            <div className="row justify-content-center">

              {
                (data.currUserSubmission) ?
                  currentUserSubmission
                  :
                  null
              }

              {contestSubmissions}
            </div>
          </div>
        </>

      </div>
    </div>
  );
}
ContestFinished.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }),
};

export default ContestFinished;
