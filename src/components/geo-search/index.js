import 'react-select/dist/react-select.css';
import './geo-search.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import debounce from 'debounce-promise';
import {inject, PropTypes as MobxPropTypes} from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Input, {InputAdornment} from 'material-ui/Input';
import SearchIcon from 'material-ui-icons/Search';
import { MenuItem } from 'material-ui/Menu';
import ClearIcon from 'material-ui-icons/Clear';
import {AsyncCreatable} from 'react-select';
import Api from '../../state/rest-api';
import {t, translatable} from '../../i18n';


import styles from './mui-style';
import AddressOption from './address-option';

function SelectWrapped(props) {
  const { classes, ...other } = props;

  return (
    <AsyncCreatable
      autoload={false}
      optionComponent={AddressOption}
      noResultsText={<Typography>{t('NO_RESULTS')}</Typography>}
      arrowRenderer={() => false}
      clearRenderer={() => <ClearIcon />}
      isLoading={true}
      searchPromptText={false}
      isValidNewOption={({label}) => {
        return !!label && label.trim().length > 2;
      }}
      newOptionCreator={({label, labelKey, valueKey}) => {
          return {label, value: 'custom'}
      }}
      promptTextCreator={ label => {
        return t('CREATE_ADDRESS')+': '+label
      }}
      {...other}
    />
  );
}

@inject('store')
@translatable
class IntegrationReactSelect extends React.Component {

  static propTypes= {
    address : PropTypes.string,
    onSelect : PropTypes.func,
    className : PropTypes.string
  };

  state = {
    isLoading : false,
    focused : false,
    search : null,
  };

  constructor(props, context) {
    super(props, context);
    if (props.address) {
      this.state.search = {label: props.address, value: 'reverse_geocoded'};
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.address != this.props.address && (!this.state.search || nextProps.address != this.state.search.label)) {
      this.setState({search: {label: nextProps.address, value: 'reverse_geocoded'}});
    }
  }

  _loadOptions = (search) => {
    if (!!search && search.trim() && search.trim().length > 3 ) {
      return Api.autocompletePlace(search, this.props.store.user.location)
      .then(data => {
        return {options: data.result.map(res => ({
                  value: res.placeid,
                  label: res.description,
                }))};
      })
      .catch(e => console.log('ERROR', e));
    }else {
      return Promise.resolve({options: []});
    }
  }

  loadOptions = debounce(this._loadOptions, 500, {leading: true});

  handleChange = search => {
    this.setState({search, isLoading: true});
    if (search) {
      if (search.value == 'custom') {
        !!this.props.onSelect && this.props.onSelect({formatted_address: search.label});
      }else{
        Api.placeDetail(search.value)
        .then( place => {
          this.setState({isLoading: false});
          !!this.props.onSelect && this.props.onSelect(place);
        })
      }
    }
  };

  render() {
    const { classes, className} = this.props;
    const { focused, search } = this.state;

    return (
      <div className={cn(classes.root, className)}>
        <Input
          fullWidth={true}
          inputComponent={SelectWrapped}
          startAdornment={
            <InputAdornment className="search-adornment" position="start">
              <SearchIcon />
            </InputAdornment>
          }
          inputProps={{
            className: cn('search-input', focused && 'focused'),
            classes,
            value: search,
            multi: false,
            onChange: this.handleChange,
            placeholder: t('ADDRESS_PLACEHOLDER'),
            instanceId: 'react-select-normal',
            id: 'react-select-normal',
            name: 'react-select-normal',
            isLoading: true,
            loadOptions: this.loadOptions,
            onFocus: () => this.setState({focused: true}),
            onBlur : () => this.setState({focused: false}),
            clearable : true,
            trimFilter : true
          }}
        />
      </div>
    );
  }
}

IntegrationReactSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(IntegrationReactSelect);
