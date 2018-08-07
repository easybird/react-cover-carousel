import React from 'react';

import styles from '../styles/cover.css';
import {getOpacity} from '../utils/styleHelpers';

const Cover = ({
  CoverImage,
  index,
  activeIndex,
  transitionSpeed,
  nrOfCovers,
  moveInPixels,
  activeFigureScale,
  otherFigureRotation,
  otherFigureScale,
  activeImageStyle,
  displayQuantityOfSide,
  imageBase,
  onCoverClick,
  enableHeading,
  isMobileCarousel
}) => {
  const isActiveCover = index === activeIndex;
  let style = {
    transition: `all ${transitionSpeed}ms ease`,
    width: `${imageBase}px`, // TODO this works on mobileCarousel only with square images, should be height in stead
    opacity: getOpacity (index, activeIndex, displayQuantityOfSide),
    zIndex: isActiveCover ? 10 : `${10 - Math.abs (index - activeIndex)}`,
  };
  const oddNumberOfImages = nrOfCovers % 2 === 0;

  let offset = oddNumberOfImages ? -imageBase / 2 : 0;

  const transformTranslate = moveInPixels + offset;
  const transformTranslateInPixels = isMobileCarousel ? `translateY(${transformTranslate}px)`: `translateX(${transformTranslate}px)`;
  const leftSideRotation = isMobileCarousel ? `rotateX(${otherFigureRotation}deg)` : `rotateY(${otherFigureRotation}deg)`
  const rightSideRotation = isMobileCarousel ? `rotateX(-${otherFigureRotation}deg)` : `rotateY(-${otherFigureRotation}deg)`

  // Handle transformTranslateInPixels
  if (isActiveCover) {
    style['transform'] = `${transformTranslateInPixels}  scale(${activeFigureScale}`;
  } else if (index < activeIndex) {
    // Left side
    style[
      'transform'
    ] = `${transformTranslateInPixels} ${leftSideRotation} scale(${otherFigureScale}`;
  } else if (index > activeIndex) {
    // Right side
    style[
      'transform'
    ] = ` ${transformTranslateInPixels} ${rightSideRotation} scale(${otherFigureScale})`;
  }

  const cover = React.cloneElement (CoverImage, {
    className: styles.cover,
    draggable: false,
  });

  return (
    <figure
      className={
        isActiveCover ? `${styles.figure} ${styles.active}` : styles.figure
      }
      key={index}
      onClick={e => onCoverClick (index, cover.props['data-action'], e)}
      style={isActiveCover ? {...style, ...activeImageStyle} : style}
    >
      {cover}
      {enableHeading &&
        <div className={styles.text}>
          {cover.props.alt}
        </div>}
    </figure>
  );
};
export default Cover;
