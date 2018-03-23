import './campaign-form.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {observer, inject, PropTypes as MobxPropTypes} from 'mobx-react';
import TextField from 'material-ui/TextField';
import { InputAdornment, InputLabel } from 'material-ui/Input';
import {MenuItem} from 'material-ui/Menu';
import { FormLabel, FormGroup, FormControlLabel, FormControl, FormHelperText } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import Switch from 'material-ui/Switch';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import ImageField from '../image-field';
import SubtagField from './subtag-field';
import DateaResizableMap from '../map';
import {t, Tr, translatable} from '../../i18n';

@inject('store')
@observer
export default class CampaignForm extends Component {

  state = {
    subtags : []
  };

  onSubTagsChange = (subtags) => {
    this.setState({subtags});
  }

  render() {
    const {store} = this.props;
    const {ui, router, campaignForm : form} = store;

    const isNew = router.params.id == 'new';

    return (
      <div className={cn('campaign-form', ui.isMobile && 'mobile')}>

        <h3 className="form-title">
          <Tr id={'CAMPAIGN_FORM.' + (isNew ? 'TITLE_CREATE' : 'TITLE_EDIT')} />
        </h3>

        {/* NAME */}
        <div className="field-row">
          <TextField value={form.campaign.get('name') || ''}
            onChange={ev => form.setField('name', ev.target.value)}
            label={<Tr id="CAMPAIGN_FORM.TITLE.LABEL" />}
            fullWidth={true}
            error={form.errors.has('name')}
            helperText={form.errors.get('name')}
            />
            {/*<Tr id="CAMPAIGN_FORM.TITLE.HELP_MSG" />*/}
        </div>

        {/* MAIN TAG */}
        <div className="field-row">
          <TextField value={form.getMainTag()}
            className="main-tag-field"
            fullWidth={true}
            onChange={ev => form.setMainTag(ev.target.value)}
            label={<Tr id="CAMPAIGN_FORM.MAINTAG.LABEL" />}
            error={form.errors.has('main_tag')}
            helperText={form.errors.get('main_tag')}
            InputProps={{
              startAdornment:
                !!form.getMainTag()
                ? <InputAdornment position="start">#</InputAdornment>
                : null
            }}
            />
            {/*<Tr id="CAMPAIGN_FORM.MAINTAG.HELP_MSG" />*/}
        </div>

        {/* PUBLISHED */}
        <div className="field-row field-row-published">
          <FormControlLabel
            control={
              <Switch
                checked={form.campaign.get('published') || false}
                onChange={() => form.setField('published', !form.campaign.get('published'))}
                color="primary"
              />
            }
            label={<Tr id="CAMPAIGN_FORM.PUBLISHED.LABEL" />}
          />
        </div>

        {/* CATEGORY */}
        <div className="field-row field-row-category field-select">
          <FormControl className="form-control" error={form.errors.has('category')}>
            <InputLabel htmlFor="age-simple"><Tr id="CAMPAIGN_FORM.CATEGORY.LABEL" /></InputLabel>
            <Select
              value={form.campaign.get('category') || ''}
              onChange={ev => form.campaign.set('category', ev.target.value)}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {(form.options.get('categories') || []).map(cat =>
                <MenuItem value={cat.id} key={`cat-${cat.id}`}>{cat.name}</MenuItem>
              )}
            </Select>
            {form.errors.has('category') && <FormHelperText>{form.errors.get('category')}</FormHelperText>}
          </FormControl>
        </div>

        {/* SUBTAG FIELD */}
        <div className="field-row field-row-subtags">
          <SubtagField
            subtags={form.campaign.get('subtags') || []}
            onChange={tags => form.setField('subtags', tags)} />
        </div>

        {/* SHORT DESCRIPTION */}
        <div className="field-row">
          <TextField value={form.campaign.get('short_description') || ''}
            onChange={ev => form.setField('short_description', ev.target.value)}
            label={<Tr id="CAMPAIGN_FORM.SHORT_DESC.LABEL" />}
            fullWidth={true}
            inputProps={{
              maxLength: 140
            }}
            multiline={true}
            rowsMax={4}
            error={form.errors.has('short_description')}
            helperText={form.errors.get('short_description')}
            />
            {/*<Tr id="CAMPAIGN_FORM.TITLE.HELP_MSG" />*/}
        </div>

        {/* MISSION */}
        <div className="field-row">
          <TextField value={form.campaign.get('mission') || ''}
            onChange={ev => form.setField('mission', ev.target.value)}
            label={<Tr id="CAMPAIGN_FORM.MISSION.LABEL" />}
            fullWidth={true}
            inputProps={{
              maxLength: 500
            }}
            multiline={true}
            rowsMax={4}
            error={form.errors.has('mission')}
            helperText={form.errors.get('mission')}
            />
            {/*<Tr id="CAMPAIGN_FORM.TITLE.HELP_MSG" />*/}
        </div>


        {/* INFORMATION DESTINY */}
        <div className="field-row">
          <TextField value={form.campaign.get('information_destiny') || ''}
            onChange={ev => form.setField('information_destiny', ev.target.value)}
            label={<Tr id="CAMPAIGN_FORM.DATA.LABEL" />}
            fullWidth={true}
            inputProps={{
              maxLength: 500
            }}
            multiline={true}
            rowsMax={4}
            error={form.errors.has('information_destiny')}
            helperText={form.errors.get('information_destiny')}
            />
            {/*<Tr id="CAMPAIGN_FORM.TITLE.HELP_MSG" />*/}
        </div>

        {/* CAMPAIGN IMG1 */}
        <div className="field-row field-row-image">
          <div className="field-label"><Tr id="CAMPAIGN_FORM.IMG_THUMB.LABEL" /></div>
          <ImageField
            onUploadSuccess={imgRes => form.setImage('image', imgRes)}
            src={form.getImage('image')}
            />
        </div>

        {/* CAMPAIGN IMG2 */}
        <div className="field-row field-row-image">
          <div className="field-label"><Tr id="CAMPAIGN_FORM.IMG_LARGE.LABEL" /></div>
          <ImageField
            onUploadSuccess={imgRes => form.setImage('image2', imgRes)}
            src={form.getImage('image2')}
            />
        </div>

        {/* MAP */}
        <div className="field-row field-row-map">
          <div className="field-label"><Tr id="CAMPAIGN_FORM.MAP.LABEL" /></div>
          <div className="map-container">
            <DateaResizableMap
              className="input-map"
              mapStore={form.map} />
          </div>
          <div className="field-help"><Tr id="CAMPAIGN_FORM.MAP.HELP_MSG" /></div>
        </div>

        {/* DEFAULT FILTERS */}
        <div className="field-row field-row-default-filters">
          <FormControl component="fieldset">
            <FormLabel component="legend"><Tr id="CAMPAIGN_FORM.FILTERS.LABEL" /></FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={form.campaign.get('default_filter')}
                    onChange={e => {form.setCheckbox('default_filter', e.target.checked, e.target.value)}}
                    value="owner"
                  />
                }
                label={<Tr id="CAMPAIGN_FORM.FILTERS.OPT1" />}
              />
            </FormGroup>
            <FormHelperText><Tr id="CAMPAIGN_FORM.FILTERS.HELP_MSG" /></FormHelperText>
          </FormControl>
        </div>

        <div className="field-row submit-button-row">
          <Button color="primary" variant="raised" onClick={() => form.save()}>
            <Tr id="SAVE" />
          </Button>
          {form.errors.has('main') &&
            <div className="main-error main-error-bottom">{form.errors.get('main')}</div>
          }
        </div>
      </div>
    )
  }


}
