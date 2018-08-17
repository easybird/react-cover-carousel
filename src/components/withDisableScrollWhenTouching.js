import React from 'react';

export default function withDisableScrollWhenTouching (
  WrappedComponent,
  options
) {
  return class extends React.Component {
    componentDidMount () {
      this.enableOnTouchMove ();
    }

    componentWillUnmount () {
      this.enableOnTouchMove ();
    }

    enableOnTouchMove = () => {
      if (window && window.document) {
        window.document.ontouchmove = () => {
          this.debug ('document.ontouchmove');

          return true;
        };
      }
    };
    debug = (message, ...values) => {
      options && options.debug && console.log (message, ...values);
    };

    handleTouchStart = e => {
      this.touching = true;
      if (window && window.document) {
        window.document.ontouchmove = e => {
          this.debug ('---ontouchmove prevent default');

          e.preventDefault ();
        };
      }
    };
    handleTouchEnd = () => {
      this.touching = false;
      this.enableOnTouchMove();
    };

    handleTouch = e => {
      this.debug('touchevent', this.touching);
      if (this.touching) {
        e.preventDefault ();
        return false;
      } else {
        return true;
      }
    };

    render () {
      return (
        <WrappedComponent
          onTouchMove={this.handleTouch}
          onTouchStart={this.handleTouchStart}
          onTouchEnd={this.handleTouchEnd}
          {...this.props}
        />
      );
    }
  };
}
