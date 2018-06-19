import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import FontAwesome from 'react-fontawesome';
import Examples from './react_cover_carousel';

import 'font-awesome/css/font-awesome.css';

const Application = () => (
  <Fragment>
    <div id="header">
      <h2>
        <FontAwesome name="diamond" size="1x" />
        React Cover Carousel
        <FontAwesome name="diamond" size="1x" />
      </h2>
    </div>
    <Examples />
  </Fragment>
);

ReactDOM.render (<Application />, document.getElementById ('app'));
