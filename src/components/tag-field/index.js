import 'react-select/dist/react-select.css';
import './tag-field.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {PropTypes as MobxPropTypes} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CancelIcon from '@material-ui/icons/Cancel';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ClearIcon from '@material-ui/icons/Clear';
import Chip from '@material-ui/core/Chip';
import debounce from 'debounce-promise';
import {AsyncCreatable} from 'react-select';
import removeAccents from 'remove-accents';
import {StripChar} from 'stripchar';
import Api from '../../state/rest-api';
import {t, translatable} from '../../i18n';

import styles from './mui-style';
import TagOption from './tag-option';


function SelectWrapped(props) {
  const { classes, ...other } = props;

  return (
    <AsyncCreatable
      optionComponent={TagOption}
      isValidNewOption={({label}) => {
        label = StripChar.RSspecChar(label);
        return !!label && label.length > 1;
      }}
      newOptionCreator={({label, labelKey, valueKey}) => {
        if (label.indexOf(t('CREATE_TAG')) != -1) {
          return {label, value: label}
        } else {
          const value = removeAccents(StripChar.RSspecChar(label));
          return {label: '#'+value, value};
        }
      }}
      promptTextCreator={ label => {
        return t('CREATE_TAG')+': #'+removeAccents(StripChar.RSspecChar(label))
      }}
      noResultsText={<Typography>{'No results found'}</Typography>}
      arrowRenderer={() => false}
      clearRenderer={() => <ClearIcon />}
      valueComponent={valueProps => {
        const { value, children, onRemove } = valueProps;

        const onDelete = event => {
          event.preventDefault();
          event.stopPropagation();
          onRemove(value);
        };

        if (onRemove) {
          return (
            <Chip
              tabIndex={-1}
              label={children}
              className={classes.chip}
              deleteIcon={<CancelIcon onTouchEnd={onDelete} />}
              onDelete={onDelete}
            />
          );
        }

        return <div className="Select-value">{children}</div>;
      }}
      {...other}
    />
  );
}

@translatable
class IntegrationReactSelect extends React.Component {

  static propTypes= {
    defaultSuggestions: MobxPropTypes.arrayOrObservableArray,
    onChange : PropTypes.func,
    tags : MobxPropTypes.arrayOrObservableArray,
    error : PropTypes.bool,
    helperText: PropTypes.node,
    multi: PropTypes.bool,
    label : PropTypes.node,
    placeholder : PropTypes.string
  };

  static defaultProps = {
    multi : true,
    error: false,
    tags : [],
    defaultSuggestions: []
  };

  state = {
    focused : false
  };

  processCurrentValue = (value) => {
    if (this.props.multi) {
      if (!value) return [];
      return value.map( tag => {
        tag = typeof tag == 'string' ? tag : tag.tag;
        return {label: '#'+tag, value: tag};
      })
    } else {
      const label = !!value ? '#'+value.replace('#') : '';
      return {label, value};
    }
  }

  _loadOptions = (search) => {
    if (!search) {
      const options = this.props.defaultSuggestions.map(t => ({label:'#'+t, value: t}));
      return Promise.resolve({options});
    }else{
      return Api.tag.autocomplete(search.replace('#', ''))
      .then(res => {
        let tags = res.suggestions || [];
        return {options: tags.map(tag => ({value: tag, label: `#${tag}`}))};
      });
    }
  }

  loadOptions = debounce(this._loadOptions, 500, {leading: true});

  handleChange = option => {
    if (this.props.multi) {
      const tags = option.map( opt => opt.value);
      !!this.props.onChange && this.props.onChange(tags);
    } else {
      let tag = !!option ? option.value : '';
      tag = StripChar.RSspecChar(tag.replace(/ /g, ''));
      !!this.props.onChange && this.props.onChange(tag);
    }
  };

  render() {
    const { classes, value, error, helperText, multi, label, placeholder} = this.props;
    const { focused } = this.state;
    const currentValue = this.processCurrentValue(value);
    const hasValue = !!currentValue && (multi ? !!currentValue.length : !!currentValue.value);

    return (
      <div className={classes.root}>
        <TextField
          fullWidth={true}
          error={error}
          helperText={helperText}
          label={label}
          placeholder={placeholder}
          InputProps={{
            inputComponent : SelectWrapped
          }}
          inputProps={{
            classes,
            value: currentValue,
            multi,
            onChange: this.handleChange,
            placeholder: t('TAGS_PLACEHOLDER'),
            instanceId: 'react-select-chip',
            id: 'react-select-chip',
            name: 'react-select-chip',
            loadOptions: this.loadOptions,
            onFocus: () => this.setState({focused: true}),
            onBlur : () => this.setState({focused: false}),
            clearable : hasValue,
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
