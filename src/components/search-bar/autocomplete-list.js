import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {List, ListItem, makeSelectable} from 'material-ui/List';
import {observer, inject} from 'mobx-react';
import cn from 'classnames';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import scroll from 'scroll';

const SelectableList = makeSelectable(List);

@inject('store')
@observer
export default class AutocompleteList extends Component {

  renderListItem (item, idx, i) {
    if (item.type == 'subHeader') {
      return <Subheader style={{lineHeight: '24px', paddingTop: '10px'}} key={i}>{item.text}</Subheader>
    }else{
      const {route, ...props} = item;
      return <ListItem
               {...props}
               value={idx}
               key={i}
               onTouchTap={() => this.props.onItemClick && this.props.onItemClick(route)}
               className={'search-list-item search-ac-item-'+idx}
              />
    }
  }

  componentDidMount() {
    this.props.store.ui.isMobile && this.adjustMaxHeight();
  }

  componentDidUpdate() {
    if (this.props.store.ui.isMobile) {
      this.adjustMaxHeight();
    }else{
      if (this.props.selectIdx > -1) {
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
    const {ui} = this.props.store;
    let idx = -1;
    const query = this.props.query || '';
    return (
      <div ref="wrapper"
        className={cn('search-ac-list', ui.isMobile ? 'mobile' : 'normal', !this.props.items.length && 'empty')}
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
