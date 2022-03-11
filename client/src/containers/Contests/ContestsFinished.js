import React from 'react';
import { BASE_URL } from '../../common/constants.js';
import { getToken } from '../../common/token-handlers.js';
import Loader from '../../components/Loader/Loader.js';
import ContestsView from '../../components/Contests/ContestsView.js';
import useFetch from './../../custom-hooks/useFetch';
import { PropTypes } from 'prop-types';

const ContestsFinished = (props) => {
  const options = {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    }
  }
  const { data, loading, error } = useFetch(`${BASE_URL}/contests/finished`, options);

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <h1 className="text-center">{error}</h1>;
  }
  const finishedContestsView = data.map(contest => {
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

        <div className="row text-center">
          {finishedContestsView}
        </div>

      </div>
    </>
  )
}
ContestsFinished.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
};

export default ContestsFinished;
