import React from 'react';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import Loader from '../../components/Loader/Loader.js';
import Timer from 'react-compound-timer';
import ContestsView from '../../components/Contests/ContestsView.js';
import useFetch from '../../custom-hooks/useFetch.js';
import { PropTypes } from 'prop-types';

const UserContests = (props) => {
  const options = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  }

  const { data, loading, error } = useFetch(`${BASE_URL}/contests/user-submit/mycontests/`, options);

  const activeContests = data.filter(contest => ((new Date(contest.phase1)).valueOf() + (contest.phase2 * 3600000)) > (new Date()));
  const finishedContests = data.filter(contest => ((new Date(contest.phase1)).valueOf() + (contest.phase2 * 3600000)) < (new Date()));


  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <h1 className="text-center">{error}</h1>;
  }

  const userActiveContests = activeContests?.map(contest => {

    return (
      <div className="col-12 col-sm-6 col-lg-4 pt-2 pb-2" key={contest.id}>
        <ContestsView {...contest}>

          <div>
            <Timer
              initialTime={((new Date(contest.phase1)).valueOf() + (contest.phase2 * 3600000)) - (new Date())}
              direction="backward"
            >
              <Timer.Days /> days
              <span>-</span>
              <Timer.Hours /> hours
              <span>-</span>
              <Timer.Minutes /> minutes
            </Timer>
          </div>

        </ContestsView>
      </div>
    );
  });
  const userFinishedContests = finishedContests?.map(contest => {

    return (
      <div
        className="col-12 col-sm-6 col-lg-4 pt-2 pb-2"
        key={contest.id}
        onClick={() => { props.history.push(`/contests/finished/${contest.id}`) }}
        style={{ cursor: 'pointer' }}
      >

        <ContestsView {...contest}>
          <div>ENDED</div>
        </ContestsView>
      </div>
    );
  });


  return (
    <>
      <div className="container pb-5">

        {
          activeContests.length > 0 ?

            <div className="row text-center justify-content-center">
              <h1 className="col-12">Active contests</h1>
              {userActiveContests}
            </div>
            :
            <h1 className="text-center pt-5 pb-5">You currently don't participate in any active contests!</h1>
        }

        {
          finishedContests.length > 0 ?
            <div className="row text-center justify-content-center mt-2 mb-2">
              <h1 className="col-12">Finished contests</h1>
              {userFinishedContests}
            </div>
            :
            null
        }

      </div>
    </>
  )
}
UserContests.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default UserContests;
