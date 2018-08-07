import React, {Component} from 'react';
import ReactModal from 'react-modal';
import styles from '../styles/zoomedCover.css';
import {calculateMaxDelta} from '../utils/compareXandYDirections';
import withScrollTresholdIndication from './withScrollTresholdIndicator';

ReactModal.setAppElement ('body');

const CLOSE_TIMEOUT_MS = 300;

class ZoomedCover extends Component {
  state = {
    prepareStopZoom: false,
  };

  componentWillReceiveProps (nextProps) {
    if (!this.state.prepareStopZoom) {
      if (nextProps.scrolling && this.props.scrolling !== nextProps.scrolling) {
        this.setState ({prepareStopZoom: true});
      }
    } else {
      if (
        !nextProps.scrolling &&
        this.props.scrolling !== nextProps.scrolling
      ) {
        this.props.onStopZoom();
      }
    }

    if (this.props.isZoomedIn && !nextProps.isZoomedIn) {
      setTimeout(() => this.setState({prepareStopZoom: false}), CLOSE_TIMEOUT_MS);
    }
  }

  handleOnWheelEvent = e => {
    e.preventDefault ();
    const deltaXorY = calculateMaxDelta ({deltaX: e.deltaX, deltaY: e.deltaY});
    console.log (deltaXorY);
    // this.props.onStopZoom ();
    // this.setState ({
    //   prepareStopZoom: false,
    // });
  };

  render () {
    const {Cover, isZoomedIn, onStopZoom} = this.props;

    const maxWidth = Math.min (window.innerWidth, window.innerHeight);
    const imageWidth = maxWidth; // only works well with square images..

    let opacity = 1;

    if (this.state.prepareStopZoom) {
      opacity = 0.5;
    }

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
        <div className={styles.coverContainer} style={{ opacity}} onWheel={this.props.onWheel}>
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
              draggable: true,
              //   onDragStart: this.onPrepareStopZoom,
              //   onDragEnd: this.onStopZoom,
            })}
          </div>
        </div>
      </ReactModal>
    );
  }
}

export default withScrollTresholdIndication (ZoomedCover, {resetScrollTimeoutMs: 100});
