import React, {Component} from 'react';
import ReactModal from 'react-modal';
import styles from '../styles/zoomedCover.css';
import {calculateMaxDelta} from '../utils/compareXandYDirections';
import withScrollTresholdIndication from './withScrollTresholdIndicator';
ReactModal.setAppElement ('body');
const CLOSE_TIMEOUT_MS = 300;

class ZoomedCover extends Component {
  state = {
    opacity: 1,
  };

  touchStart;
  onSwiped;

  componentWillReceiveProps (nextProps) {
    if (this.state.opacity !== 0.5) {
      if (nextProps.scrolling && this.props.scrolling !== nextProps.scrolling) {
        this.setState ({opacity: 0.5});
      }
    } else {
      if (
        !nextProps.scrolling &&
        this.props.scrolling !== nextProps.scrolling
      ) {
        this.props.onStopZoom ();
      }
    }

    if (this.props.isZoomedIn && !nextProps.isZoomedIn) {
      setTimeout (
        () => this.setState ({opacity: 1}),
        CLOSE_TIMEOUT_MS
      );
    }
  }

  handleOnWheelEvent = e => {
    e.preventDefault ();
    const deltaXorY = calculateMaxDelta ({deltaX: e.deltaX, deltaY: e.deltaY});
  };

  handleOnTouchStart = e => {
    this.onSwiped = null;

    if (e.touches.length < 2) {
      this.touchStart = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
      };
    }
  };

  calculateMovement = e => {
    const x = e.touches[0].pageX;
    const y = e.touches[0].pageY;

    return {
      xMovement: Math.abs (this.touchStart.x - x),
      yMovement: Math.abs (this.touchStart.y - y),
    };
  };

  handleOnTouchMove = e => {
    if (e.touches.length > 1) {
      return;
    }

    if (window) {
      const {xMovement, yMovement} = this.calculateMovement (e);
      const maxMovement = Math.max (xMovement, yMovement);
      const fullSwipe = Math.round (400 / window.devicePixelRatio);
      const swipePercentage = maxMovement / fullSwipe

      if (swipePercentage > 1) {
        this.onSwiped = true;
      } else {
        this.setState({
          opacity: 1-swipePercentage
        })
      }
    }
    e.preventDefault();
    return null;
  };

  handleOnTouchEnd = () => {
    this.touchStart = null;
    if (this.onSwiped) {
      this.props.onStopZoom();
    } else {
      this.setState({ opacity: 1})
    }
  };

  render () {
    const {Cover, isZoomedIn, onStopZoom} = this.props;
    const { opacity} = this.state;

    const maxWidth = Math.min (window.innerWidth, window.innerHeight);
    const imageWidth = maxWidth; // only works well with square images..

    return (
      <ReactModal
        style={{
          overlay: {zIndex: 10001},
          content: {top: 0, left: 0, right: 0, bottom: 0, opacity},
        }}
        isOpen={isZoomedIn}
        closeTimeoutMS={CLOSE_TIMEOUT_MS}
        onRequestClose={() => {}}
        htmlOpenClassName="ReactModal__Html--open"
      >
        <div
          className={styles.coverContainer}
          style={{opacity}}
          onWheel={this.props.onWheel}
        >
          <a className={styles.coverMenu} onClick={onStopZoom}>
            <div id={styles.menuToggle}>
              <span />
              <span />
            </div>
          </a>
          <div>
            {React.cloneElement (Cover, {
              className: styles.coverContent,
              style: {
                width: `${imageWidth}px`,
              },
              draggable: false,
              onTouchStart: this.handleOnTouchStart,
              onTouchMove: this.handleOnTouchMove,
              onTouchEnd: this.handleOnTouchEnd,
            })}
          </div>
        </div>
      </ReactModal>
    );
  }
}

export default withScrollTresholdIndication (ZoomedCover, {
  resetScrollTimeoutMs: 100,
});
