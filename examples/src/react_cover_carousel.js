import React from 'react';
import ReactDOM from 'react-dom';
import FontAwesome from 'react-fontawesome';
import {ReactCoverCarousel} from 'react-cover-carousel';

import 'font-awesome/css/font-awesome.css';

const button = (<FontAwesome name="rocket" size="2x" />);

const Application = () => (
  <div className="centered">
      <ReactCoverCarousel rowItems={4}>
        <FontAwesome name="google-plus-square" size="2x" />
        <FontAwesome name="twitter-square" size="2x" />
        <FontAwesome name="google" size="2x" />
        <FontAwesome name="google" size="2x" />

        <FontAwesome name="facebook-official" size="2x" />
        <FontAwesome name="twitter-square" size="2x" />
        <FontAwesome name="spotify" size="2x" />
        <FontAwesome name="twitter-square" size="2x" />

        <FontAwesome name="google-plus-square" size="2x" />
        <FontAwesome name="google" size="2x" />
        <FontAwesome name="twitter-square" size="2x" />
      </ReactCoverCarousel>
  </div>
);

console.log('loads!!')

ReactDOM.render(
  <Application />,
  document.getElementById('app')
)
