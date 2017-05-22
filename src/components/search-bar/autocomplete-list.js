import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {List, ListItem, makeSelectable} from 'material-ui/List';
import {toJS} from 'mobx';
import cn from 'classnames';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import UI from '../../stores/ui';
import USER from '../../stores/user';
import scroll from 'scroll';

const SelectableList = makeSelectable(List);

export default class AutocompleteList extends Component {

  static contextTypes = {
    router : React.PropTypes.object
  }

  renderListItem (item, idx, i) {
    if (item.type == 'subHeader') {
      return <Subheader style={{lineHeight: '24px', paddingTop: '10px'}} key={i}>{item.text}</Subheader>
    }else{
      const {path, ...props} = item;
      return <ListItem
               {...props}
               value={idx}
               key={i}
               onTouchTap={() => this.props.onItemClick && this.props.onItemClick(path)}
               className={'search-list-item search-ac-item-'+idx}
              />
    }
  }

  componentDidMount() {
    UI.isMobile && this.adjustMaxHeight();
  }

  componentDidUpdate() {
    if (UI.isMobile) {
      this.adjustMaxHeight();
    }else{
      if (this.props.selectIdx > -1) {
        console.log('.search-ac-item-'+this.props.selectIdx);
        const itemEl = document.querySelector('.search-ac-item-'+this.props.selectIdx);
        const container = this.refs.wrapper;
        if (
            (itemEl.offsetTop + itemEl.offsetHeight) > (container.offsetHeight + container.scrollTop)
          || (container.scrollTop > 0 && itemEl.offsetTop < container.scrollTop)
        ) {
          scroll.top(container, itemEl.offsetTop, {duration: 150});
        }
      }
    }
  }

  adjustMaxHeight() {
    const maxHeight = window.innerHeight - 48;
    this.refs.wrapper.style.maxHeight = (window.innerHeight - 48)+'px';
  }

  render() {
    let idx = -1;
    const query = this.props.query || '';
    return (
      <div ref="wrapper"
        className={cn('search-ac-list', UI.isMobile ? 'mobile' : 'normal', !this.props.items.length && 'empty')}
        >
        <SelectableList ref="list" style={{padding: 0}} value={this.props.selectIdx}>
          {this.props.items.map((item, i) => {
            if (item.type == 'listItem') idx++;
            return this.renderListItem(item, idx, i);
          })}
        </SelectableList>
      </div>
    )
  }
}
