import './follow.scss';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {inject} from 'mobx-react';
import CheckIcon from 'material-ui-icons/Check';
import IconButton from 'material-ui/IconButton';
import { CircularProgress } from 'material-ui/Progress';
import Api from '../../state/rest-api';
import DIcon from '../../icons';
import {Tr} from '../../i18n';


@inject('store')
export default class FollowButton extends Component {

  static propTypes = {
    followKey : PropTypes.string.isRequired,
    className : PropTypes.string,
    followLabel : PropTypes.string,
    followingLabel : PropTypes.string
  };

  static defaultProps = {
    followLabel : 'FOLLOW.FOLLOW',
    followingLabel : 'FOLLOW.FOLLOWING'
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      followObj : null,
      loading : true,
    }
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const {user} = this.props.store;
    if (user.isSignedIn) {
      Api.follow.getList({user: user.data.id, follow_key: this.props.followKey})
      .then(res => {
        this.setState({
          loading: false,
          followObj : res.objects.length ? res.objects[0] : null
        });
      })
      .catch(e => console.log(e));
    }
  }

  follow = enable => {
    const {user} = this.props.store;
    this.setState({loading: true});
    if (enable) {
      Api.follow.post({user: user.data.id, follow_key: this.props.followKey})
      .then(res => this.setState({followObj: res}))
      .catch(e => console.error(e))
      .finally(() => this.setState({loading: false}))
    } else {
      Api.follow.delete(this.state.followObj.id)
      .then( res => this.setState({followObj : null}))
      .catch( e => console.error(e))
      .finally(() => this.setState({loading: false}))
    }
  }

  toggleFollow = () => {
    const {user} = this.props.store;
    if (user.isSignedIn) {
      this.state.followObj ? this.follow(false) : this.follow(true);
    } else {
      this.props.store.router.goTo('login');
    }
  }

  render() {
    const {className, followLabel, followingLabel} = this.props;
    const {loading, followObj} = this.state;
    return (
      <IconButton onClick={this.toggleFollow} className={cn('follow-btn', className)}>
        {!!loading && <CircularProgress className="btn-progress" size={18} style={{ color: 'inherit'}}/>}
        {!loading && !!followObj && <CheckIcon className="btn-icon" />}
        {!loading && !followObj && <DIcon name="plus" />}
        <span className="btn-label">
          <Tr id={!!followObj ? followingLabel : followLabel} />
        </span>
      </IconButton>
    );
  }
}
