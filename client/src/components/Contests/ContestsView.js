import React from 'react';
import { withRouter } from 'react-router-dom';
import { PropTypes } from 'prop-types';

const ContestsView = (props) => {
  return (
    <div className="card h-100">
      <div>
        <img
          className="w-100"
          style={{height:"200px"}}
          src={`http://localhost:3000/public/${props.photo}`}
          alt="Photo"
        />
      </div>
      <h3>{props.title}</h3>
      <h5>{props.category}</h5>
      <p>{props.resume}</p>
      <>{props.children}</>
    </div>
  );
}

ContestsView.propTypes = {
  photo: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.string,
  resume: PropTypes.string,
  children: PropTypes.any
};

export default withRouter(ContestsView);
