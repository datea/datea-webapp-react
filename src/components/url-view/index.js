import './url-view.scss';
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import cn from 'classnames';
import LinkIcon from 'material-ui/svg-icons/content/link';
import {inject} from 'mobx-react';

@inject('store')
export default class UrlView extends React.Component {

  static propTypes = {
    url : PropTypes.string,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading : true,
      urlInfo : {
        title: props.url
      }
    };
  }

  componentWillMount() {
    if (this.props.url) {
      this.props.store.data.getURLMeta({url: this.props.url})
      .then(res => this.setState({urlInfo: res, loading: false}))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.url && nextProps.url != this.props.url) {
      this.setState({loading: true })
      this.props.store.data.getURLMeta({url: nextProps.url})
      .then(res => this.setState({urlInfo: res, loading: false}))
    }
  }

  render() {
    const {title, description, image} = this.state.urlInfo;
    if (this.state.loading || !this.state.urlInfo.title) {
      return <span/>;
    } else {
      return (
        <a className={cn('url-view', this.state.loading && 'loading')} target="_black" href={this.props.url} >
          <LinkIcon className="link-icon" />
          {!!image && <div className="url-img" style={{backgroundImage: 'url('+image+')'}} />}
          <div className="url-info">
            {!!title && <div className="url-title">{title}</div>}
            {!!description && <div className="url-desc">{description}</div>}
          </div>
        </a>
      );
    }
  }


}
