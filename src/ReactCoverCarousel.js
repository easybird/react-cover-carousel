/**
 * React Cover Carousel
 *
 * Author: easybird
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styles from './reactCoverCarousel.css';
import Radium from 'radium';
import CoverCarousel from './components.js/CoverCarousel';

class ReactCoverCarousel extends Component {
  /**
   * Life cycle events
   */
  constructor (props) {
    super (props);

    this.state = {
      activeIndex: props.activeImageIndex || 0,
      move: 0,
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
  lastMove = 0;
  move = false;
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
        move: this._calculateMove (activeImageIndex),
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
      this._handlePrevFigure ();
    } else if (e.keyCode === 39) {
      this._handleNextFigure ();
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
      // Move to the selected figure
      e.preventDefault ();

      this.setState ({activeIndex: index, move: this._calculateMove (index)});
    }
  };

  _calculateMove = index => {
    let distance = this._center () - index;
    return distance * this.imageBaseWidth;
  };

  _handlePrevFigure = () => {
    const {infiniteScroll} = this.props;
    let {activeIndex} = this.state;

    let newActiveImageIndex = null;

    if (activeIndex - 1 >= 0) {
      newActiveImageIndex = activeIndex - 1;
    } else if (activeIndex - 1 < 0 && infiniteScroll) {
      newActiveImageIndex = this.props.children.length - 1;
    }
    if (typeof newActiveImageIndex === 'number') {
      const move = this._calculateMove (newActiveImageIndex);
      this.setState ({activeIndex: newActiveImageIndex, move});
      this.lastMove = move;
    }
  };

  _handleNextFigure = () => {
    const {infiniteScroll} = this.props;
    let {activeIndex} = this.state;

    let newActiveImageIndex = null;

    if (activeIndex + 1 < this.props.children.length) {
      newActiveImageIndex = activeIndex + 1;
    } else if (
      activeIndex + 1 >= this.props.children.length &&
      infiniteScroll
    ) {
      newActiveImageIndex = 0;
    }
    if (typeof newActiveImageIndex === 'number') {
      const move = this._calculateMove (newActiveImageIndex);
      this.setState ({activeIndex: newActiveImageIndex, move});
      this.lastMove = move;
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
          func = this._handlePrevFigure;
        } else if (sign < 0) {
          func = this._handleNextFigure;
        }

        func && func ();
        setTimeout (() => (this.busyScrolling = false), 1000);
      }
    }
  }

  _handleTouchStart (e) {
    this.lastX = e.nativeEvent.touches[0].clientX;
    this.lastMove = this.state.move;
  }

  _handleTouchMove (e) {
    e.preventDefault ();

    let clientX = e.nativeEvent.touches[0].clientX;
    let lastX = this.lastX;
    let move = clientX - lastX;
    let totalMove = this.lastMove - move;
    let sign = Math.abs (move) / move;

    if (Math.abs (totalMove) >= this.imageBaseWidth) {
      let fn = null;
      if (sign > 0) {
        fn = this._handlePrevFigure ();
      } else if (sign < 0) {
        fn = this._handleNextFigure ();
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
    const {width, height, activeIndex, move} = this.state;

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
          move={move}
          activeFigureScale={activeFigureScale}
          otherFigureRotation={otherFigureRotation}
          otherFigureScale={otherFigureScale}
          activeImageStyle={activeImageStyle}
          displayQuantityOfSide={displayQuantityOfSide}
          imageBaseWidth={this.imageBaseWidth}
          infiniteScroll={infiniteScroll}
          PreviousButton={PreviousButton}
          NextButton={NextButton}
          onNavigateToPreviousCover={this._handlePrevFigure}
          onNavigateToNextCover={this._handleNextFigure}
          onCoverClick={this.handleCoverClick}
        >
          {children}
        </CoverCarousel>
      </div>
    );
  }
}

ReactCoverCarousel.displayName = 'ReactCoverCarousel';

export default Radium (ReactCoverCarousel);
