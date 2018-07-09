import styles from '../styles/cover.css';

import {getOpacity} from '../utils/styleHelpers';

const Cover = ({
  CoverImage,
  index,
  activeIndex,
  transitionSpeed,
  nrOfCovers,
  moveXInPixels,
  activeFigureScale,
  otherFigureRotation,
  otherFigureScale,
  activeImageStyle,
  displayQuantityOfSide,
  imageBaseWidth,
  onCoverClick,
  enableHeading
}) => {
  const isActiveCover = index === activeIndex;
  let style = {
    transition: `all ${transitionSpeed}ms ease`,
    width: `${imageBaseWidth}px`,
    opacity: getOpacity (index, activeIndex, displayQuantityOfSide),
    zIndex: isActiveCover ? 10 : `${10 - Math.abs (index - activeIndex)}`,
  };
  const oddNumberOfImages = nrOfCovers % 2 === 0;

  let offset = oddNumberOfImages ? -imageBaseWidth / 2 : 0;

  const translateX = `translateX(${moveXInPixels + offset}px)`;

  // Handle translateX
  if (isActiveCover) {
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
