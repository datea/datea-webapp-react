import './image-field.scss';
import React from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import Dropzone from 'react-dropzone';
import {observer, inject} from 'mobx-react';
import CircularProgress from 'material-ui/CircularProgress';
import Avatar from 'material-ui/Avatar';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-a-photo';
import DefaultAvatar from '../misc/default-avatar';
import cn from 'classnames';
import config from '../../config';
import urlJoin from 'url-join';
import {colors} from '../../theme/vars';
import {t,translatable} from '../../i18n';

@inject('store')
@translatable
@observer
export default class ImageField extends React.Component {

  static propTypes = {
    onUploadError   : PropTypes.func,
    onUploadSuccess : PropTypes.func,
    className       : PropTypes.string,
    src             : PropTypes.string,
    imgType         : PropTypes.string,
    iconSize        : PropTypes.number
  };

  static defaultProps = {
    imgType    : 'normal',
    src        : '',
    iconSize   : 80
  }

  defaultIcon = <AddPhotoIcon />;

  constructor(props, context) {
    super(props, context);
    this.state = {
      src       : this.props.src,
      uploading : false,
      progress  : 0,
      errorMsg  : null
    }
    this.phIcon = this.props.imgType == 'avatar' ?
      <DefaultAvatar size={this.props.iconSize} /> :
      <AddPhotoIcon
        color={colors.greyLight}
        hoverColor={colors.greyMid}
        className="ph-icon"
        style={{
          width      : this.props.iconSize,
          height     : this.props.iconSize
        }}
      />;
  }

  componentWillReceiveProps(newProps) {
    if (!!newProps.src && this.state.src != newProps.src) {
      this.setState({src: newProps.src});
    }
  }

  onDrop = (files) => {
    const {user} = this.props.store;
    this.setState({
      src       : files[0].preview,
      uploading : true,
      progess   : 0,
      errorMsg  : null
    });

    // TODO: move this logic into a store
    request.post(urlJoin(config.api.imgUrl, 'image/save/'))
    .set({
      Accept : 'application/json',
      Authorization : 'Apikey ' + user.data.username + ':' + user.apiKey
    })
    .attach('image', files[0])
    .on('progress', e => !!e.percent && this.setState({progress: e.percent}))
    .end((err, res) => {
      if (!err && res.status == 200) {
        this.props.onUploadSuccess && this.props.onUploadSuccess(res.body.resource);
      }else {
        this.props.onUploadError && this.props.onUploadError(err, res);
        this.setState({errorMsg: t('ERROR.UPLOAD')});
      }
      this.setState({uploading: false});
    });

  }

  render() {
    let imgSrc = this.state.src;
    if (imgSrc && imgSrc.indexOf('blob') != 0) imgSrc = urlJoin(config.api.imgUrl, imgSrc);

    let imgElem, style;
    if (this.props.imgType == 'avatar') {
      imgElem = <Avatar src={imgSrc} size={this.props.iconSize} />
      style = {width: this.props.iconSize, height: this.props.iconSize};
    }else{
      imgElem = <img src={imgSrc} />
    }

    const cl = cn(
      'image-field-zone',
      this.props.className,
      this.props.imgType == 'avatar' ? 'avatar-zone' : 'normal-zone',
      !!this.state.src && 'loaded',
      this.state.uploading && 'uploading'
    );

    return (
      <Dropzone
        onDrop={this.onDrop}
        ref="dropzone"
        className={cl}
        activeClassName="drag-over"
        accept="image/png,image/jpeg,image/svg+xml"
        multiple={false}
        style={style}
      >
        <div className="dropzone-inner">
          {this.state.src && imgElem}
          {!this.state.src && this.phIcon}

          {this.state.errorMsg &&
            <div className="error-msg">{this.state.errorMsg}</div>
          }
          {this.state.uploading &&
            <div className="progress-wrap">
              <div className="progress">
                <CircularProgress color={colors.greyMid} size={0.8} mode="determinate" value={this.state.progress} />
              </div>
            </div>
          }
          <div className="drag-over-msg">
            <div className="txt">{t('FILEINPUT.DRAG_OVER_MSG')}</div>
          </div>
        </div>
      </Dropzone>
    )
  }

}
