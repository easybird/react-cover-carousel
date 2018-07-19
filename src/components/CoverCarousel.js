import React from 'react';
import styles from '../styles/coverCarousel.css';

import CarouselNavigation from './CarouselNavigation';
import Cover from './Cover';

const CoverCarousel = ({
      navigation,
      infiniteScroll,
      PreviousButton,
      NextButton,
      activeIndex,
      children,
      onNavigateToPreviousCover,
      onNavigateToNextCover,
      moveInPixels,
      activeFigureScale,
      otherFigureRotation,
      otherFigureScale,
      activeImageStyle,
      displayQuantityOfSide,
      imageBase,
      transitionSpeed,
      onCoverClick,
      enableHeading,
      isMobileCarousel
    }) => (
      <div className={styles.ReactCoverCarousel}>
        <div className={styles.preloader} />
        <div className={styles.stage} style={isMobileCarousel ? { flexDirection: 'column'}: {}}>
          {children.map ((child, index) => (
            <Cover
              key={index}
              CoverImage={child}
              index={index}
              activeIndex={activeIndex}
              transitionSpeed={transitionSpeed}
              nrOfCovers={children.length}
              moveInPixels={moveInPixels}
              activeFigureScale={activeFigureScale}
              otherFigureRotation={otherFigureRotation}
              otherFigureScale={otherFigureScale}
              activeImageStyle={activeImageStyle}
              displayQuantityOfSide={displayQuantityOfSide}
              imageBase={imageBase}
              onCoverClick={onCoverClick}
              enableHeading={enableHeading}
              isMobileCarousel={isMobileCarousel}
            />
          ))}
        </div>
        {navigation &&
          <CarouselNavigation
            key="navigation"
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

export default CoverCarousel;
