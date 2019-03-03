import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import i18n from './i18n';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App i18n={i18n} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
