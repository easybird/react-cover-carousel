/**
 * React Cover Carousel
 *
 * Author: easybird
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import styles from './reactCoverCarousel.css';
import Radium from 'radium';

let TOUCH = {
  move: false,
  lastX: 0,
  sign: 0,
  lastMove: 0,
};

let TRANSITIONS = [
  'transitionend',
  'oTransitionEnd',
  'otransitionend',
  'MSTransitionEnd',
  'webkitTransitionEnd',
];

let HandleAnimationState = function () {
  this._removePointerEvents ();
};

class ReactCoverCarousel extends Component {
  /**
   * Life cycle events
   */
  constructor (props) {
    super (props);
    this.state = {
      current: this._center (),
      move: 0,
      width: this.props.width,
      height: this.props.height,
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
    currentFigureScale: 1.5,
    otherFigureScale: 0.8,
    otherFigureRotation: 40,
    mediaQueries: {},
    infiniteScroll: true,
    transitionSpeed: 700,
  };

  busyScrolling = false;

  componentDidMount () {
    this.updateDimensions ();
    let length = React.Children.count (this.props.children);

    TRANSITIONS.forEach (event => {
      for (let i = 0; i < length; i++) {
        let figureID = `figure_${i}`;
        this.refs[figureID].addEventListener (
          event,
          HandleAnimationState.bind (this)
        );
      }
    });

    const eventListener = window && window.addEventListener;

    if (eventListener) {
      window.addEventListener ('resize', this.updateDimensions.bind (this));
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.activeImageIndex !== nextProps.activeImageIndex) {
      this.updateDimensions (nextProps.activeImageIndex);
    }
  }

  componentWillUnmount () {
    let length = React.Children.count (this.props.children);

    TRANSITIONS.forEach (event => {
      for (let i = 0; i < length; i++) {
        let figureID = `figure_${i}`;
        this.refs[figureID].removeEventListener (
          event,
          HandleAnimationState.bind (this)
        );
      }
    });

    const removeListener = window && window.removeEventListener;

    if (removeListener) {
      window.removeEventListener ('resize', this.updateDimensions.bind (this));
    }
  }

  updateDimensions (activeImageIndex = this.props.activeImageIndex) {
    const {children} = this.props;
    let length = React.Children.count (children);
    let center = this._center ();

    const width = ReactDOM.findDOMNode (this).offsetWidth;
    const height = ReactDOM.findDOMNode (this).offsetHeight;

    if (typeof activeImageIndex === 'number' && activeImageIndex < length) {
      this.setState ({
        width,
        height,
        current: ~~activeImageIndex,
        move: this.imageBaseWidth * (center - activeImageIndex),
      });
    } else {
      this.setState ({width, height});
    }
  }

  // shadow: al dan niet
  // previous / next :-> kies de tests (of icoontje)

  render () {
    const {enableScroll, navigation, mediaQueries} = this.props;
    const {width, height} = this.state;
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
      >
        <div className={styles.ReactCoverCarousel}>
          <div className={styles.preloader} />
          <div className={styles.stage} ref="stage">
            {this._renderFigureNodes ()}
          </div>
          {navigation && this._renderNavigation ()}
        </div>
      </div>
    );
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
    const totalNrOfVisibleImages = this.props.displayQuantityOfSide * 2 + 1
    return this.state.width / totalNrOfVisibleImages;
  }

  _getOpacity (index, current) {
    // Handle opacity
    let depth = this.props.displayQuantityOfSide - Math.abs (current - index);

    switch (depth) {
      case 1:
        return 0.95;
      case 2:
        return 0.92;
      case 3:
        return 0.9;
      default:
        return 0.5;
    }
  }

  _handleFigureStyle (index, current) {
    let style = {
      transition: `all ${this.props.transitionSpeed}ms ease`,
      width: `${this.imageBaseWidth}px`,
      opacity: index === current ? 1: this._getOpacity (index, current),
      zIndex: index === current? 10 : `${10 - Math.abs (index - current)}`,
    };
    let length = React.Children.count (this.props.children);
    const oddNumberOfImages = length % 2 === 0;

    let offset =  oddNumberOfImages ? - this.imageBaseWidth/2 : 0;

    const translateX = `translateX(${this.state.move + offset}px)`

    // Handle translateX
    if (index === current) {
      style[
        'transform'
      ] = `${translateX}  scale(${this.props.currentFigureScale}`;
    } else if (index < current) {
      // Left side
      style[
        'transform'
      ] = `${translateX} rotateY(${this.props.otherFigureRotation}deg) scale(${this.props.otherFigureScale}`;
    } else if (index > current) {
      // Right side
      style[
        'transform'
      ] = ` ${translateX} rotateY(-${this.props.otherFigureRotation}deg) scale(${this.props.otherFigureScale})`;
    }
    return index === current ? {...style, ...this.props.activeImageStyle } : style;
  }

  _handleFigureClick = (index, action, e) => {
    if (!this.props.clickable) {
      e.preventDefault ();
      return;
    }

    this.refs.stage.style['pointerEvents'] = 'none';
    if (this.state.current === index) {
      // If on the active figure
      if (typeof action === 'string') {
        // If action is a URL (string), follow the link
        window.open (action, '_blank');
      }

      this._removePointerEvents ();
    } else {
      // Move to the selected figure
      e.preventDefault ();
      let distance = this._center () - index;
      let move = distance * this.imageBaseWidth;
      this.setState ({current: index, move});
    }
  };

  _renderFigureNodes = () => {
    const {enableHeading} = this.props;
    const {current} = this.state;
    let figureNodes = React.Children.map (
      this.props.children,
      (child, index) => {
        let figureElement = React.cloneElement (child, {
          className: styles.cover,
          draggable: false,
        });
        let style = this._handleFigureStyle (index, current);
        return (
          <figure
            className={
              index === current
                ? `${styles.figure} ${styles.active}`
                : styles.figure
            }
            key={index}
            onClick={e =>
              this._handleFigureClick (
                index,
                figureElement.props['data-action'],
                e
              )}
            style={style}
            ref={`figure_${index}`}
          >
            {figureElement}
            {enableHeading &&
              <div className={styles.text}>
                {figureElement.props.alt}
              </div>}
          </figure>
        );
      }
    );
    return figureNodes;
  };

  _renderNavigation () {
    const {infiniteScroll, children} = this.props;
    const {current} = this.state;

    let renderPrevBtn = infiniteScroll || current > 0;
    let renderNextBtn = infiniteScroll || current < children.length - 1;

    return (
      <div className={styles.actions}>
        {renderPrevBtn &&
          <button
            type="button"
            className={styles.button}
            onClick={() => this._handlePrevFigure ()}
          >
            Previous
          </button>}
        {renderNextBtn &&
          <button
            type="button"
            className={styles.button}
            onClick={() => this._handleNextFigure ()}
          >
            Next
          </button>}
      </div>
    );
  }

  _removePointerEvents () {
    this.refs.stage.style['pointerEvents'] = 'auto';
  }

  _hasPrevFigure = () => {
    return this.state.current - 1 >= 0;
  };

  _hasNextFigure = () => {
    return this.state.current + 1 < this.props.children.length;
  };

  _handlePrevFigure = () => {
    console.log ('_handlePrevFigure');
    const {infiniteScroll} = this.props;
    let {current} = this.state;
    let distance =
      this._center () -
      (current - 1 < 0 ? this.props.children.length - 1 : current - 1);
    let move = distance * this.imageBaseWidth;

    if (current - 1 >= 0) {
      this.setState ({current: current - 1, move});
      TOUCH.lastMove = move;
    }
    if (current - 1 < 0 && infiniteScroll) {
      this.setState ({current: this.props.children.length - 1, move});
      TOUCH.lastMove = move;
    }
  };

  _handleNextFigure = () => {
    console.log ('_handleNextFigure');
    const {infiniteScroll} = this.props;
    let {current} = this.state;
    let distance =
      this._center () -
      (current + 1 >= this.props.children.length ? 0 : current + 1);
    let move = distance * this.imageBaseWidth;

    if (current + 1 < this.props.children.length) {
      this.setState ({current: current + 1, move});
      TOUCH.lastMove = move;
    }
    if (current + 1 >= this.props.children.length && infiniteScroll) {
      this.setState ({current: 0, move});
      TOUCH.lastMove = move;
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
    TOUCH.lastX = e.nativeEvent.touches[0].clientX;
    TOUCH.lastMove = this.state.move;
  }

  _handleTouchMove (e) {
    e.preventDefault ();

    let clientX = e.nativeEvent.touches[0].clientX;
    let lastX = TOUCH.lastX;
    let move = clientX - lastX;
    let totalMove = TOUCH.lastMove - move;
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
}

ReactCoverCarousel.displayName = 'ReactCoverCarousel';

export default Radium (ReactCoverCarousel);
