import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux'
import thunkMiddleware from 'redux-thunk'

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import Board from './Board';
import reduce from './reducers/';
import { load, andSave, dropCard, assignBadge, updateTrackName, randomize, toggleLock } from './actions/';

const store = createStore(reduce, applyMiddleware(thunkMiddleware))

store.dispatch(load())

const ConnectedBoard = connect(
  state => {
    const s = state.toJS()
    const a = state.get("assignments").reduce( (r, cards, track) => {
      r[track] = cards.map( name => {
        return {
          name: name,
          photo: s["photos"][ name ],
          locked: s["locked"][ name ],
        }
      })
      return r
    }, {})

    return {
      assignments: a,
      badges: s[ "badges" ],
      tracks: s[ "tracks" ],
      trackNames: s[ "trackNames" ],
    }
  },
  dispatch => {
    return {
      onCardDropped: (card, track) => dispatch(andSave(dropCard(card, track))),
      onBadgeAssigned: (track, badge) => dispatch(andSave(assignBadge(badge, track))),
      onTrackNameChanged: (track, name) => dispatch(andSave(updateTrackName(track, name))),
      onToggleLock: (card) => dispatch(andSave(toggleLock(card))),
      randomize: () => dispatch(andSave(randomize())),
      onCardHovered: x => x,
    }
  }
)(Board)

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedBoard
          {...this.props}
        />
      </Provider>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
