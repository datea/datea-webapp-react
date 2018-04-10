import React, {Component} from 'react';
import { ListItemText, ListSubheader, ListItemAvatar, ListItemIcon} from 'material-ui/List';
import {MenuItem, MenuList} from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import {observer, inject} from 'mobx-react';
import cn from 'classnames';
import scroll from 'scroll';
import UserAvatar from '../user-avatar';
import CampaignAvatar from '../campaign-avatar';
import ColorSample from '../color-sample';

@inject('store')
@observer
export default class AutocompleteList extends Component {

  renderItemImage(item) {
    if (item.leftImg == 'none') {
      return null;
    } else if (item.type == 'campaign') {
      return <CampaignAvatar src={item.leftImg} />
    } else if (item.type == 'user') {
      return <UserAvatar src={item.leftImg} size={40}/>
    }
    return null;
  }

  renderListItem({item, key, selected}) {
    const {primaryText, secondaryText} = item;
    const leftImg = this.renderItemImage(item);
    return (
      <MenuItem
        selected={selected}
        style={{height: '40px'}}
        key={key}
        onClick={() => this.props.store.searchBar.onAcItemClick(item)}
        className={'search-list-item search-ac-item-'+item.index} >
          {!!leftImg && <ListItemAvatar>{leftImg}</ListItemAvatar>}
          {!!item.colorSample && <ListItemIcon><ColorSample color={item.colorSample}/></ListItemIcon>}
          <ListItemText primary={primaryText} secondary={secondaryText} />
      </MenuItem>
    );
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
    const {ui, searchBar} = this.props.store;
    return (
      <div ref={r => {this.wrapperRef = r}}
        className={cn('search-ac-list', ui.isMobile ? 'mobile' : 'normal', !searchBar.hasAcResults && 'empty')}
        >
        <MenuList style={{paddingTop: 0, paddingBottom: 0}} value={searchBar.acSelectIndex}>
          {searchBar.acResults.map((group, i) => {
            let elems = [];
            !!group.subheader && elems.push(
              <ListSubheader key={'sh-'+i} className="ac-subheader">{group.subheader}</ListSubheader>
            );
            !!group.items && group.items.forEach((item, j) => {
              elems.push(this.renderListItem({
                  item,
                  key: `${i}-${j}`,
                  selected: item.index == searchBar.acSelectIndex
              }));
              if (j < group.items.length -1) {
                elems.push(<Divider key={`divider-${i}-${j}`} />);
              }
            })
            return elems;
          })}
        </MenuList>
      </div>
    )
  }
}
