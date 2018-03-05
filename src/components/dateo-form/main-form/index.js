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
        onUploadSuccess={res => form.addImage(res)}
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
              onImagesSorted={imgs => form.resortImages(imgs)}
              onImgDelete={img => form.deleteImage(img)}
              />
          </div>
        </div>
      </DropzoneArea>
    );
  }
}
