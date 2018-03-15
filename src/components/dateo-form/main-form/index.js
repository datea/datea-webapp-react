import './dateo-main-form.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import TextField from 'material-ui/TextField';
import Collapse from 'material-ui/transitions/Collapse';
import ExpandLessIcon from 'material-ui-icons/ExpandLess';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import TodayIcon from 'material-ui-icons/Today';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import {DateTimePicker} from 'material-ui-pickers';
import {InputAdornment} from 'material-ui/Input';
import {t,Tr, translatable} from '../../../i18n';
import {DropzoneArea, DropzoneControl, DropzoneFileView} from '../../media-dropzone';
import TagField from '../../tag-field';

@inject('store')
@translatable
@observer
export default class DateoMainForm extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      optionalExpanded : false,
    }
  }

  toggleExpanded = () => this.setState({optionalExpanded: !this.state.optionalExpanded});

  render() {
    const {ui, dateoForm: form} = this.props.store;
    const {optionalExpanded} = this.state;
    const dateValue = form.dateo.get('date') ? moment(form.dateo.get('date')) : null;

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
              error={!!form.errors.get('content')}
              helperText={form.errors.get('content')}
              onChange={ev => form.setContent(ev.target.value)}
            />
          </div>

          <div className="field-row tag-field-row">
            <TagField
              tags={form.dateo.get('tags')}
              onChange={form.setTags}
              defaultSuggestions={['abababa', 'acacaca']}
              error={!!form.errors.get('tags')}
              helperText={form.errors.get('tags')}
            />
          </div>

          <div className="asset-input">
            <DropzoneControl />
          </div>
          <div className="file-listings">
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

          <div className="optional-fields">
            <Button onClick={this.toggleExpanded} className="additionl-toggle-btn">
              <Tr id="DATEO_FORM.ADDITIONAL_FIELDS" />
              {optionalExpanded
               ? <ExpandLessIcon />
               : <ExpandMoreIcon />
              }
            </Button>
            <Collapse in={this.state.optionalExpanded} timeout="auto" unmountOnExit>

              <div className="field-row title-field-row">
                <TextField
                  className="dateo-form-title-field"
                  value={form.dateo.get('title')}
                  maxLength={120}
                  name="title"
                  fullWidth={true}
                  placeholder={t('DATEO_FORM.TITLE_FIELD_PLACEHOLDER')}
                  error={form.errors.get('title')}
                  onChange={ev => form.setTitle(ev.target.value)}
                />
              </div>

              <div className="field-row date-field-row">
                <DateTimePicker
                  clearable={true}
                  value={dateValue}
                  onChange={form.setDate}
                  placeholder={t('DATEO_FORM.DATE_FIELD_PLACEHOLDER')}
                  invalidDateMessage={t('ERROR.INVALID_DATE_FORMAT')}
                  clearLabel={t('CLEAR')}
                  cancelLabel={t('CANCEL')}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton>
                          <TodayIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>

            </Collapse>
          </div>
        </div>
      </DropzoneArea>
    );
  }
}
