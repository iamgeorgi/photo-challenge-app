import React from 'react';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import Loader from '../../components/Loader/Loader.js';
import Timer from 'react-compound-timer';
import ContestsView from '../../components/Contests/ContestsView.js';
import useFetch from './../../custom-hooks/useFetch.js';
import { PropTypes } from 'prop-types';

const ContestsPhaseTwo = (props) => {
  const options = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  }
  const { data, loading, error } = useFetch(`${BASE_URL}/contests/phasetwo`, options);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <h1 className="text-center">{error}</h1>;
  }

  const phaseTwoView = data.map(contest => {

    return (
      <div
        className="col-12 col-sm-6 col-lg-4 pt-2 pb-2"
        key={contest.id}
        onClick={() => { props.history.push(`/contests/phasetwo/${contest.id}`) }}
        style={{ cursor: 'pointer' }}
      >
        <ContestsView {...contest}>

          <div>
            <Timer
              initialTime={((new Date(contest.phase1)).valueOf() + (contest.phase2 * 3600000)) - (new Date())}
              direction="backward"
            >
              <Timer.Hours /> hours
                <span>-</span>
              <Timer.Minutes /> minutes
                <span>-</span>
              <Timer.Seconds /> seconds
            </Timer>
          </div>

        </ContestsView>
      </div>
    );
  });


  return (
    <>
      <div className="container pb-5">

        <div className="row text-center">
          {phaseTwoView}
        </div>

      </div>
    </>
  )
}
ContestsPhaseTwo.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default ContestsPhaseTwo;
