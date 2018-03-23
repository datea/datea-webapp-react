import './subtag-field.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {PropTypes as MobxPropTypes} from 'mobx-react';
import cn from 'classnames';
import List, { ListItem, ListItemSecondaryAction, ListItemText, ListSubheader} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Delete';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import {Tr} from '../../../i18n';
import TagField from '../../tag-field';
import ColorPicker from '../../color-picker';
import {chartColors} from '../../../config/colors';

const SubtagItem = ({tag, onChangeColor, onDelete, index}) =>
  <ListItem key={tag.tag} divider={true} dense>
    <ColorPicker
      color={tag.color}
      onChange={onChangeColor}
      />
    <ListItemText primary={`#${tag.tag}`} />
    <ListItemSecondaryAction>
      <IconButton aria-label="close" onClick={onDelete}>
        <CloseIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>

const SubtagItemSortable = SortableElement(SubtagItem);

const SubtagList = ({subtags, onDelete, onChangeColor}) =>
  <List>
    {subtags.map((tag, idx) =>
      <SubtagItemSortable
        key={tag.tag}
        tag={tag}
        onChangeColor={color => onChangeColor(idx, color)}
        onDelete={() => onDelete(idx)}
        index={idx} />
    )}
  </List>

const SubtagListSortable = SortableContainer(SubtagList);


export default class SubtagField extends Component {

  static propTypes = {
    subtags : MobxPropTypes.arrayOrObservableArray,
    onChange : PropTypes.func,
  };

  state = {
    tag : null
  };

  onTagInputChange = val => {
    this.setState({tag: ''});
    !!val && this.addSubTag(val);
  }

  addSubTag = (tag) => {
    const {subtags, onChange} = this.props;
    let currentTags = subtags || [];
    // check if double
    for (let t of currentTags) {
      if (t.tag == tag) {
        return;
      }
    }
    const idx = (subtags || [] ).length;
    currentTags.push({tag, color: chartColors[idx], order: idx});
    !!onChange && onChange(currentTags);
  }

  delSubTag = (idx) => {
    const {subtags, onChange} = this.props;
    let currentTags = subtags.filter((t, i)=> i != idx);
    currentTags.forEach((tag, i) => {
      tag.order = i;
    })
    !!onChange && onChange([...currentTags]);
  }

  onChangeTagColor = (idx, color) => {
    const {subtags, onChange} = this.props;
    subtags[idx].color = color;
    !!onChange && onChange([...subtags]);
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    let {subtags, onChange} = this.props;
    subtags = arrayMove(subtags, oldIndex, newIndex);
    subtags.forEach((tag, idx) => {
      tag.order = idx;
    });
    !!onChange && onChange([...subtags]);
  }

  render() {
    const {subtags} = this.props;
    return (
      <div className="subtag-field">
        <TagField
          value={this.state.tag}
          multi={false}
          onChange={this.onTagInputChange}
          label={<Tr id="CAMPAIGN_FORM.SECTION_TITLE2" />}
          />
        {!!subtags && !!subtags.length &&
          <SubtagListSortable
            axis="y"
            distance={8}
            onSortEnd={this.onSortEnd}
            subtags={subtags}
            onChangeColor={this.onChangeTagColor}
            onDelete={this.delSubTag}
          />
        }
      </div>
    )
  }
}
