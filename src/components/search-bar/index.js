import './search-bar.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import _ from 'lodash';
import cn from 'classnames';
import {observer, inject} from 'mobx-react';
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import AutocompleteList from './autocomplete-list';
import Avatar from 'material-ui/Avatar';
import MapMarkerMultipleIcon from 'material-ui-community-icons/icons/map-marker-multiple';
import {t, translatable} from '../../i18n';
import DefaultAvatar from '../misc/default-avatar';
import {getImgSrc} from '../../utils';

@inject('store')
@translatable
@observer
export default class SearchBar extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

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
      acResults     : this.createAcResultItems([], ''),
      acSelectIndex : -1
    };
  }

  setFocus = (focused) => {
    if (this.mouseHover && this.state.focused) {
      setTimeout(() => {
        if (this.clearPressed) {
          this.clearPressed = false;
        } else {
          this.setState({focused, acSelectIndex: -1});
        }
        focused && setTimeout(() => this.doAutoComplete());
      }, 300);
    } else {
      this.setState({focused, acSelectIndex: -1});
      focused && this.doAutoComplete();
    }
  }

  handleChange = (ev) => {
    const query = ev.target.value;
    this.setState({query});
    _.debounce(() => this.doAutoComplete(), 500)();
  }

  doAutoComplete() {
    const {data} = this.props.store;
    const query = this.state.query;
    let state = {acSelectIndex : -1};
    if (query && query.length >= 2) {
      data.searchAutoComplete(query).then(res => {
        state.acResults = this.createAcResultItems(res, this.state.query);
        this.setState(state);
      });
    }else{
      state.acResults = this.createAcResultItems([], this.state.query);
      this.setState(state);
    }
  }

  handlePressKey = (ev) => {
    const {store} = this.props;
    const key = ev.keyCode;
    if (key == 13) {
      if (this.state.query && this.state.acSelectIndex == -1) {
        this.refs.searchField.blur();
        const query = this.state.query.trim();
        store.goTo('search', {query});
      } else if (this.state.acSelectIndex >= 0) {
        this.refs.searchField.blur();
        let route = this.state.acResults.filter(r => r.type == 'listItem')[this.state.acSelectIndex].route;
        this.setState({query: '', acSelectIndex: -1});
        store.goTo(route.view, route.params);
      }
    }
    if (key == 40 || key == 38) {
      ev.preventDefault();
      key == 40 && this.incrementAcResult(1);
      key == 38 && this.incrementAcResult(-1);
    }
  }

  navigateTo = (route) => {
    this.setState({query: '', acSelectIndex: -1});
    this.props.store.goTo(route.view, route.params);
  }

  handleClear = (ev) => {
    this.clearPressed = true;
    this.setState({query: '', acResults: this.createAcResultItems([], ''), acSelectIndex: -1});
    this.refs.searchField.focus();
  }

  incrementAcResult(num) {
    const {user} = this.props.store;
    let totalResults;
    if (this.state.query.length < 2) {
      if (user.isSignedIn) {
        totalResults = (!!user.data.dateo_count ? 1 : 0) + (user.data.tags_followed.length);
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

  createAcResultItems(results, query) {
    const {user} = this.props.store;
    let listItems = [];

    if (query.length > 1 && !results.length) {
      return listItems;
    } else if (!results || !results.length) {
      // add personal dateos
      if (user.isSignedIn) {
        if (user.data.dateo_count > 0) {
          listItems.push({
            type: 'listItem',
            primaryText:
                   <span>
                     <strong>{'@'+user.data.username}</strong>
                     <span> {'('+t('SEARCHBOX.MY_DATEOS')+')'}</span>
                   </span>,
            secondaryText: user.data.dateo_count+ ' dateos',
            leftAvatar: user.image ? <Avatar src={user.smallImage} /> : <DefaultAvatar />,
            route : { view: 'profileDateos'}
          });

          if (user.data.tags_followed.length) {
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
    const {user} = this.props.store;
    return user.data.tags_followed.map(item => {
      if (t.type == 'tag') {
        return {
          type: 'listItem',
          primaryText: '#'+item.tag,
          secondaryText : item.dateo_count + 'dateos',
          route: {view: 'tag', params: {tag: item.tag}}
        }
      }else{
        return {
          type: 'listItem',
          primaryText : item.campaigns[0].name,
          secondaryText: '#'+item.tag+', '+item.dateo_count+' dateos',
          leftAvatar : !!item.campaigns[0].thumb ?
              <Avatar src={getImgSrc(item.campaigns[0].thumb)} style={{borderRadius: '5px'}} /> :
              <Avatar icon={<MapMarkerMultipleIcon />} style={{borderRadius: '5px'}} />,
          route: {
            view: 'campaign',
            params: {
              username: item.campaigns[0].username,
              slug: item.campaigns[0].slug
            }
          }
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
                route : {
                  view: 'tag',
                  params: {tag: item.tag}
                }
              };
      }else if (item.type == 'campaign') {
        return {
                type: 'listItem',
                primaryText : item.name,
                leftAvatar : !!item.thumb ?
                    <Avatar src={getImgSrc(item.thumb)} style={{borderRadius: '5px'}} /> :
                    <Avatar icon={<MapMarkerMultipleIcon />} style={{borderRadius: '5px'}} />,
                secondaryText : '#'+item.main_tag+', '+item.dateo_count+' dateos',
                route : {
                  view: 'campaign',
                  params: {
                    username: item.user,
                    slug: item.slug
                  }
                }
              };
      }
    });
  }

  render() {
    const {ui} = this.props.store;
    const barClass = cn(
      'search-bar',
      ui.isMobile ? 'mobile' : 'normal',
      this.state.focused && 'focused'
    );
    const inputStyle = {
        paddingLeft  : 44,
        paddingRight : 44,
        boxSizing    : 'border-box',
        width        : '100%',
    };
    const acResults = this.state.acResults;

    return (
      <div className={barClass}
        onMouseEnter={() => this.mouseHover = true}
        onMouseLeave={() => this.mouseHover = false}>
        <div className="search-box">
          <SearchIcon className="search-icon"
            style={{width: this.props.iconSize, height: this.props.iconSize}} />
          <TextField ref="searchField"
            name="mainSearch"
            hintText={this.state.focused ? 'Buscar mapeos' : ''}
            fullWidth={true}
            onFocus={()=> this.setFocus(true)}
            onBlur={()=> this.setFocus(false)}
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
              onItemClick={this.navigateTo}
             />
          </div>
        }
      </div>
    );
  }
}
