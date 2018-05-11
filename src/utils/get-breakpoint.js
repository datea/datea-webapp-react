import rem2px from './rem2px';

const xsBreak = rem2px(48);
const smBreak = rem2px(64);
const mdBreak = rem2px(75);

export default function getBreakpoint() {
  if (ENV_TYPE == 'browser') {
    const w = window.innerWidth;
    if (w <= xsBreak) return 'xs';
    if (w <= smBreak) return 'sm';
    if (w <= mdBreak) return 'md';
    return 'lg';
  } else {
    return 'xs';
  }
}
