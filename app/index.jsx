import React from 'react';
import ReactDOM from 'react-dom';
import Providers from './ApolloProvider.js';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

  loadDevMessages();
  loadErrorMessages();

ReactDOM.render(<Providers />, document.getElementById('app'));
