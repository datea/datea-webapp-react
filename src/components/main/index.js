import React, {Component} from 'react';
import MainLayout from '../main-layout';
import Slideshow from '../slideshow';

export default class Main extends Component {

  render() {
    return (
      <MainLayout>
        {this.props.children}
        <Slideshow/>
      </MainLayout>
    );
  }
}
