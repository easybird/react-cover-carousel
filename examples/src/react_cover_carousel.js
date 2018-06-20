import React from 'react';
import {ReactCoverCarousel} from 'react-cover-carousel';
import {StyleRoot} from 'radium';
import images from './data/images';
import Playground from 'component-playground';

const DefaultProps = require ('raw-loader!./carouselExamples/DefaultProps.example');
const RotationCoversInfiniteScroll = require ('raw-loader!./carouselExamples/RotationCoversInfiniteScroll.example');
const FlatCoversNoInfiniteScrollWithHeading = require ('raw-loader!./carouselExamples/FlatCoversNoInfiniteScrollWithHeading.example');
const FlatCoversWithStyleRoot = require ('raw-loader!./carouselExamples/FlatCoversWithStyleRoot.example');

const Application = () => {
  return (
    <div className="centered">
      <h2>Interactive Example Playground</h2>
      <div className="intro">
        <h4>
          {"Below examples show you how to use this library. You can play with the code in an interactive way. The example on the right will dynamically change as you touch the code. Thanks to the "}
          <a
            href="https://github.com/FormidableLabs/component-playground"
            target="_blank"
          >
            component-playground
          </a>
           {" HOC made by the guys from "}
          <a href="https://formidable.com/" target="_blank"> FormidableLabs </a>
        </h4>
      </div>
      <hr />
      <h2>Default ReactCoverCarousel</h2>
      <h4>This Carousel contains all the default props</h4>
      <div className="component-documentation">
        <Playground
          codeText={DefaultProps}
          scope={{React, images, ReactCoverCarousel}}
        />
      </div>
      <h2>Rotation Cover</h2>
      <h4>Infinite Scroll, 3 images each side, with rotation</h4>
      <div className="component-documentation">
        <Playground
          codeText={RotationCoversInfiniteScroll}
          scope={{React, images, ReactCoverCarousel}}
        />
      </div>
      <h2>
        Flat Cover
      </h2>
      <h4>
        No Infinite Scroll, with heading, 2 images each side, active: 3
      </h4>
      <div className="component-documentation">
        <Playground
          codeText={FlatCoversNoInfiniteScrollWithHeading}
          scope={{React, images, ReactCoverCarousel}}
        />
      </div>
      <h2>Flat Covers, with StyleRoot</h2>
      <h4>Infinite Scroll, 2 images each side, responsive, without rotation</h4>
      <div className="component-documentation">
        <Playground
          codeText={FlatCoversWithStyleRoot}
          scope={{React, images, ReactCoverCarousel, StyleRoot}}
        />
      </div>
    </div>
  );
};

export default Application;
