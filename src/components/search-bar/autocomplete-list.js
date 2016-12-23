import React, {Component, PropTypes} from 'react';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import {toJS} from 'mobx';
import cn from 'classnames';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import UI from '../../stores/ui';
import USER from '../../stores/user';
//import SearchIcon from 'material-ui/svg-icons/action/search';

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
      return <ListItem {...props}
               value={idx}
               key={i}
               onTouchTap={() => this.context.router.push(path)}
               className="search-list-item"
              />
    }
  }

  componentDidMount() {
    UI.isMobile && this.adjustMaxHeight();
  }

  componentDidUpdate() {
    UI.isMobile && this.adjustMaxHeight();
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
