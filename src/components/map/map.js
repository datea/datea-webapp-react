import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default class DateaMap extends Component {

  static propTypes = {
    width    : PropTypes.number,
    height   : PropTypes.number,
    mapStore : PropTypes.object,
  };

  componentDidMount() {
    this.props.mapStore.setDOMElement(this.mapRef);
  }

  componentDidUpdate() {

  }

  shouldComponentUpdate(newProps) {
    if (this.props.width != newProps.width) return true;
    if (this.props.height != newProps.height) return true;
    return false;
  }

  componentWillReceiveProps(newProps) {
    if (newProps.width != this.props.height || newProps.width != this.props.width) {
      this.props.mapStore.resizeMap();
    }
  }

  render() {
    const {width, height, className} = this.props;
    return (
      <div className={cn('datea-map', className)}
        style={{width, height}}
        ref={r => {this.mapRef = r}} />
    );
  }
}
