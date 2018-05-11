import React from 'react';
import {observer, inject} from 'mobx-react';
import Helmet from 'react-helmet';

const HeadMeta = ({store}) => {
  const {metaData} = store;
  return (
    <Helmet defaultTitle="Todos somos dateros" >

        <html lang={store.user.locale} amp />

        {/*  META TAGS */}
      	<title>{metaData.title}</title>
      	<meta name="description" content={metaData.description} />

      	{/* TWITTER CARD */}
      	<meta property="twitter:card" content="summary" />
      	<meta property="twitter:site" content="@somosdateros" />
      	<meta property="twitter:title" content={metaData.title} />
      	<meta property="twitter:description" content={metaData.description} />
      	<meta property="twitter:image" content={metaData.imageUrl} />

      	{/* OG TAGS */}
      	<meta property="og:type" content="website" />
      	<meta property="og:title" content={metaData.title} />
      	<meta property="og:description" content={metaData.description} />
      	<meta property="og:url" content={metaData.url} />
      	<meta property="og:image" content={metaData.imageUrl} />
      	<meta property="og:locale" content={store.user.locale} />
      	<meta property="og:site_name" content="Datea" />
    </Helmet>
  );
}

export default inject('store')(observer(HeadMeta));
