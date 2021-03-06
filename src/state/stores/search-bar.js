import {observable, action, computed, autorun, reaction, runInAction, toJS, when} from 'mobx';
import urlJoin from 'url-join';
import _ from 'lodash';
import Api from '../rest-api';
import config from '../../config';
import getImgSrc from '../../utils';
import {t} from '../../i18n';

const MIN_SEARCH_LENGTH = 2;

export default class SearchBarStore {

  @observable acResults = [];
  @observable search = '';
  @observable acSelectIndex = -1;
  @observable mode = 'global';
  @observable modeIsSwitcheable = false;
  @observable loading = false;

  @computed get numAcResults() {
    let num = 0;
    this.acResults.forEach(group => {num += (!!group.items && group.items.length : 0)});
    return num;
  }

  @computed get hasAcResults() {
    return !!this.numAcResults;
  }

  constructor(main) {
    this.main = main;
    this.initModeReaction();
    setTimeout(() => {
      const {routerState} = this.main.router;
      if (routerState.queryParams && routerState.queryParams.q) {
        this.search = routerState.queryParams.q;
      }
    });
  }

  @action clear = () => {
    this.acResults = this.getDefaultSuggestions();
    this.search = '';
    this.acSelectIndex = -1;
  }

  initModeReaction = () => {
    this.modeReaction = reaction(
      () => {
        const {routerState} = this.main.router;
        switch (routerState.routeName) {
          case 'campaign':
            return 'campaign-'+routerState.params.slug;
          case 'tag':
            return 'campaign-'+routerState.params.tag;
          case 'profileDateos':
            return 'profile-'+routerState.params.username;
          default :
            return '';
        }
      },
      (mapping) => {
        this.mode = !!mapping ? 'mapeo' : 'global';
        this.modeIsSwitcheable = !!mapping;
      }
    )
  }

  @action setSearch = search => {
    this.search = search;
    this.doAutoComplete();
  }

  @action switchMode = mode => {
    this.mode = mode;
    this.clear();
  }

  @action onEnter = () => {
    if (this.search.trim().length >= MIN_SEARCH_LENGTH && this.acSelectIndex == -1) {
      const query = this.search.trim();
      this.main.router.goTo('search', {}, {q: query});
      this.search = query;
      this.acSelectIndex = -1;
    } else if (this.acSelectIndex >= 0) {
      const {route} = this.getAcIndexRoute(this.acSelectIndex);
      this.search = '';
      this.acSelectIndex = -1;
      this.goTo(item.route);
    }
  }

  @action onAcItemClick = (item) => {
    this.search = '';
    this.acSelectIndex = -1;
    this.goTo(item.route);
  }

  goTo = (route) => {
    route = toJS(route);
    const view = route.view || this.main.router.routerState.routeName;
    const params = route.params || this.main.router.routerState.params;
    const queryParams = route.queryParams || {};
    this.main.router.goTo(view, params, queryParams);
    if (queryParams && queryParams.q) {
      this.search = queryParams.q;
    }
  }

  @action resetAcIndex = () => {
    this.acSelectIndex = -1;
  }

  @action incrementAcResult = (num) => {
    let nextIdx = this.acSelectIndex + num;
    if (nextIdx < this.numAcResults && nextIdx > -1) {
      this.acSelectIndex = nextIdx;
    } else if (nextIdx == -1 && this.acSelectIndex != -1) {
      this.acSelectIndex = -1;
    }
  }

  @action _doAutocomplete = () => {
    this.acSelectIndex = -1;
    if (this.search && this.search.trim().length >= MIN_SEARCH_LENGTH) {
      if (this.mode == 'mapeo') {
        console.log('hey man');
        this.autocompleteOnMapeo();
      } else {
        this.autocompleteGlobal();
      }
    } else {
      this.acResults = this.getDefaultSuggestions();
    }
  }

  doAutoComplete = _.debounce(this._doAutocomplete, 500, {leading: true});

  @action autocompleteOnMapeo = () => {
    let narrowOn;
    switch (this.main.router.routerState.routeName) {
      case 'campaign':
        narrowOn = '#'+this.main.campaignView.data.campaign.main_tag.tag;
        break;
      case 'tag':
        narrowOn = '#'+this.main.tagView.data.tag.tag;
        break;
      case 'profileDateos':
        narrowOn = '@'+this.main.router.routerState.params.username;
        break;
      default:
        return;
    }

    this.loading = true;
    Api.mapping.autocompleteInside(narrowOn, this.search)
    .then(res => runInAction(() => {
      console.log('res', res);
      this.acResults = [{
        subheader : null,
        items : res.map( (item, idx) => this.formatInMappingAcResult(item, idx))
      }];
      console.log('this.acResults', this.acResults);
      this.loading = false;
    }))
    .catch(e => {
      this.loading = false;
      console.log(e);
    });
  }

  @action autocompleteGlobal = () => {
    this.loading = true;
    Api.mapping.autocomplete(this.search)
    .then(res => runInAction(() => {
      this.acResults = [{
        subheader : t('SEARCHBOX.MAPPINGS'),
        items : res.map( (item, idx) => this.formatAcResult(item, idx))
      }];
      this.loading = false;
    }))
    .catch(e => {
      this.loading = false;
      console.log(e);
    });
  }

  formatAcResult(item, index) {
    if (item.type == 'tag' || (!!item.tag && item.type != 'campaign')) {
      return {
        index,
        primaryText : '#'+item.tag,
        secondaryText : item.dateo_count+' '+t('DATEOS'),
        type : 'tag',
        route : {
          view : 'tag',
          params : {tag: item.tag}
        }
      }
    } else if (item.type == 'campaign' || !!item.main_tag) {
      return {
        index,
        primaryText : item.name,
        secondaryText : '#'+item.main_tag+', '+item.dateo_count+' '+t('DATEOS'),
        leftImg : item.thumb,
        type : 'campaign',
        route : {
          view : 'campaign',
          params : {
            username : item.username,
            slug : item.slug
          }
        }
      };
    } else if (!!item.username || item.type == 'user') {
      return {
        index,
        primaryText : '@'+item.username,
        secondaryText : item.dateo_count+' '+t('DATEOS'),
        type : 'user',
        leftImg : item.thumb || item.image,
        route : {
          view : 'profile',
          params : {
            username : item.username,
            page : 'dateos'
          }
        }
      }
    }
  }

  formatInMappingAcResult(item, index) {
    return {
      index,
      primaryText : item.item,
      secondaryText : item.dateo_count+' '+t('DATEOS'),
      type : item.item[0] == '@' ? 'user' : 'tag',
      leftImg : 'none',
      route : {
        queryParams : {q: item.item}
      }
    }
  }

  getDefaultSuggestions() {
    if (this.mode == 'mapeo') {
      return this.createDefaultMapeoSuggestions();
    } else {
      return this.createDefaultGlobalSuggestions();
    }
  }

  createDefaultGlobalSuggestions() {
    let suggestions = [];
    let idx = 0;
    if (this.main.user.isSignedIn) {
      const user = this.main.user;
      if (!!user.data.dateo_count) {
        let userItem = this.formatAcResult(user.data, idx);
        idx++;
        userItem.primaryText += ' ('+t('MY_DATEOS').toLowerCase()+')'
        suggestions.push({
          subheader : null,
          items : [userItem]
        });
      }
      const tags_followed = user.data.tags_followed;
      if (tags_followed && tags_followed.length) {
        let followed = {
            subheader : t('SEARCHBOX.MAPPINGS_I_FOLLOW'),
            items : []
        }
        tags_followed.forEach( tag => {
          if (tag.campaigns && tag.campaigns.length) {
            let camp = tag.campaigns[0];
            let item = Object.assign({}, tag, {
              name : camp.name,
              main_tag : tag.tag,
              thumb : camp.thumb,
              type : 'campaign',
              username : camp.username,
              slug : camp.slug
            });
            followed.items.push(this.formatAcResult(item, idx));
            idx++;
          } else {
            followed.items.push(this.formatAcResult(tag, idx));
            idx++;
          }
        });
        suggestions.push(followed);
      }
    }
    return suggestions;
  }

  createDefaultMapeoSuggestions() {
    const viewName = this.main.router.routerState.routeName;
    if (viewName == 'campaign') {
      const {subtags} = this.main.campaignView.data.campaign;
      if (subtags && subtags.size) {
        return [{
          subheader : t('SEARCH_FILTER.FILTER_TAG'),
          items : [...subtags.values()].map((tag, index) => ({
            index,
            primaryText : '#'+tag.tag,
            secondaryText : tag.dateo_count+' '+t('DATEOS'),
            type :'tag',
            leftImg : 'none',
            colorSample : tag.color,
            route : {
              queryParams : {q: '#'+tag.tag}
            }
          }))
        }]
      } else {
        return [];
      }
    }
  }

  searchValid = () => !!this.search.trim() && this.search.trim().length >=2;

  getAcIndexRoute(idx) {
    let opts = []
    this.acResults.forEach( section => {
      opts = opts.concat(section.items);
    });
    return opts[idx];
  }
}
