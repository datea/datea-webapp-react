import './dropzone-file-view.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {toJS} from 'mobx';
import {observer, inject, PropTypes as MobxPropTypes} from 'mobx-react';
import GridList from '@material-ui/core/GridList';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {Tr} from '../../../i18n';
import UploadedImage from './uploaded-image-item';
import UploadedFile from './uploaded-file-item';

const UploadedImageSortable = SortableElement(UploadedImage);
const SortableImageContainer = SortableContainer(({imgResources, onDelete}) =>
  <GridList cellHeight={120} spacing={1}>
    {imgResources.map( (resource, index) =>
      <UploadedImageSortable
        key={`item-${index}`}
        imgResource={resource}
        index={index}
        onDelete={onDelete} />
    )}
  </GridList>
);
const UploadedFileSortable = SortableElement(UploadedFile);
const SortableFileContainer = SortableContainer(({fileResources, onDelete, onEdit}) =>
  <List className="file-view-list">
    {fileResources.map( (resource, index) =>
      <UploadedFileSortable
        key={`item-${index}`}
        fileResource={resource}
        index={index}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    )}
  </List>
);

@inject('store')
@observer
export default class DropzoneFileView extends Component {

  static propTypes = {
    imgResources  : MobxPropTypes.arrayOrObservableArray,
    onImgDelete   : PropTypes.func,
    onImgSort     : PropTypes.func,
    fileResources : MobxPropTypes.arrayOrObservableArray,
    onFileDelete  : PropTypes.func,
    onFileEdit    : PropTypes.func,
    onFileSort    : PropTypes.func
  };

  static defaultProps = {
    imgResources : [],
    fileResources : []
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      imgResources : _.sortBy(toJS(props.imgResources), 'order'),
      fileResources : _.sortBy(toJS(props.imgResources), 'order'),
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      imgResources : _.sortBy(toJS(nextProps.imgResources), 'order'),
      fileResources : _.sortBy(toJS(nextProps.fileResources), 'order')
    });
  }

  onImgSortEnd = ({oldIndex, newIndex}) => {
    const imgResources = arrayMove(this.state.imgResources, oldIndex, newIndex);
    this.setState({imgResources});
    !!this.props.onImgSort && this.props.onImgSort([...imgResources]);
  }

  onFileSortEnd = ({oldIndex, newIndex}) => {
    const fileResources = arrayMove(this.state.fileResources, oldIndex, newIndex);
    this.setState({fileResources});
    !!this.props.onFilesSort && this.props.onFilesSort([...fileResources]);
  }


  render() {
    const {onImgDelete, onFileDelete, onFileEdit} = this.props;
    const {imgResources, fileResources} = this.state;
    return (
      <div className="dropzone-file-view">
        {!!imgResources.length &&
          <ListSubheader component={'div'} className="file-view-subheader">
            <Tr id="IMAGES" />
          </ListSubheader>
        }
        <SortableImageContainer
          axis="xy"
          pressDelay={200}
          imgResources={imgResources}
          onSortEnd={this.onImgSortEnd}
          onDelete={onImgDelete}
          />

        {!!fileResources.length &&
          <ListSubheader component={'div'} className="file-view-subheader files">
            <Tr id="FILES" />
          </ListSubheader>
        }
        <SortableFileContainer
          axis="y"
          pressDelay={200}
          fileResources={fileResources}
          onSortEnd={this.onFileSortEnd}
          onDelete={onFileDelete}
          onEdit={onFileEdit}
          />
      </div>
    );
  }
}
