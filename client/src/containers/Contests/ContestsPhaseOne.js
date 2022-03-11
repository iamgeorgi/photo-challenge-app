import React, { useState, useEffect } from 'react';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import Loader from '../../components/Loader/Loader.js';
import Timer from 'react-compound-timer';
import ContestsView from '../../components/Contests/ContestsView.js';
import useFetch from './../../custom-hooks/useFetch.js';
import { PropTypes } from 'prop-types';
import { useAuth } from '../../custom-hooks/authContext.js';


const ContestsPhaseOne = (props) => {
  const { user } = useAuth();
  const [userPrivateContests, setuserPrivateContests] = useState([]);

  const options = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  }

  const { data, loading, error } = useFetch(`${BASE_URL}/contests/phaseone`, options);
  const { contests, submissions } = data;

  useEffect(() => {
    fetch(`${BASE_URL}/contests/private-users/${user.sub}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
      .then(r => r.json())
      .then(usersData => {
        if (usersData.message) {
          return null;
        } else {
          setuserPrivateContests(usersData);
        }
      })
  }, []);


  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h1 className="text-center">{error}</h1>;
  }

  let allUserContests;
  if (data.contests?.length > 0) {
    allUserContests = [...userPrivateContests, ...contests].filter((contest, contestIndex) => {
      const currentIndex = [...userPrivateContests, ...contests].findIndex((value) => contest.title === value.title);
      return currentIndex === contestIndex;
    });
  }

  const phaseOneView = allUserContests?.map(contest => {
    const userHasSubmission = submissions?.findIndex(submission => submission.contests_id === contest.id);
    return (
      <div
        className="col-12 col-sm-6 col-lg-4 pt-2 pb-2"
        key={contest.id}
      >
        <ContestsView {...contest}>

          <div>
            <Timer
              initialTime={(new Date(contest.phase1)) - (new Date())}
              direction="backward"
            >
              <Timer.Days /> days
                <span>-</span>
              <Timer.Hours /> hours
                <span>-</span>
              <Timer.Minutes /> minutes
            </Timer>
          </div>

          <div>
            {
              user.role === "Organizer" ?

                <button
                  className="btn btn-sm btn-primary mt-2 mb-2"
                  onClick={() => { props.history.push(`/contests/phaseone/${contest.id}`) }}
                >
                  More
                </button>
                :
                <button
                  className="btn btn-sm btn-primary mt-2 mb-2"
                  disabled={userHasSubmission !== -1}
                  onClick={() => { props.history.push(`/contests/phaseone/${contest.id}`) }}
                >
                  Enroll
                </button>
            }
          </div>
        </ContestsView>

      </div>
    );
  })


  return (
    <>
      <div className="container pb-5">

        <div className="row text-center">
          {phaseOneView}
        </div>

      </div>
    </>
  )
}
ContestsPhaseOne.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default ContestsPhaseOne;
