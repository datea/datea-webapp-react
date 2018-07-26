import './share.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {inject} from 'mobx-react';
import _ from 'lodash';
import {FacebookShareButton, TwitterShareButton,
        TelegramShareButton, WhatsappShareButton,
        EmailShareButton,
        FacebookIcon, TwitterIcon, TelegramIcon,
        WhatsappIcon, EmailIcon} from 'react-share';
import IconButton from '@material-ui/core/IconButton';
import ShareIcon from '@material-ui/icons/Share';
import Popover from '@material-ui/core/Popover';
import {Tr, t} from '../../i18n';

const ICON_SIZE = 44;

@inject('store')
export default class ShareButton extends Component {

  static propTypes = {
    showLabel : PropTypes.bool,
    title : PropTypes.string,
    description : PropTypes.string,
    url : PropTypes.string,
    store: PropTypes.object
  }

  static defaultProps = {
    showLabel : true
  }

  state = {
    anchorEl: null
  }

  onClick = (ev) => {
    const data = this.props.store.metaData;
    if (window.navigator.share) {
      window.navigator.share({
        title : data.title,
        text : data.description,
        url : data.url
      })
    } else {
      this.setState({ anchorEl: ev.currentTarget });
    }
  }

  handleClose = () => {
    this.setState({
      anchorEl: null,
    });
  };

  render() {
    const {anchorEl} = this.state;
    const {url, hashtags, title, description} = this.props.store.metaData;

    let result = [
      <IconButton
        key="btn"
        className="share-btn"
        aria-owns={anchorEl ? 'simple-menu' : null}
        onClick={this.onClick}>
        <ShareIcon />
        {this.props.showLabel &&
          <span className="btn-label">
            <Tr id="SHARE.SHARE" />
          </span>
        }
      </IconButton>
    ];

    !!anchorEl && result.push(
      <Popover
        key="popover"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={this.handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <FacebookShareButton url={url} quote={description} hashtag={_.first(hashtags)}>
          <FacebookIcon size={ICON_SIZE} round />
        </FacebookShareButton>
        <TwitterShareButton url={url} title={title} hashtags={hashtags}>
          <TwitterIcon size={ICON_SIZE} round />
        </TwitterShareButton>
        <TelegramShareButton url={url} title={title}>
          <TelegramIcon size={ICON_SIZE} round />
        </TelegramShareButton>
        <WhatsappShareButton url={url} title={title}>
          <WhatsappIcon size={ICON_SIZE} round />
        </WhatsappShareButton>
        <EmailShareButton url={url} subject={title}>
          <EmailIcon size={ICON_SIZE} round />
        </EmailShareButton>
      </Popover>
    );
    return result;
  }
}
