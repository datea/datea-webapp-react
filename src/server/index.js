import React from 'react';
import ReactDOMServer from 'react-dom/server';
import director from 'director';
import Helmet from 'react-helmet';
import {autorun} from 'mobx';
import qs from 'qs';
import url from 'url';

import {setLanguageFile} from '../i18n';
import App from './StaticApp';
import {viewsForDirector} from '../mobx-router/utils';
import DateaStore from '../state/store';
import RouteConfig from '../state/views';
import templateFunction from './templateFunction';

const store = new DateaStore();
const router = new director.http.Router({...viewsForDirector(RouteConfig, store)});

export default async (req, res) => new Promise((resolve, reject) => {
  router.dispatch(req, res, async (err) => {

    const qParams = qs.parse(url(req.url));
    if (qParams && qParams.lang) {
      setLanguageFile(qParams.lang);
    }
    await store.serverSideWaitAsync();

    const html = ReactDOMServer.renderToStaticMarkup(
        <App store={store} />
    );
    const helmet = Helmet.renderStatic();

    resolve(templateFunction(html, helmet));
  });
});
