import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import TextField from 'material-ui/TextField';
import { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction} from 'material-ui/List';
import {observer} from 'mobx-react';
import AttachFile from 'material-ui-icons/AttachFile';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import {getImgSrc} from '../../../utils';
import {t,translatable} from '../../../i18n';

@translatable
@observer
export default class UploadedFile extends Component {

  static propTypes = {
    fileResource: PropTypes.object,
    index : PropTypes.number,
    onDelete : PropTypes.func,
    onEdit: PropTypes.func,
    className: PropTypes.string
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      editing: false,
      title : '',
    }
  }

  getFileTitle() {
    let result = '';
    const res = this.props.fileResource;
    if (res.title) {
      return res.title;
    } else {
      const fname = this.getFileNameFromPath().split('.').slice(0, -1).join('.');
      return fname+' ('+t('EDIT_FILE_TITLE')+')';
    }
  }

  getFileNameFromPath() {
    if (this.props.fileResource && this.props.fileResource.file) {
      return this.props.fileResource.file.split('/').slice(-1)[0];
    } else {
      return '';
    }
  }

  activateTitleEdit = () => {
    this.setState({editing: true, title: this.getFileTitle()})
  }
  onTitleChange = (ev) => {
    this.setState({title: ev.target.value})
  }
  onTitleInputBlur = () => {
    this.setState({editing: false});
    let fileRes = this.props.fileResource;
    console.log('blur fileResource', fileRes);
    fileRes.title = this.state.title;
    !!this.props.onEdit && this.props.onEdit(fileRes);
  }

  render() {

    const primary = !this.state.editing
      ? this.getFileTitle()
      : <TextField
          value={this.state.title}
          onChange={this.onTitleChange}
          onBlur={this.onTitleInputBlur}
          multiline={true}
          rowsMax={3}
          fullWidth={true}
          autoFocus={true}
          helperText={'editar título del archivo'}
          />

    return (
      <ListItem divider={true} className="uploaded-file-list-item">
        <ListItemIcon><AttachFile /></ListItemIcon>
        <ListItemText
          primary={primary}
          secondary={!this.state.editing ? this.getFileNameFromPath() : null}
          onClick={this.activateTitleEdit}
        />
        <ListItemSecondaryAction>
          <IconButton onClick={() => console.log('on delete')}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}
