import React from 'react';
import ReactDOM from 'react-dom';
import {ReactCoverCarousel} from 'react-cover-carousel';
import {StyleRoot} from 'radium';
import images from './data/images';

const Application = () => {
  return (
    <div className="centered">
      <h1>Infinite Scroll, 3 images each side, with rotation</h1>
      <ReactCoverCarousel
        width={960}
        height={500}
        displayQuantityOfSide={3}
        infiniteScroll={true}
        navigation={true}
        enableHeading={false}
        activeImageIndex={0}
      >
        {images}
      </ReactCoverCarousel>
      <h1>
        No Infinite Scroll, , with heading, 2 images each side, active: 3, without rotation
      </h1>
      <ReactCoverCarousel
        width={550}
        height={300}
        displayQuantityOfSide={2}
        navigation={true}
        enableHeading={true}
        activeImageIndex={3}
        otherFigureRotation={0}
      >
        {images}
      </ReactCoverCarousel>
      <h1>Infinite Scroll, 2 images each side, responsive, without rotation</h1>
      <StyleRoot>
        <ReactCoverCarousel
          media={{
            backgroundColor: 'white',
            width: '100%',
            '@media (max-width: 900px)': {
              height: '300px',
            },
            '@media (min-width: 900px)': {
              height: '400px',
            },
          }}
          displayQuantityOfSide={2}
          infiniteScroll={true}
          navigation={true}
          enableHeading={false}
          activeImageIndex={0}
          otherFigureRotation={0}
          currentFigureScale={2.5}
          otherFigureScale={0.9}
        >
          {images}
        </ReactCoverCarousel>
      </StyleRoot>
    </div>
  );
};

ReactDOM.render (<Application />, document.getElementById ('app'));
