import React from 'react';
import {calculateDirectionType} from '../utils/compareXandYDirections';

const DEFAULT_RESET_SCROLL_TIMEOUT = 300;
const DEFAULT_TRESHOLD = 100000;

export default function withScrollTresholdIndication (
  WrappedComponent,
  options
) {
  return class extends React.Component {
    state = {
      tresholdPercentage: 0,
      tresholdReached: false,
      scrolling: false,
      scrollDirectionType: null,
      scrollDirection: '',
    };

    weight = document ? document.documentElement.scrollHeight / 1 : 1;

    resetScrollTimeoutMs = (options && options.resetScrollTimeoutMs) ||
      DEFAULT_RESET_SCROLL_TIMEOUT;
    treshold = ((options && options.treshold) || DEFAULT_TRESHOLD) /
      this.weight;
    cummulatedDeltaX = 0;
    cummulatedDeltaY = 0;
    scrollingTimeout = null;

    debug = (message, ...values) => {
      options && options.debug && console.log (message, ...values);
    };

    resetScrollingTimeout = () => {
      if (this.scrollingTimeout) {
        clearTimeout (this.scrollingTimeout);
      }

      this.scrollingTimeout = setTimeout (
        this.handleResetScrolling,
        this.resetScrollTimeoutMs
      );
    };

    handleResetTreshold = () => {
      this.debug ('--handleResetTreshold');

      this.cummulatedDeltaX = 0;
      this.cummulatedDeltaY = 0;

      if (this.state.tresholdPercentage !== 0 || this.state.tresholdReached) {
        this.setState ({
          tresholdPercentage: 0,
          tresholdReached: false,
        });
      }
    };

    handleResetScrolling = () => {
      this.debug ('--handleResetScrolling');

      this.setState ({
        scrolling: false,
        scrollDirectionType: null,
      });
      this.handleResetTreshold ();
      this.scrollingTimeout = null;
    };

    updateScrollingDistance = e => {
      this.cummulatedDeltaX += e.deltaX;
      this.cummulatedDeltaY += e.deltaY;

      const {type, value, direction} = calculateDirectionType ({
        deltaY: this.cummulatedDeltaY,
        deltaX: this.cummulatedDeltaX,
      });

      const absValue = Math.abs (value);

      if (type !== this.state.scrollDirectionType) {
        this.debug ('--setState scrollDirecitonType', type);
        this.setState ({
          scrollDirectionType: type,
        });
      }

      if (direction !== this.state.scrollDirection) {
        this.debug ('--setState scrollDireciton', direction);

        this.setState ({
          scrollDirection: direction,
        });
      }

      if (this.treshold > absValue) {
        const tresholdPercentage = absValue / this.treshold;

        const roundedTresholdPercentage =
          Math.floor (tresholdPercentage * 10) / 10;
        if (roundedTresholdPercentage !== this.state.tresholdPercentage) {
          this.debug (
            '--setState tresholdPercentage',
            roundedTresholdPercentage
          );

          this.setState ({
            tresholdPercentage: roundedTresholdPercentage,
          });
        }
      } else if (this.state.tresholdPercentage !== 1) {
        this.debug ('--setState tresholdReached');

        // threshold reached
        this.setState ({
          tresholdPercentage: 1,
          tresholdReached: true,
        });
      }
    };

    handleScroll = e => {
      e.preventDefault ();

      if (this.scrollingTimeout) {
        // isBusyScrolling
        this.resetScrollingTimeout ();
      } else {
        this.resetScrollingTimeout ();
        this.setState ({scrolling: true});
      }
      this.updateScrollingDistance (e);

      //   console.log ('---window scrollY', window.scrollY, '\n');
      //   console.log ('---window scrollX', window.scrollX, '\n');
      //   console.log ('---event deltaX', e.deltaX, '\n');
      //   console.log ('---event deltaY', e.deltaY, '\n');
      //   console.log ('---event deltaZ', e.deltaZ, '\n');
      //   console.log ('---event deltaMode', e.deltaMode, '\n');
      //   console.log ('---event movementX', e.movementX, '\n');
      //   console.log ('---event movementY', e.movementY, '\n');
      //   console.log ('---event offsetX', e.offsetX, '\n');
      //   console.log ('---event offsetY', e.offsetY, '\n');
      //   console.log ('---event clientX', e.clientX, '\n');
      //   console.log ('---event clientY', e.clientY, '\n');
      //   console.log ('---END_____', '\n');

      // if (window.scrollY === 0 && this.state.scrolling === true) {
      //     this.setState({scrolling: false});
      // }
      // else if (window.scrollY !== 0 && this.state.scrolling !== true) {
      //     this.setState({scrolling: true});
      // }
    };

    render () {
      return (
        <WrappedComponent
          onWheel={this.handleScroll}
          onResetTreshold={this.handleResetTreshold}
          tresholdPercentage={this.state.tresholdPercentage}
          tresholdReached={this.state.tresholdReached}
          scrolling={this.state.scrolling}
          scrollDirectionType={this.state.scrollDirectionType}
          scrollDirection={this.state.scrollDirection}
          {...this.props}
        />
      );
    }
  };
}
