import './dateo-main-form.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import TextField from 'material-ui/TextField';
import {t, translatable} from '../../../i18n';
import {DropzoneArea, DropzoneControl, DropzoneFileView} from '../../media-dropzone';

@inject('store')
@translatable
@observer
export default class DateoMainForm extends Component {

  render() {
    const {ui, dateoForm: form} = this.props.store;
    return (
      <DropzoneArea
        onUploadError={e => console.log('upload error', e)}
        onUploadSuccess={res => form.addMedia(res)}
        acceptTypes={['image', 'file']}
        >
        <div className="dateo-main-form">
          <div className="field-row">
            <TextField
              className="dateo-form-content-field"
              value={form.dateo.get('content')}
              multiline={true}
              name="content"
              fullWidth={true}
              placeholder="Agrega contenido"
              required={true}
              rowsMax={15}
              error={form.errors.get('content')}
              onChange={ev => form.setContent(ev.target.value)}
            />
          </div>

          <div className="asset-input">
            <DropzoneControl />
          </div>
          <div className="">
            <DropzoneFileView
              imgResources={form.dateo.get('images')}
              fileResources={form.dateo.get('files')}
              onImgSort={imgs => form.resortMedia(imgs)}
              onImgDelete={img => form.deleteMedia(img)}
              onFileSort={files => form.resortMedia(files)}
              onFileDelete={file => form.deleteMedia(file)}
              onFileEdit={file => form.mediaEdited(file)}
              />
          </div>
        </div>
      </DropzoneArea>
    );
  }
}
