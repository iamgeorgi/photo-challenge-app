import React from 'react';
import Loader from '../../components/Loader/Loader';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import useFetch from '../../custom-hooks/useFetch.js';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faComment } from '@fortawesome/free-regular-svg-icons'


const SubmissionById = ({ id, currSubmission }) => {

  const options = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  }

  const { data, loading, error } = useFetch(`${BASE_URL}/contests/${id}/user-submit/${currSubmission.id}`, options);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <h1 className="text-center">{error}</h1>;
  }


  const contestScorings = (data.scoringsBySubmissionId)?.map(score => {
    return (
      <div key={score.id}>
        <div>

          <h2>{score.username}:</h2>
          <div className="mb-2 ml-5 mr-5">
            <h4>
              <FontAwesomeIcon
                icon={faStar}
                size='sm'
                className="mr-1"
              />
              {score.score}
            </h4>
            {
              score.comment.length > 0 ?
                <h4>
                  <FontAwesomeIcon
                    icon={faComment}
                    size='sm'
                    className="mr-1"
                  />
                  {score.comment}
                </h4>
                :
                null

            }
          </div>
        </div>
      </div>
    )
  });

  return (
    <>
      <div>

        <div>
          <img className="h-100 w-100" src={`http://localhost:3000/public/${currSubmission.photo}`} alt="Photo" />
        </div>

        <div className="text-center">
          <h1>{currSubmission.title}</h1>
          <h3>{currSubmission.story}</h3>
          <h4>
            {data.avgScore?.average_score}
            <FontAwesomeIcon
              icon={faStar}
              size='sm'
            />
          </h4>
        </div>

        <div className="container-fluid">
          {contestScorings}
        </div>

      </div>
    </>
  );
}
SubmissionById.propTypes = {
  id: PropTypes.string.isRequired,
  currSubmission: PropTypes.object
};

export default SubmissionById;
