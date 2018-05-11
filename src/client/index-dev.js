import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App/>, document.getElementById('pageMain'));

if (module.hot) {
   module.hot.accept('./index-dev.js', function() {
     console.log('Accepting the updated printMe module!');
     printMe();
   })
}
