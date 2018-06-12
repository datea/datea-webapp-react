import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Helmet from 'react-helmet';
import qs from 'qs';
import {createLocation} from "history";
import { useStaticRendering } from "mobx-react"
import { StaticAdapter } from 'mobx-state-router';
import {send} from 'micro';
import {setLanguageFile} from '../i18n';
import App from './StaticApp';
import DateaStore from '../state/store';
import templateFunction from './templateFunction';

useStaticRendering(true);

export default async (req, res) => new Promise( async (resolve, reject) => {

  if (req.url == '/favicon.ico') {
    send(res, 204);
    return;
  }

  const store = new DateaStore();
  const staticAdapter = new StaticAdapter(store.router);

  if (req.url.indexOf('?') !== -1) {
    const qParams = qs.parse(req.url.split('?')[1]);
    if (qParams && qParams.lang) {
      setLanguageFile(qParams.lang);
    }
  };
  await staticAdapter.goToLocation(createLocation(req.url));
  await store.serverSideWaitAsync();

  const html = ReactDOMServer.renderToStaticMarkup(
      <App store={store} />
  );
  const helmet = Helmet.renderStatic();
  //console.log('title in store', store.metaData.title);
  //console.log('title in helmet', helmet.title.toString());

  resolve(templateFunction(html, helmet));
});
