import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import FontAwesome from 'react-fontawesome';

import 'font-awesome/css/font-awesome.css';

const button = (<FontAwesome name="rocket" size="2x" />);

const Application = () => (
  <Fragment>
    <div id="sidebar">
      <ul>
        <li><a href="#react_cover_carousel" className="link">ReactCoverCarousel</a></li>
      </ul>
    </div>
    <iframe src="./react_cover_carousel.html" />
  </Fragment>
);

window.addEventListener('load', () => {
  const iframe = document.querySelector('iframe');

  for (let link of document.querySelectorAll('a.link')) {
    link.addEventListener('click', (e) => {
      iframe.src = e.target.href.replace('#', '') + '.html';
    })
  }
})

ReactDOM.render(
  <Application />,
  document.getElementById('app')
)
