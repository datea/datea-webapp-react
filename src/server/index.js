import React from 'react';
import ReactDOMServer from 'react-dom/server';
import director from 'director';
import Helmet from 'react-helmet';
import {autorun} from 'mobx';
import qs from 'qs';

import {setLanguageFile} from '../i18n';
import App from './StaticApp';
import {viewsForHttpDirector} from '../mobx-router/utils';
import DateaStore from '../state/store';
import RouteConfig from '../state/views';
import templateFunction from './templateFunction';

export default async (req, res) => new Promise( async (resolve, reject) => {

  const store = new DateaStore();

  const callback = async (err) => {
    if (req.url.indexOf('?') !== -1) {
      const qParams = qs.parse(req.url.split('?')[1]);
      if (qParams && qParams.lang) {
        setLanguageFile(qParams.lang);
      }
    };
    console.log('before await');
    await store.serverSideWaitAsync();
    console.log('hey after await');
    const html = ReactDOMServer.renderToStaticMarkup(
        <App store={store} />
    );
    const helmet = Helmet.renderStatic();

    resolve(templateFunction(html, helmet));
  }
  const router = new director.http.Router({...viewsForHttpDirector(RouteConfig, store, callback)});
  router.dispatch(req, res);
});
