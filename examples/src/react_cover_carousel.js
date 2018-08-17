import React from 'react';
import ReactCoverCarousel from 'react-cover-carousel';
import {StyleRoot} from 'radium';
import images from './data/images';
import ReactModal from 'react-modal';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import './style.css';
import {LiveProvider, LiveEditor, LiveError, LivePreview} from 'react-live';

ReactModal.setAppElement ('body');

const DefaultProps = require ('raw-loader!./carouselExamples/DefaultProps.example');
const RotationCoversInfiniteScroll = require ('raw-loader!./carouselExamples/RotationCoversInfiniteScroll.example');
const FlatCoversNoInfiniteScrollWithHeading = require ('raw-loader!./carouselExamples/FlatCoversNoInfiniteScrollWithHeading.example');
const FlatCoversWithStyleRoot = require ('raw-loader!./carouselExamples/FlatCoversWithStyleRoot.example');
const VerticalCoverCarousel = require ('raw-loader!./carouselExamples/VerticalCoverCarousel.example');

class ModalExample extends React.Component {
  constructor () {
    super ();
    this.state = {
      showModal: false,
    };

    this.handleOpenModal = this.handleOpenModal.bind (this);
    this.handleCloseModal = this.handleCloseModal.bind (this);
  }

  handleOpenModal () {
    this.setState ({showModal: true});
  }

  handleCloseModal () {
    this.setState ({showModal: false});
  }

  render () {
    return (
      <div className="modalExample">
        <button onClick={this.handleOpenModal}>Open Example in Modal</button>
        <ReactModal
          style={{
            overlay: {zIndex: 1001},
            content: {top: 0, left: 0, right: 0, bottom: 0},
          }}
          isOpen={this.state.showModal}
          contentLabel="Modal Example"
        >
          <button onClick={this.handleCloseModal}>Close Modal</button>
          <LiveProvider
            code={FlatCoversWithStyleRoot}
            scope={{
              React,
              images,
              ReactCoverCarousel,
              StyleRoot,
              FontAwesomeIcon,
              faArrowLeft,
              faArrowRight,
            }}
          >
            <LiveEditor />
            <LiveError />
            <LivePreview />
          </LiveProvider>
        </ReactModal>
      </div>
    );
  }
}

const Application = () => {
  return (
    <div className="content">
      <h2>Interactive Example Playground</h2>
      <div className="intro">
        <p>
          {
            'Below examples show you how to use this library. You can play with the code in an interactive way. The example on the right will dynamically change as you touch the code. Thanks to the '
          }
          <a
            href="https://github.com/FormidableLabs/react-live"
            target="_blank"
          >
            react-live
          </a>
          {' HOC made by the guys from '}
          <a href="https://formidable.com/" target="_blank"> FormidableLabs </a>
        </p>
      </div>
      <hr />
      <h2>Default ReactCoverCarousel</h2>
      <h4>This Carousel contains all the default props</h4>
      <LiveProvider
        code={DefaultProps}
        scope={{React, images, ReactCoverCarousel}}
      >
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
      <hr />
      <h2>Rotation Cover</h2>
      <h4>Infinite Scroll, 3 images each side, with rotation</h4>
      <LiveProvider
        code={RotationCoversInfiniteScroll}
        scope={{React, images, ReactCoverCarousel}}
      >
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
      <hr />
      <h2>Vertical CoverCarousel </h2>
      <h4>
        When height is bigger than width, the carousel will behave in a vertical direction
      </h4>
      <LiveProvider
        code={VerticalCoverCarousel}
        scope={{React, images, ReactCoverCarousel}}
      >
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
      <hr />
      <h2>
        Flat Cover
      </h2>
      <h4>
        No Infinite Scroll, with heading, 2 images each side, active: 3
      </h4>
      <LiveProvider
        code={FlatCoversNoInfiniteScrollWithHeading}
        scope={{React, images, ReactCoverCarousel}}
      >
        <LiveEditor />
        <LiveError />
        <LivePreview />
      </LiveProvider>
      <hr />
      <h2>Flat Covers, with StyleRoot</h2>
      <h4>Infinite Scroll, 2 images each side, responsive, without rotation</h4>
      <ModalExample />
    </div>
  );
};

export default Application;
