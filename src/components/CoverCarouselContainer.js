import React, {Component} from 'react';
import styles from '../styles/coverCarouselContainer.css'
import CoverCarousel from './CoverCarousel';

class CoverCarouselContainer extends Component {
  constructor (props) {
    super (props);

    this.state = {
      activeIndex: props.activeImageIndex || 0,
      moveXInPixels: 0,
      width: props.width,
      height: props.height,
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
  };

  busyScrolling = false;
  lastMoveXInPixels = 0;
  moveXInPixels = false;
  lastX = 0;
  carouselDiv;

  componentDidMount () {
    setTimeout (() => this.updateDimensions (this.props.activeImageIndex), 5);

    const eventListener = window && window.addEventListener;

    if (eventListener) {
      window.addEventListener ('resize', this.updateDimensions.bind (this));
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
      window.removeEventListener ('resize', this.updateDimensions.bind (this));
    }
  }

  updateDimensions (activeImageIndex) {
    const {children} = this.props;
    let length = React.Children.count (children);

    const width = ReactDOM.findDOMNode (this).offsetWidth;
    const height = ReactDOM.findDOMNode (this).offsetHeight;

    this.setState ({width, height});

    if (typeof activeImageIndex === 'number' && activeImageIndex < length) {
      this.setState ({
        activeIndex: activeImageIndex,
        moveXInPixels: this._calculateMove (activeImageIndex),
      });
    }
  }

  /**
   * Private methods
   */
  _center () {
    let length = React.Children.count (this.props.children);
    return Math.floor (length / 2);
  }

  _keyDown (e) {
    if (e.keyCode === 37) {
      this.handleNavigateToPreviousCover ();
    } else if (e.keyCode === 39) {
      this.handleNavigateToNextCover ();
    }
  }

  get imageBaseWidth () {
    const totalNrOfVisibleImages = this.props.displayQuantityOfSide * 2 + 1;

    return this.state.width / totalNrOfVisibleImages;
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
      // moveXInPixels to the selected figure
      e.preventDefault ();

      this.setState ({activeIndex: index, moveXInPixels: this._calculateMove (index)});
    }
  };

  _calculateMove = index => {
    let distance = this._center () - index;
    return distance * this.imageBaseWidth;
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
      const moveXInPixels = this._calculateMove (newActiveImageIndex);
      this.setState ({activeIndex: newActiveImageIndex, moveXInPixels});
      this.lastMoveXInPixels = moveXInPixels;
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
      const moveXInPixels = this._calculateMove (newActiveImageIndex);
      this.setState ({activeIndex: newActiveImageIndex, moveXInPixels});
      this.lastMoveXInPixels = moveXInPixels;
    }
  };

  _handleWheel (e) {
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
        let func = null;

        if (sign > 0) {
          func = this.handleNavigateToPreviousCover;
        } else if (sign < 0) {
          func = this.handleNavigateToNextCover;
        }

        func && func ();
        setTimeout (() => (this.busyScrolling = false), 1000);
      }
    }
  }

  _handleTouchStart (e) {
    this.lastX = e.nativeEvent.touches[0].clientX;
    this.lastMoveXInPixels = this.state.moveXInPixels;
  }

  _handleTouchMove (e) {
    e.preventDefault ();

    let clientX = e.nativeEvent.touches[0].clientX;
    let lastX = this.lastX;
    let moveXInPixels = clientX - lastX;
    let totalmoveXInPixels = this.lastMoveXInPixels - moveXInPixels;
    let sign = Math.abs (moveXInPixels) / moveXInPixels;

    if (Math.abs (totalmoveXInPixels) >= this.imageBaseWidth) {
      let fn = null;
      if (sign > 0) {
        fn = this.handleNavigateToPreviousCover ();
      } else if (sign < 0) {
        fn = this.handleNavigateToNextCover ();
      }
      if (typeof fn === 'function') {
        fn ();
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
    const {width, height, activeIndex, moveXInPixels} = this.state;

    return (
      <div
        className={styles.container}
        style={
          Object.keys (mediaQueries).length !== 0
            ? mediaQueries
            : {width: `${width}px`, height: `${height}px`}
        }
        onWheel={enableScroll ? this._handleWheel.bind (this) : null}
        onTouchStart={this._handleTouchStart.bind (this)}
        onTouchMove={this._handleTouchMove.bind (this)}
        onKeyDown={this._keyDown.bind (this)}
        tabIndex="-1"
        ref={carouselDiv => (this.carouselDiv = carouselDiv)}
      >
        <CoverCarousel
          navigation={navigation}
          enableHeading={enableHeading}
          activeIndex={activeIndex}
          transitionSpeed={transitionSpeed}
          moveXInPixels={moveXInPixels}
          activeFigureScale={activeFigureScale}
          otherFigureRotation={otherFigureRotation}
          otherFigureScale={otherFigureScale}
          activeImageStyle={activeImageStyle}
          displayQuantityOfSide={displayQuantityOfSide}
          imageBaseWidth={this.imageBaseWidth}
          infiniteScroll={infiniteScroll}
          PreviousButton={PreviousButton}
          NextButton={NextButton}
          onNavigateToPreviousCover={this.handleNavigateToPreviousCover}
          onNavigateToNextCover={this.handleNavigateToNextCover}
          onCoverClick={this.handleCoverClick}
        >
          {children}
        </CoverCarousel>
      </div>
    );
  }
}

export default CoverCarouselContainer;
