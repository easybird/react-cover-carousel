import React, {Component} from 'react';
import styles from '../styles/carouselNavigation.css';

class CarouselNavigation extends Component {
  _renderPreviousButton = () => {
    const {infiniteScroll, PreviousButton, activeIndex, onNavigateToPreviousCover} = this.props;

    let renderPrevBtn = infiniteScroll || activeIndex > 0;

    if (!renderPrevBtn) {
      return;
    }

    return this._renderButton ({
      onClick: onNavigateToPreviousCover,
      ButtonComponent: PreviousButton,
      fallBackButtonText: 'Previous',
    });
  };

  _renderNextButton = () => {
    const {infiniteScroll, NextButton, nrOfCovers, activeIndex, onNavigateToNextCover} = this.props;

    let renderNextBtn = infiniteScroll || (activeIndex < nrOfCovers - 1);

    if (!renderNextBtn) {
      return;
    }

    return this._renderButton ({
      onClick: onNavigateToNextCover,
      ButtonComponent: NextButton,
      fallBackButtonText: 'Next',
    });
  };

  _renderButton = ({onClick, ButtonComponent, fallBackButtonText}) => {
    if (ButtonComponent) {
      return React.cloneElement (ButtonComponent, {
        onClick,
      });
    }

    return (
      <button
        type="button"
        className={styles.button}
        onClick={() => onClick ()}
      >
        {fallBackButtonText}
      </button>
    );
  };

  render () {
    return (
      <div className={styles.actions}>
        {this._renderPreviousButton ()}
        {this._renderNextButton ()}
      </div>
    );
  }
}

export default CarouselNavigation;
