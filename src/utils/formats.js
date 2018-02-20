import moment from 'moment';

export function dateAuthored(dateIsoStr, locale = 'es') {
  if (moment.locale() != locale) {
    moment.locale(locale);
  }
  if (locale == 'en') {
    return moment(dateIsoStr).format('MMMM D YYYY - HH:mm');
  } else {
    return moment(dateIsoStr).format('D MMMM YYYY - HH:mm');
  }
}
