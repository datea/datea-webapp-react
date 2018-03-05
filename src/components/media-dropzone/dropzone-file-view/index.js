import './dropzone-file-view.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {toJS} from 'mobx';
import {observer, inject, PropTypes as MobxPropTypes} from 'mobx-react';
import GridList from 'material-ui/GridList';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {Tr} from '../../../i18n';
import UploadedImage from './uploaded-image-item';

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

@inject('store')
@observer
export default class DropzoneFileView extends Component {

  static propTypes = {
    imgResources : MobxPropTypes.arrayOrObservableArray,
    fileResources : MobxPropTypes.arrayOrObservableArray,
    onImgDelete : PropTypes.func
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
    !!this.props.onImagesSorted && this.props.onImagesSorted([...imgResources]);
  }


  render() {
    const {onImgDelete} = this.props;
    const {imgResources} = this.state;
    return (
      <div className="dropzone-file-view">
        <SortableImageContainer
          axis="xy"
          pressDelay={200}
          imgResources={this.state.imgResources}
          onSortEnd={this.onImgSortEnd}
          onDelete={onImgDelete}
          />
      </div>
    );
  }
}
