import React from 'react';
import getUrls from 'get-urls';
import UrlView from '../url-view';

export function renderContentWithUrls(content, withUrlView = false) {
  const urls = getUrls(content);
  if (urls.size == 0) {
    return content;
  } else {
    let result = [];
    let k = 0;
    for (let url of urls) {
        const parts = content.split(url, 1);
        if (parts.length == 2) {
          content = parts[2];
        }
        result.push(<span key={'part0-'+k}>{parts[0]}</span>);
        result.push(<a key={'link-'+k} href={url} target="_blank">{url}</a>);
        withUrlView && result.push(<UrlView key={'url-view-'+k} url={url}/>)
        k++;
    };
    return result;
  }
}
