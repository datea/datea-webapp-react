import './search-bar.scss';
import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import _ from 'lodash';
import cn from 'classnames';
import UI from '../../stores/ui';
import USER from '../../stores/user';
import DATA from '../../stores/data';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import AutocompleteList from './autocomplete-list';
import {t, translatable} from '../../i18n';
import Avatar from 'material-ui/Avatar';
import DefaultAvatar from '../misc/default-avatar';
import {getImgSrc} from '../../utils';
import {toJS} from 'mobx';

@translatable
@observer
export default class SearchBar extends Component {

  static defaultProps = {
    iconSize : 30
  };
  mouseHover   = false;
  clearPressed = false;

  constructor(props, context) {
    super(props, context);
    this.state = {
      focused       : false,
      query         : '',
      acResults     : [],
      acSelectIndex : -1
    };
  }

  setFocus = (focused) => {
    if (this.mouseHover) {
      setTimeout(() => {
        if (this.clearPressed) {
          this.clearPressed = false;
        } else {
          this.setState({focused, acSelectIndex: -1});
        }
      }, 300);
    } else {
      this.setState({focused, acSelectIndex: -1});
    }
  }

  handleChange = (ev) => {
    const query = ev.target.value;
    this.setState({query});
    _.debounce(() => this.doAutoComplete(), 500)();
  }

  doAutoComplete() {
    const query = this.state.query;
    let state = {acSelectIndex : false};
    if (query && query.length >= 2) {
      DATA.searchAutoComplete(query).then(res => {
        console.log(res);
        state.acResults = res;
        this.setState(state);
      });
    }else{
      state.acResults = [];
      this.setState(state);
    }
  }

  handlePressKey = (ev) => {
    if (ev.keyCode == 13) {
      this.refs.searchField.blur();
      console.log('run search');
    }
    ev.keyCode == 40 && this.incrementAcResult(1);
    ev.keyCode == 38 && this.incrementAcResult(-1);
  }

  handleClear = (ev) => {
    this.clearPressed = true;
    this.setState({query: '', acResults: [], acSelectIndex: -1});
    this.refs.searchField.focus();
  }

  incrementAcResult(num) {
    let totalResults;
    if (this.state.query.length < 2) {
      if (USER.isSignedIn) {
        totalResults = (!!USER.data.dateo_count ? 1 : 0) + (USER.data.tags_followed.length);
      }else{
        totalResults = 0;
      }
    }else {
      totalResults = this.state.acResults.length
    }
    const futurePos = this.state.acSelectIndex + num;
    if (futurePos < totalResults && futurePos > -1) {
      this.setState({acSelectIndex: futurePos});
    }else if (futurePos == -1 && this.state.acSelectIndex != -1) {
      this.setState({acSelectIndex : -1});
    }
  }

  createAcResultItems() {
    let listItems = [];
    let results = this.state.acResults;
    let query = this.state.query;

    if (query.length > 1 && !results.length) {
      return listItems;
    } else if (!results || !results.length) {
      // add personal dateos
      if (USER.isSignedIn) {
        if (USER.data.dateo_count > 0) {
          listItems.push({
            type: 'listItem',
            primaryText:
                   <span>
                     <strong>{'@'+USER.data.username}</strong>
                     <span> {'('+t('SEARCHBOX.MY_DATEOS')+')'}</span>
                   </span>,
            secondaryText: USER.data.dateo_count+ ' dateos',
            leftAvatar: USER.image ? <Avatar src={USER.smallImage} /> : <DefaultAvatar />,
            path : '/'+USER.data.username+'/dateos'
          });

          if (USER.data.tags_followed.length) {
            // add stuff I follow
            listItems.push({
              type : 'subHeader',
              text : t('SEARCHBOX.MAPPINGS_I_FOLLOW')
            });
            listItems = listItems.concat(this.createFollowedAcItemList());
          }
        }
      }
    } else if (results && !!results.length) {
      listItems.push({
        type : 'subHeader',
        text : t('SEARCHBOX.MAPPINGS')
      });
      listItems = listItems.concat(this.createAcSearchResultItems(results));
    }
    return listItems;
  }

  createFollowedAcItemList() {
    return USER.data.tags_followed.map(item => {
      if (t.type == 'tag') {
        return {
          type: 'listItem',
          primaryText: '#'+item.tag,
          secondaryText : item.dateo_count + 'dateos',
          path: '/tag/'+item.tag,
        }
      }else{
        return {
          type: 'listItem',
          primaryText : item.campaigns[0].name,
          secondaryText: '#'+item.tag+', '+item.dateo_count+' dateos',
          leftAvatar : <Avatar src={getImgSrc(item.campaigns[0].thumb)} style={{borderRadius: '5px'}} />,
          path: '/'+ item.campaigns[0].username+'/'+item.campaigns[0].slug
        }
      }
    })
  }

  createAcSearchResultItems(results) {
    return results.map(item => {
      if (item.type == 'tag') {
        return {
                type: 'listItem',
                primaryText : '#'+item.tag,
                secondaryText : item.dateo_count+' dateos',
                path : '/tag/'+item.tag
              };
      }else if (item.type == 'campaign') {
        return {
                type: 'listItem',
                primaryText : item.name,
                leftAvatar : <Avatar src={getImgSrc(item.thumb)} style={{borderRadius: '5px'}}/>,
                secondaryText : '#'+item.main_tag+', '+item.dateo_count+' dateos',
                path : '/'+item.user+'/'+item.slug
              };
      }
    });
  }

  render() {
    const barClass = cn(
      'search-bar',
      UI.isMobile ? 'mobile' : 'normal',
      this.state.focused && 'focused'
    );
    const inputStyle = {
        paddingLeft  : 44,
        paddingRight : 44,
        boxSizing    : 'border-box',
        width        : '100%',
    };
    const acResults = this.createAcResultItems();

    return (
      <div className={barClass}
        onMouseEnter={() => this.mouseHover = true}
        onMouseLeave={() => this.mouseHover = false}>
        <div className="search-box">
          <SearchIcon className="search-icon" style={{width: this.props.iconSize, height: this.props.iconSize}} />
          <TextField ref="searchField"
            name="mainSearch"
            hintText={this.state.focused ? 'Buscar mapeos' : ''}
            fullWidth={true}
            onFocus={()=> this.setFocus(true)}
            onBlur={()=> this.setFocus(true)}
            inputStyle={inputStyle}
            hintStyle={inputStyle}
            style={{display: 'block'}}
            underlineShow={false}
            onKeyDown={this.handlePressKey}
            onChange={this.handleChange}
            value={this.state.query}
           />
           {!!this.state.focused && !!this.state.query &&
             <IconButton className="search-clear-btn"
              style={{position: 'absolute', top: 0, right: 0}}
              onTouchTap={this.handleClear}>
                <CloseIcon />
            </IconButton>
           }
        </div>
        <div className="search-bg"></div>
        {this.state.focused &&
          <div className={cn('ac-wrapper', !!acResults.length && 'full')}>
            <AutocompleteList
              items={acResults}
              selectIdx={this.state.acSelectIndex}
             />
          </div>
        }
      </div>
    );
  }
}
