import './dateo.scss';
import React from 'react';
import PropTypes from 'prop-types';
import DetailView from './detail-view';

export default class Dateo extends React.Component {

  static propTypes = {
    dateo : PropTypes.object,
    type  : PropTypes.oneOf(['detail', 'teaser', 'image']),
  };

  static defaultProps = {
    type : 'detail'
  };

  constructor (props, context) {
    super(props, context);
  }

  render() {
    //console.log('dateo', dateo);
    switch (this.props.type) {
      case 'detail':
        return <DetailView dateo={this.props.dateo} />
    }
  }

}
