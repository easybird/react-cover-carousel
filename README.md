# React Cover Carousel library.
An animated Cover Carousel component with loads of options! Working smoothly on desktop and on mobile.

![Demo](https://thumbs.gfycat.com/KlutzyJointIberianmole-size_restricted.gif)

## Go and play [live with some examples online](https://tender-kepler-8e3244.netlify.com/)!
Check out all the possibilities and flexibility you have with this carousel by following the link above.

## How to use it?
Again, check out how to use it [here](https://tender-kepler-8e3244.netlify.com/).

Using it is as simple as:

```npm i react-cover-carousel -S```

```javascript
import ReactCoverCarousel from 'react-cover-carousel';

render() {
    const allOfYourImages = [
        <img src='http://lorempixel.com/400/200/sports' />, 
        <img src='http://lorempixel.com/400/200/sports' />
        ];
    return <ReactCoverCarousel >{allOfYourImages}</ReactCoverCarousel>
}
```

## Explanation of all possible props
> All props are optional!

| Prop          | Type           | Explanation  |
| ------------- |:-------------:| -----:|
| width      | number | The width of the carousel |
| height      |   number | The height of the carousel|
| displayQuantityOfSide | number | Elements on each side of the active image|
| navigation | boolean | Should there be navigation buttons - Buttons are customisable with `PreviousButton` and `NextButton`|
| enableHeading | boolean | Should a header with the `alt` text be shown on the image?|
| enableScroll | boolean | Should the carousel be scrollable?|
| activeImageIndex | number | The index of the image that should be active|
| activeImageStyle | React Style Object | The custom style needed for the active image to 🌟|
| activeFigureScale | number | How much do you want to scale the active image?|
| otherFigureScale | number | Do you want to up/downscale the other images? Go ahead!|
| otherFigureRotation | number | How much do you want to rotate the other covers in the carousel?|
| mediaQueries | `Radium` Object | By using the ```npm i radium -S``` library, you can use this mediaQueries object for your device specific css|
| infiniteScroll | boolean | Do you want to keep on scrolling as if your life depends on it?|
| transitionSpeed | number | How fast do you want the animation to change the active image to fullfill? |
| autoFocus | boolean | Do you want the carousel to autoFocus when loading the component? If so, the user will be able to use his keyboard to navigate|
| PreviousButton | `React` Component | Create your custom PreviousButton here|
| NextButton |  `React` Component | Create your custom NextButton here|
| maxPixelWidthForMobileMediaQuery | number | on Mobile, the Carousel will be vertically aligned in stead of horizontally. You can define the window width at which the carousel has to turn from vertical to horizontal.
| zoomable | boolean | Tapping/Clicking on an image will zoom the image to full screen (cfr Instagram). Once Zoomed, clicking/tapping again will trigger the data-action specified on the image


## Default Props

```javascript
static defaultProps = {
    width: window.innerWidth / 2,
    height: window.innerHeight / 2,
    displayQuantityOfSide: 3,
    navigation: false,
    enableHeading: false,
    enableScroll: true,
    activeImageIndex: 0,
    activeImageStyle: {
      margin: '5em',
    },
    activeFigureScale: 1.5,
    otherFigureScale: 0.8,
    otherFigureRotation: 40,
    mediaQueries: {},
    infiniteScroll: true,
    transitionSpeed: 700,
    autoFocus: false,
    PreviousButton: null,
    NextButton: null,
    maxPixelWidthForMobileMediaQuery: 480,
    zoomable: true
  };
``` 

## Want extra features?
Don't hesitate to open a Pull Request, I'd be happy to include it.

## This library has to thank someone 🙇‍🙏
This library was based on [React-Coverflow](https://github.com/andyyou/react-coverflow) 
But it didn't met my requirements, so I made a new library, which has been heavily customised. 
Anyway, many thanks!
