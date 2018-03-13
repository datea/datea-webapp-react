import 'react-select/dist/react-select.css';
import './tag-field.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {PropTypes as MobxPropTypes} from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Input from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import ArrowDropDownIcon from 'material-ui-icons/ArrowDropDown';
import CancelIcon from 'material-ui-icons/Cancel';
import ArrowDropUpIcon from 'material-ui-icons/ArrowDropUp';
import ClearIcon from 'material-ui-icons/Clear';
import Chip from 'material-ui/Chip';
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
    tags : MobxPropTypes.arrayOrObservableArray
  };

  static defaultProps = {
    tags : [],
    defaultSuggestions: []
  };

  state = {
    focused : false
  };

  getTagsFromResources = (tags) => {
    return tags.map( tag => {
      tag = typeof tag == 'string' ? tag : tag.tag;
      return {label: '#'+tag, value: tag};
    })
  }

  loadOptions = (search) => {
    if (!search) {
      const options = this.props.defaultSuggestions.map(t => ({label:'#'+t, value: t}));
      return Promise.resolve({options});
    }else{
      return Api.tag.autocomplete(search)
      .then(res => {
        let tags = res.suggestions || [];
        return {options: tags.map(tag => ({value: tag, label: `#${tag}`}))};
      });
    }
  }

  handleChange = selectedOptions => {
    const tags = selectedOptions.map( opt => opt.value);
    !!this.props.onChange && this.props.onChange(tags);
  };

  render() {
    const { classes, tags } = this.props;
    const { focused } = this.state;
    const currentOptions = this.getTagsFromResources(tags);

    return (
      <div className={classes.root}>
        <Input
          fullWidth={true}
          inputComponent={SelectWrapped}
          inputProps={{
            classes,
            value: currentOptions,
            multi: true,
            onChange: this.handleChange,
            placeholder: t('TAGS_PLACEHOLDER'),
            instanceId: 'react-select-chip',
            id: 'react-select-chip',
            name: 'react-select-chip',
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
