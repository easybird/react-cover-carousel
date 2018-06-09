(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (factory((global.ReactCoverCarousel = {}),global.React));
}(this, (function (exports,React) { 'use strict';

  var React__default = 'default' in React ? React['default'] : React;

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  // import style from './ReactCoverCarousel.scss';

  var ReactCoverCarousel = function (_Component) {
    inherits(ReactCoverCarousel, _Component);

    function ReactCoverCarousel() {
      classCallCheck(this, ReactCoverCarousel);
      return possibleConstructorReturn(this, (ReactCoverCarousel.__proto__ || Object.getPrototypeOf(ReactCoverCarousel)).apply(this, arguments));
    }

    createClass(ReactCoverCarousel, [{
      key: 'render',
      value: function render() {
        return React__default.createElement(
          'div',
          null,
          React__default.createElement(
            'p',
            null,
            'This is the ReactCoverCarousel component library'
          ),
          this.props.children
        );
      }
    }]);
    return ReactCoverCarousel;
  }(React.Component);

  exports.ReactCoverCarousel = ReactCoverCarousel;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=react-cover-carousel.js.map
