import React, {Fragment} from 'react';
import { render } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons'
import Examples from './react_cover_carousel';
import './style.css';

const Application = () => (
  <Fragment>
    <div id="header">
      <h2>
        <FontAwesomeIcon icon={faBasketballBall}/>
        React Cover Carousel
        <FontAwesomeIcon icon={faBasketballBall} />
      </h2>
    </div>
    <Examples />
  </Fragment>
);

render (<Application />, document.getElementById ('app'));
