import React from 'react';
import PropTypes from 'prop-types';
import request from 'superagent';
import Dropzone from 'react-dropzone';
import {observable, action} from 'mobx';
import {observer, inject, PropTypes as MobxPropTypes} from 'mobx-react';
import cn from 'classnames';
import urlJoin from 'url-join';
import config from '../../../config';


@inject('store')
@observer
export default class MediaUploadArea extends React.Component {

  static propTypes = {
    onUploadError   : PropTypes.func,
    onUploadSuccess : PropTypes.func,
    className       : PropTypes.string,
    children        : PropTypes.node,
    acceptTypes     : PropTypes.array
  };

  static defaultProps = {
    acceptTypes  : ['image']
  };

  static childContextTypes = {
    dropzoneState : MobxPropTypes.observableObject,
    dropzoneActions: PropTypes.object
  };

  getChildContext() {
    return {
      dropzoneState : this.zoneState,
      dropzoneActions : {openDialog : this.openDialog}
    };
  }

  @observable zoneState = {
    dragging : false,
    uploading : false,
    progress  : 0,
    errorMsg  : null,
    uploadingType : 'image',
    currentTypes : ['image'],
    acceptTypes : ['image']
  };

  constructor(props, context) {
    super(props, context);
    this.setZoneState({
      acceptTypes: this.props.acceptTypes,
      currentTypes : this.props.acceptTypes
    });
  }

  getAcceptedMimes(types) {
    const currentTypes = types || this.props.acceptTypes;
    let result = '';
    if (currentTypes.includes('image')) {
      result = config.validation.allowedImageTypes.join(',')
    }
    if (currentTypes.includes('file')) {
      result += config.validation.allowedFileTypes.join(',')
    }
    return result;
  }

  @action setZoneState = state => Object.assign(this.zoneState, state);

  @action openDialog = (type) => {
    const currentTypes = !!type && type != 'all' ? [type] : this.props.acceptTypes;
    this.setZoneState({currentTypes});
    setTimeout(() => this.dropzoneRef.open(), 100);
  };

  isImage = mime => config.validation.allowedImageTypes.includes(mime);

  onDrop = (files) => {
    const {user} = this.props.store;
    const file = files[0];

    this.setZoneState({
      dragging : false,
      uploading : true,
      progress   : 0,
      errorMsg  : null,
      uploadingType : this.isImage(file.type) ? 'image' : 'file'
    });

    // TODO: move this logic into a store
    request.post(urlJoin(config.api.imgUrl, 'image/save/'))
    .set({
      Accept : 'application/json',
      Authorization : 'Apikey ' + user.data.username + ':' + user.apiKey
    })
    .attach('image', file)
    .on('progress', e => !!e.percent && this.setZoneState({progress: e.percent}))
    .end((err, res) => {
      let state = {
        progress: 0,
        uploading : false,
        currentTypes : this.props.acceptTypes
      };
      if (!err && res.status == 200) {
        this.props.onUploadSuccess && this.props.onUploadSuccess(res.body.resource, file);
        state.errorMsg = null;
      }else {
        this.props.onUploadError && this.props.onUploadError(err, res);
        state.errorMsg = t('ERROR.UPLOAD');
      }
      this.setZoneState(state);
    });
  }

  render() {
    const {ui} = this.props.store;
    const {children, icon} = this.props;
    const accept = this.getAcceptedMimes(this.zoneState.currentTypes);

    const cl = cn(
      'dropzone-area',
      this.props.className
    );

    return (
      <Dropzone
        onDrop={this.onDrop}
        onDragEnter={() => this.setZoneState({dragging: true})}
        onDragLeave={() =>this.setZoneState({dragging: false})}
        disableClick
        ref={node => {this.dropzoneRef = node}}
        className={cl}
        activeClassName="dropzone-area-drag-over"
        accept={accept}
        multiple={false}>
        {children}
      </Dropzone>
    )
  }
}
