/**
 * React Cover Carousel
 *
 * Author: easybird
 */
import React, {Component} from 'react';
import styles from '../reactCoverCarousel.css';
import {getOpacity} from '../utils/styleHelpers';
import CarouselNavigation from './CarouselNavigation';

class CoverCarousel extends Component {
    
  _handleFigureStyle (index, activeIndex) {
    const {
      transitionSpeed,
      children,
      move,
      activeFigureScale,
      otherFigureRotation,
      otherFigureScale,
      activeImageStyle,
      displayQuantityOfSide,
      imageBaseWidth,
    } = this.props;

    let style = {
      transition: `all ${transitionSpeed}ms ease`,
      width: `${imageBaseWidth}px`,
      opacity: getOpacity (index, activeIndex, displayQuantityOfSide),
      zIndex: index === activeIndex
        ? 10
        : `${10 - Math.abs (index - activeIndex)}`,
    };
    let length = React.Children.count (children);
    const oddNumberOfImages = length % 2 === 0;

    let offset = oddNumberOfImages ? -imageBaseWidth / 2 : 0;

    const translateX = `translateX(${move + offset}px)`;

    // Handle translateX
    if (index === activeIndex) {
      style['transform'] = `${translateX}  scale(${activeFigureScale}`;
    } else if (index < activeIndex) {
      // Left side
      style[
        'transform'
      ] = `${translateX} rotateY(${otherFigureRotation}deg) scale(${otherFigureScale}`;
    } else if (index > activeIndex) {
      // Right side
      style[
        'transform'
      ] = ` ${translateX} rotateY(-${otherFigureRotation}deg) scale(${otherFigureScale})`;
    }
    return index === activeIndex ? {...style, ...activeImageStyle} : style;
  }

  _renderFigureNodes = () => {
    const {enableHeading, activeIndex, children, onCoverClick} = this.props;
    let figureNodes = React.Children.map (children, (child, index) => {
      let figureElement = React.cloneElement (child, {
        className: styles.cover,
        draggable: false,
      });
      let style = this._handleFigureStyle (index, activeIndex);
      return (
        <figure
          className={
            index === activeIndex
              ? `${styles.figure} ${styles.active}`
              : styles.figure
          }
          key={index}
          onClick={e =>
            onCoverClick (
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
    });
    return figureNodes;
  };

  render () {
    const {
      navigation,
      infiniteScroll,
      PreviousButton,
      NextButton,
      activeIndex,
      children,
      onNavigateToPreviousCover,
      onNavigateToNextCover,
    } = this.props;

    return (
      <div className={styles.ReactCoverCarousel}>
        <div className={styles.preloader} />
        <div className={styles.stage}>
          {this._renderFigureNodes ()}
        </div>
        {navigation &&
          <CarouselNavigation
            navigation={navigation}
            infiniteScroll={infiniteScroll}
            PreviousButton={PreviousButton}
            NextButton={NextButton}
            activeIndex={activeIndex}
            nrOfCovers={children.length}
            onNavigateToPreviousCover={onNavigateToPreviousCover}
            onNavigateToNextCover={onNavigateToNextCover}
          />}
      </div>
    );
  }
}

export default CoverCarousel;
