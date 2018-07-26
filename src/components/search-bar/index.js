import './search-bar.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import cn from 'classnames';
import {observer, inject} from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import OptionsContainer from './options-container';
import {t, translatable} from '../../i18n';
import {getImgSrc} from '../../utils';

@inject('store')
@translatable
@observer
export default class SearchBar extends Component {

  static contextTypes = {
    router: PropTypes.object
  };

  mouseHover = false;
  insideMenuOpen = false;
  clearPressed = false;

  constructor(props, context) {
    super(props, context);
    this.state = {
      focused : false,
    };
  }

  setFocus = (focused) => {
    const {searchBar} = this.props.store;
    setTimeout(() => {
      console.log('insideMenuOpen', this.insideMenuOpen);
      if (this.mouseHover && this.state.focused && !this.insideMenuOpen && !this.dontCloseClick) {
        setTimeout(() => {
          if (this.clearPressed) {
            this.clearPressed = false;
          } else {
            searchBar.resetAcIndex();
            this.setState({focused});
          }
          focused && setTimeout(() => searchBar.doAutoComplete());
        }, 300);
      } else {
        if (!this.insideMenuOpen && !this.dontCloseClick) {
          searchBar.resetAcIndex();
          this.setState({focused});
          focused && searchBar.doAutoComplete();
        }
      }
      this.dontCloseClick = false;
    });
  }

  handleChange = (ev) => this.props.store.searchBar.setSearch(ev.target.value);

  handlePressKey = (ev) => {
    const {searchBar} = this.props.store;
    const key = ev.keyCode;
    if (key == 13) {
      if ((searchBar.searchValid() && searchBar.acSelectIndex == -1) || searchBar.acSelectIndex >= 0) {
        this.searchFieldRef.blur();
        searchBar.onEnter();
      }
    }
    if (key == 40 || key == 38) {
      ev.preventDefault();
      key == 40 && searchBar.incrementAcResult(1);
      key == 38 && searchBar.incrementAcResult(-1);
    }
  }

  handleClear = (ev) => {
    this.clearPressed = true;
    this.props.store.searchBar.clear();
    this.searchFieldRef.focus();
  }

  onOpenInsideMenu = () => {
    this.insideMenuOpen = true;
  }

  onCloseInsideMenu = () => {
    this.insideMenuOpen = true;
  }

  render() {
    const {ui, searchBar} = this.props.store;
    const barClass = cn(
      'search-bar',
      ui.isMobile ? 'mobile' : 'normal',
      this.state.focused && 'focused'
    );
    const inputStyle = {
        paddingLeft  : 44,
        paddingRight : this.state.focused && !!searchBar.search ? 44 : 0,
        lineHeight   : '35px',
    };

    return (
      <div className={barClass}
        onMouseEnter={() => this.mouseHover = true}
        onMouseLeave={() => this.mouseHover = false}>
        <div className="search-box">
          <SearchIcon className="search-icon no-switch" />
          <TextField inputRef={ref => {this.searchFieldRef = ref}}
            name="mainSearch"
            className="main-search-textfield"
            placeholder={searchBar.mode == 'global' ? t('SEARCHBOX.GLOBAL_PH') : t('SEARCHBOX.LOCAL_PH')}
            fullWidth={true}
            onFocus={()=> this.setFocus(true)}
            onBlur={()=> this.setFocus(false)}
            InputProps={{style:inputStyle, disableUnderline: true}}
            onKeyDown={this.handlePressKey}
            onChange={this.handleChange}
            value={searchBar.search}
           />
          {!!this.state.focused && !!searchBar.search && !searchBar.loading &&
             <IconButton className="search-clear-btn" onClick={this.handleClear}>
               <CloseIcon />
             </IconButton>
           }
           {searchBar.loading &&
             <CircularProgress className="search-loading-indicator" size={20} style={{color: '#ccc'}} />
           }
        </div>
        <div className="search-bg"></div>
        {this.state.focused &&
          <div className={cn('ac-wrapper', searchBar.hasAcResults && 'full')}>
            <OptionsContainer setNonCloseClick={() => {this.dontCloseClick = true}} />
          </div>
        }
      </div>
    );
  }
}
