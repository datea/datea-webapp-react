import urlJoin from 'url-join';
import config from '../config';

export function getImgSrc(path) {
  return urlJoin(config.api.imgUrl, path);
}
