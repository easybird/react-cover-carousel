// import style from './ReactCoverCarousel.scss';
// import cx from 'classnames';

import React, {Component} from 'react';

export class ReactCoverCarousel extends Component {
  render () {
    return (
      <div>
        <p>This is the ReactCoverCarousel component library</p>
        {this.props.children}
      </div>
    );
  }
}
