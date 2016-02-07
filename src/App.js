import React, { Component } from 'react';
import Board from './Board';

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

export class App extends Component {
  render() {
    return (
      <Board
        {...this.props}
      />
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
