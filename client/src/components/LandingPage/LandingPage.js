import React from 'react';
import './LandingPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons'
import showSkills from '../../utils/showSkills.jpg';
import bp1 from '../../utils/best-photos/bp1.jpg';
import bp2 from '../../utils/best-photos/bp2.jpg';
import bp3 from '../../utils/best-photos/bp3.jpg';
import bp4 from '../../utils/best-photos/bp4.jpg';
import bp5 from '../../utils/best-photos/bp5.jpg';
import bp6 from '../../utils/best-photos/bp6.jpg';
import Register from '../../containers/UserAuth/Register/Register.js';


const LandingPage = () => {

  return (
    <>
      <div className="container">


        <div className="row">
          <div className="col background-photo">
            <div className="welcome-text">
              <h5>The World Greatest</h5>
              <h1>PHOTO CHALLENGES</h1>
              <div>
                <FontAwesomeIcon
                  icon={faCamera}
                  size='lg'
                  className="mr-1"
                />
              </div>
              <div>
                Enter now to win great contest and your work seen around the world.
              </div>
            </div>
          </div>
        </div>

        <div className="row pt-5 pb-5">
          <div className="col-5 text-center">
            <img style={{ maxHeight: "350px" }} className="img-fluid" src={showSkills} alt="Photo" />
          </div>
          <div className="col-7 align-self-center">
            <h5>SHOW YOUR SKILLS</h5>
            <div className="text-fluid w-75">
              Join fresh daily photo challenges. Get inspired and join thousands sharing their passion for photography. Get started today and become a photo master.
            </div>
          </div>
        </div>

        <div className="row align-items-center pb-5">
          <div className="text-center">
            <img className="base-image img-fluid" src={bp1} alt="Photo" />
            <img className="base-image img-fluid" src={bp2} alt="Photo" />
            <img className="base-image img-fluid" src={bp3} alt="Photo" />
            <img className="base-image img-fluid" src={bp4} alt="Photo" />
            <img className="base-image img-fluid" src={bp5} alt="Photo" />
            <img className="base-image img-fluid" src={bp6} alt="Photo" />
          </div>
        </div>

        <div className="row pb-5 text-center">

          <div className="col-4">
            <div>
              <FontAwesomeIcon
                icon={faCamera}
                size='3x'
                className="mr-1"
              />
            </div>
            <h5>
              Choose a challenge
            </h5>
            <div>
            Choose between thousands of challenges in different categories. Choose the one the suits you best and enter the challenge.
            </div>
          </div>

          <div className="col-4">
            <div>
              <FontAwesomeIcon
                icon={faCamera}
                size='3x'
                className="mr-1"
              />
            </div>
            <h5>
              Upload your best shots
            </h5>
            <div>
              Choose your best photo. Submit it in contest of your choice and get rated by our juries.
            </div>
          </div>

          <div className="col-4">
            <div>
              <FontAwesomeIcon
                icon={faCamera}
                size='3x'
                className="mr-1"
              />
            </div>
            <h5>
              Become a master
            </h5>
            <div>
              You can join multiple contests. Gain the highest scores from the jury and become a photo master.
            </div>
          </div>

        </div>

        <div className="row pb-5">
          <Register />
        </div>


      </div>
    </>
  )
}

export default LandingPage;
