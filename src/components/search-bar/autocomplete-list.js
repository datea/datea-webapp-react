import React, {Component} from 'react';
import PropTypes from 'prop-types'
import { ListItemText, ListSubheader, ListItemAvatar} from 'material-ui/List';
import {MenuItem, MenuList} from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import {observer, inject} from 'mobx-react';
import cn from 'classnames';
import scroll from 'scroll';

@inject('store')
@observer
export default class AutocompleteList extends Component {

  static propTypes = {
    selectIdx: PropTypes.number,
    items: PropTypes.array,
    onItemClick: PropTypes.func
  };

  renderListItem({item, selIdx, key, selected}) {
    if (item.type == 'subHeader') {
      return <ListSubheader
              style={{lineHeight: '24px', paddingTop: '10px'}}
              key={key}>
                {item.text}
              </ListSubheader>
    } else {
      const {route, primaryText, secondaryText, leftAvatar} = item;
      return <MenuItem
              selected={selected}
              style={{height: '40px'}}
              key={key}
              onClick={() => this.props.onItemClick && this.props.onItemClick(route)}
              className={'search-list-item search-ac-item-'+selIdx} >
                {!!leftAvatar &&
                  <ListItemAvatar>{leftAvatar}</ListItemAvatar>
                }
                <ListItemText primary={primaryText} secondary={secondaryText} />
              </MenuItem>
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
        const container = this.wrapperRef;
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
    this.wrapperRef.style.maxHeight = (window.innerHeight - 48)+'px';
  }

  render() {
    const {ui} = this.props.store;
    let idx = -1;
    const query = this.props.query || '';
    return (
      <div ref={r => {this.wrapperRef = r}}
        className={cn('search-ac-list', ui.isMobile ? 'mobile' : 'normal', !this.props.items.length && 'empty')}
        >
        <MenuList style={{paddingTop: 0, paddingBottom: 0}} value={this.props.selectIdx}>
          {this.props.items.map((item, i) => {
            if (item.type == 'listItem') idx++;
            let result = [this.renderListItem({
              item,
              selIdx: idx,
              key: i,
              selected: idx == this.props.selectIdx
            })];
            if (item.type == 'listItem' && i < this.props.items.length -1) {
              result.push(<Divider key={'divider-'+i} />)
            }
            return result;
          })}
        </MenuList>
      </div>
    )
  }
}
