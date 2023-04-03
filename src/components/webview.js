import React from 'react';
import { WebView } from 'react-native-webview';
import htmlFile from '../services/index.html';

const Opencv = () => {
  return (
    <WebView
      source={htmlFile}
    />
  );
};

export default Opencv;