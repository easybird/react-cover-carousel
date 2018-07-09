/**
 * React Cover Carousel
 *
 * Author: easybird
 */
import React from 'react';
import CoverCarouselContainer from './components/CoverCarouselContainer';
import Radium from 'radium';

const ReactCoverCarousel = (props) => <CoverCarouselContainer {...props}/>

ReactCoverCarousel.displayName = 'ReactCoverCarousel';

export default Radium (ReactCoverCarousel);
