import React, {Component} from 'react';
import styles from '../styles/reactCoverCarousel.css'
import CoverCarousel from './CoverCarousel';
import Radium from 'radium';

class ReactCoverCarousel extends Component {
  constructor (props) {
    super (props);

    this.state = {
      activeIndex: props.activeImageIndex || 0,
      moveInPixels: 0,
      width: props.width,
      height: props.height,
      isMobileCarousel: true
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
    clickable: true,
    activeFigureScale: 1.5,
    otherFigureScale: 0.8,
    otherFigureRotation: 40,
    mediaQueries: {},
    infiniteScroll: true,
    transitionSpeed: 700,
    autoFocus: false,
    maxPixelWidthForMobileMediaQuery: 480
  };

  busyScrolling = false;
  lastMoveInPixels = 0;
  moveInPixels = false;
  lastMovement = 0;
  carouselDiv;

  componentDidMount () {
    setTimeout (() => this.updateDimensions (this.props.activeImageIndex), 5);

    const eventListener = window && window.addEventListener;

    if (eventListener) {
      window.addEventListener ('resize', this.updateDimensions);
    }
    this.props.autoFocus && this.carouselDiv.focus ();
  }

  componentWillReceiveProps (nextProps) {
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

  get isMobileCarousel() {
    if (this.props.maxPixelWidthForMobileMediaQuery && window) {
      console.log('window innerwidth', window.innerWidth);
      if (this.props.maxPixelWidthForMobileMediaQuery > window.innerWidth) {
        return true;
      }
    }
    return false;
  }

  updateDimensions = (activeImageIndex) => {
    const width = ReactDOM.findDOMNode (this).offsetWidth;
    const height = ReactDOM.findDOMNode (this).offsetHeight;

    this.setState ({width, height, isMobileCarousel: this.isMobileCarousel});

    if (typeof activeImageIndex === 'number') {
      this.triggerMovement(activeImageIndex);
    }
  }

  triggerMovement = (activeIndex) => {
    const moveInPixels = this.calculateMoveInPixels (activeIndex);
    
    this.lastmoveInPixels = moveInPixels;
      
    this.setState ({
      activeIndex,
      moveInPixels,
    });
  }

  get centralIndex () {
    let length = React.Children.count (this.props.children);
    return Math.floor (length / 2);
  }

  keyDown = (e) => {
    if (e.keyCode === 37) {
      this.handleNavigateToPreviousCover ();
    } else if (e.keyCode === 39) {
      this.handleNavigateToNextCover ();
    }
  }

  get totalNrOfVisibleImages() {
    return this.props.displayQuantityOfSide * 2 + 1
  }

  get imageBaseWidth () {
    return this.state.width / this.totalNrOfVisibleImages;
  }

  get imageBaseHeight () {
    return this.state.height / this.totalNrOfVisibleImages;
  }

  handleCoverClick = (index, action, e) => {
    if (!this.props.clickable) {
      e.preventDefault ();
      return;
    }

    if (this.state.activeIndex === index) {
      // If on the active figure
      if (typeof action === 'string') {
        // If action is a URL (string), follow the link
        window.open (action, '_blank');
      }

    } else {
      e.preventDefault ();
      this.triggerMovement(index);
    }
  };

  calculateMoveInPixels = index => {
    const distance = this.centralIndex - index;
    console.log('---distance', distance, this.centralIndex, index, '\n');
    const imageBase = (this.state.isMobileCarousel ? this.imageBaseHeight: this.imageBaseWidth);
    console.log('---imageBase', imageBase, '\n');
    
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
      this.triggerMovement(newActiveImageIndex);
    }
  };

  handleNavigateToNextCover = () => {
    const {infiniteScroll, children} = this.props;
    let {activeIndex} = this.state;

    let newActiveImageIndex = null;

    if (activeIndex + 1 < children.length) {
      newActiveImageIndex = activeIndex + 1;
    } else if (
      activeIndex + 1 >= children.length &&
      infiniteScroll
    ) {
      newActiveImageIndex = 0;
    }
    if (typeof newActiveImageIndex === 'number') {
      this.triggerMovement(newActiveImageIndex);
    }
  };

  handleWheel = (e) => {
    e.preventDefault ();

    if (!this.busyScrolling) {
      const deltaXOrY = Math.max (Math.abs (e.deltaY), Math.abs (e.deltaX)) ===
        Math.abs (e.deltaY)
        ? e.deltaY
        : e.deltaX;

      this.busyScrolling = true;
      let delta = Math.abs (deltaXOrY) === 125
        ? deltaXOrY * -120
        : deltaXOrY < 0 ? -600000 : 600000;
      let count = Math.ceil (Math.abs (delta) / 120);

      if (count > 0) {
        const sign = Math.abs (delta) / delta;
        let navigateToFn = null;

        if (sign > 0) {
          navigateToFn = this.handleNavigateToPreviousCover;
        } else if (sign < 0) {
          navigateToFn = this.handleNavigateToNextCover;
        }

        navigateToFn && navigateToFn ();
        setTimeout (() => (this.busyScrolling = false), 1000);
      }
    }
  }

  getTouchMovement(e) {
    const nativeTouchEvents = e.nativeEvent.touches[0];
    this.lastMovement = this.state.isMobileCarousel ? nativeTouchEvents.clientY : nativeTouchEvents.clientX;
  }

  handleTouchStart = (e) =>  {
    //TODO mobile: should be clientY on mobile
    this.lastMovement = this.getTouchMovement(e);
    this.lastMoveInPixels = this.state.moveInPixels;
  }

  handleTouchMove = (e) => {
    e.preventDefault ();

    let moveInPixels = this.getTouchMovement(e) - this.lastMovement;
    let totalmoveInPixels = this.lastMoveInPixels - moveInPixels;
    let sign = Math.abs (moveInPixels) / moveInPixels;

    if (Math.abs (totalmoveInPixels) >= this.state.isMobileCarousel ? this.imageBaseHeight : this.imageBaseWidth) {
      let navigateToFn = null;
      if (sign > 0) {
        navigateToFn = this.handleNavigateToPreviousCover ();
      } else if (sign < 0) {
        navigateToFn = this.handleNavigateToNextCover ();
      }
      if (typeof navigateToFn === 'function') {
        navigateToFn ();
      }
    }
  }

  // shadow: al dan niet
  // previous / next :-> kies de tests (of icoontje)

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
      NextButton
    } = this.props;
    const {width, height, activeIndex, moveInPixels} = this.state;

    return (
      <div
        className={styles.container}
        style={
          Object.keys (mediaQueries).length !== 0
            ? mediaQueries
            : {width: `${width}px`, height: `${height}px`}
        }
        onWheel={enableScroll && this.handleWheel}
        onTouchStart={this.handleTouchStart}
        onTouchMove={this.handleTouchMove}
        onKeyDown={this.keyDown}
        tabIndex="-1"
        ref={carouselDiv => (this.carouselDiv = carouselDiv)}
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
          imageBase={this.state.isMobileCarousel ? this.imageBaseHeight : this.imageBaseWidth}
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
      </div>
    );
  }
}

ReactCoverCarousel.displayName = 'ReactCoverCarousel';

export default Radium(ReactCoverCarousel);
