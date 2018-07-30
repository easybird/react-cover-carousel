import React, {Component} from 'react';
import '../styles/reactCoverCarousel.css';
import CoverCarousel from './CoverCarousel';
import Radium from 'radium';
import ZoomedCover from './ZoomedCover';
import {calculateMaxDelta, DIRECTION} from '../utils/compareXandYDirections';
import withScrollTresholdIndication from './withScrollTresholdIndicator';

class ReactCoverCarousel extends Component {
  constructor (props) {
    super (props);

    this.state = {
      activeIndex: props.activeImageIndex || 0,
      moveInPixels: 0,
      width: props.width,
      height: props.height,
      isMobileCarousel: true,
      isZoomedIn: false,
    };
  }

  static defaultProps = {
    width: 800,
    height: 400,
    displayQuantityOfSide: 3,
    navigation: false,
    enableHeading: false,
    enableScroll: true,
    activeImageIndex: 0,
    activeImageStyle: {
      margin: '5em',
    },
    activeFigureScale: 1.5,
    otherFigureScale: 0.8,
    otherFigureRotation: 40,
    mediaQueries: {},
    infiniteScroll: true,
    transitionSpeed: 700,
    autoFocus: false,
    maxPixelWidthForMobileMediaQuery: 680,
    zoomable: true,
  };

  busyMoving = false;
  lastMoveInPixels = 0;
  moveInPixels = false;
  lastMovement = 0;
  carouselDiv;

  componentDidMount () {
    this.updateDimensions (this.props.activeImageIndex);

    const eventListener = window && window.addEventListener;

    if (eventListener) {
      window.addEventListener ('resize', this.updateDimensions);
    }
    this.props.autoFocus && this.carouselDiv.focus ();
  }

  componentWillReceiveProps (nextProps) {
    // console.log (
    //   '---nextProps thresholdReached, tresholdPercentage scrolling scrollDirectionType scrollDirection',
    //   nextProps.tresholdReached,
    //   nextProps.tresholdPercentage,
    //   nextProps.scrolling,
    //   nextProps.scrollDirectionType,
    //   nextProps.scrollDirection,
    //   '\n'
    // );
    if (nextProps.tresholdReached && !this.props.tresholdReached) {
      if (
        this.props.scrollDirection === DIRECTION.LEFT ||
        nextProps.scrollDirection === DIRECTION.UP
      ) {
        this.handleNavigateToPreviousCover ();
      } else {
        this.handleNavigateToNextCover ();
      }
      this.props.onResetTreshold ();
    }

    if (this.props.activeImageIndex !== nextProps.activeImageIndex) {
      this.updateDimensions (nextProps.activeImageIndex);
    }
  }

  componentWillUnmount () {
    const removeListener = window && window.removeEventListener;

    if (removeListener) {
      window.removeEventListener ('resize', this.updateDimensions);
    }
  }

  get isMobile () {
    return (
      navigator &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test (
        navigator.userAgent
      )
    );
  }

  get isMobileCarousel () {
    if (this.props.maxPixelWidthForMobileMediaQuery && window) {
      if (
        this.isMobile ||
        this.props.maxPixelWidthForMobileMediaQuery > window.innerWidth
      ) {
        return true;
      }
    }
    return false;
  }

  updateDimensions = activeImageIndex => {
    const moveToIndex = activeImageIndex || this.props.activeImageIndex;
    const isMobileCarousel = this.isMobileCarousel;
    let width = this.state.width;
    let height = this.state.height;

    if (this.carouselDiv) {
      width = this.carouselDiv.offsetWidth;
      height = this.carouselDiv.offsetHeight;
    }

    this.setState ({width, height, isMobileCarousel}, () => {
      if (typeof moveToIndex === 'number') {
        this.triggerMovement (moveToIndex);
      }
    });
  };

  triggerMovement = activeIndex => {
    const moveInPixels = this.calculateMoveInPixels (activeIndex);

    this.lastmoveInPixels = moveInPixels;

    this.setState ({
      activeIndex,
      moveInPixels,
    });
  };

  get centralIndex () {
    let length = React.Children.count (this.props.children);
    return Math.floor (length / 2);
  }

  keyDown = e => {
    if (e.keyCode === 37) {
      this.handleNavigateToPreviousCover ();
    } else if (e.keyCode === 39) {
      this.handleNavigateToNextCover ();
    }
  };

  get totalNrOfVisibleImages () {
    return this.props.displayQuantityOfSide * 2 + 1;
  }

  get imageBaseWidth () {
    return this.state.width / this.totalNrOfVisibleImages;
  }

  get imageBaseHeight () {
    return this.state.height / this.totalNrOfVisibleImages;
  }

  handleCoverClick = (index, action, e) => {
    e.preventDefault ();

    const isActiveImage = this.state.activeIndex === index;

    if (!isActiveImage) {
      return this.triggerMovement (index);
    }

    if (!this.state.isZoomedIn) {
      return this.setState ({isZoomedIn: true});
    }

    if (this.state.isZoomedIn && typeof action === 'string') {
      // If action is a URL (string), follow the link
      window.open (action, '_blank');
    }
  };

  calculateMoveInPixels = index => {
    const distance = this.centralIndex - index;
    // console.log ('---distance', distance, this.centralIndex, index, '\n');
    const imageBase = this.state.isMobileCarousel
      ? this.imageBaseHeight
      : this.imageBaseWidth;
    // console.log ('---imageBase', imageBase, '\n');

    return distance * imageBase;
  };

  handleNavigateToPreviousCover = () => {
    const {infiniteScroll, children} = this.props;
    let {activeIndex} = this.state;

    let newActiveImageIndex = null;

    if (activeIndex - 1 >= 0) {
      newActiveImageIndex = activeIndex - 1;
    } else if (activeIndex - 1 < 0 && infiniteScroll) {
      newActiveImageIndex = children.length - 1;
    }
    if (typeof newActiveImageIndex === 'number') {
      this.triggerMovement (newActiveImageIndex);
    }
  };

  handleNavigateToNextCover = () => {
    const {infiniteScroll, children} = this.props;
    let {activeIndex} = this.state;

    let newActiveImageIndex = null;

    if (activeIndex + 1 < children.length) {
      newActiveImageIndex = activeIndex + 1;
    } else if (activeIndex + 1 >= children.length && infiniteScroll) {
      newActiveImageIndex = 0;
    }
    if (typeof newActiveImageIndex === 'number') {
      this.triggerMovement (newActiveImageIndex);
    }
  };

  getTouchMovement (e) {
    const nativeTouchEvents = e.nativeEvent.touches[0];
    return this.state.isMobileCarousel
      ? nativeTouchEvents.clientY
      : nativeTouchEvents.clientX;
  }

  handleTouchStart = e => {
    this.lastMovement = this.getTouchMovement (e);
    this.lastMoveInPixels = this.state.moveInPixels;
  };

  handleTouchMove = e => {
    e.preventDefault ();

    let moveInPixels = this.getTouchMovement (e) - this.lastMovement;
    let totalmoveInPixels = this.lastMoveInPixels - moveInPixels;
    let sign = Math.abs (moveInPixels) / moveInPixels;
    console.log (
      '---handleTouchMove',
      moveInPixels,
      totalmoveInPixels,
      sign,
      '\n'
    );

    if (
      Math.abs (totalmoveInPixels) >= this.state.isMobileCarousel
        ? this.imageBaseHeight
        : this.imageBaseWidth
    ) {
      let navigateToFn = null;
      if (sign > 0) {
        navigateToFn = this.handleNavigateToPreviousCover;
      } else if (sign < 0) {
        navigateToFn = this.handleNavigateToNextCover;
      }
      if (typeof navigateToFn === 'function') {
        if (!this.busyMoving) {
          this.busyMoving = true;
          navigateToFn ();

          setTimeout (() => (this.busyMoving = false), 1000);
        }
      }
    }
  };

  render () {
    const {
      enableScroll,
      navigation,
      mediaQueries,
      enableHeading,
      children,
      transitionSpeed,
      activeFigureScale,
      otherFigureRotation,
      otherFigureScale,
      activeImageStyle,
      displayQuantityOfSide,
      infiniteScroll,
      PreviousButton,
      NextButton,
    } = this.props;
    const {width, height, activeIndex, moveInPixels, isZoomedIn} = this.state;

    return [
      <div
        ref={carouselDiv => {
          this.carouselDiv = carouselDiv;
        }}
        className="container"
        style={
          Object.keys (mediaQueries).length !== 0
            ? mediaQueries
            : {width: `${width}px`, height: `${height}px`}
        }
        onWheel={enableScroll && !isZoomedIn ? this.props.onWheel : undefined}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onKeyDown={this.keyDown}
        tabIndex="-1"
      >
        <CoverCarousel
          navigation={navigation}
          enableHeading={enableHeading}
          activeIndex={activeIndex}
          transitionSpeed={transitionSpeed}
          moveInPixels={moveInPixels}
          activeFigureScale={activeFigureScale}
          otherFigureRotation={otherFigureRotation}
          otherFigureScale={otherFigureScale}
          activeImageStyle={activeImageStyle}
          displayQuantityOfSide={displayQuantityOfSide}
          imageBase={
            this.state.isMobileCarousel
              ? this.imageBaseHeight
              : this.imageBaseWidth
          }
          infiniteScroll={infiniteScroll}
          PreviousButton={PreviousButton}
          NextButton={NextButton}
          onNavigateToPreviousCover={this.handleNavigateToPreviousCover}
          onNavigateToNextCover={this.handleNavigateToNextCover}
          onCoverClick={this.handleCoverClick}
          isMobileCarousel={this.state.isMobileCarousel}
        >
          {children}
        </CoverCarousel>

        <ZoomedCover
          Cover={
            children && typeof activeIndex === 'number' && children[activeIndex]
          }
          isZoomedIn={isZoomedIn}
          onStopZoom={() => this.setState ({isZoomedIn: false})}
        />
      </div>,
    ];
  }
}

ReactCoverCarousel.displayName = 'ReactCoverCarousel';

export default withScrollTresholdIndication (Radium (ReactCoverCarousel));
