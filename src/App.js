import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import Board from './Board';
import Editor from './Editor';

import reduce from './reducers/';
import { load, andSave, dropCard, assignBadge, updateTrackName, randomize, randomizePlane,toggleLock, addCard, removeCard } from './actions/';
import { List } from 'immutable';
import { updateGroup } from './slack';


const store = createStore(reduce, applyMiddleware(thunkMiddleware))

store.dispatch(load())

function getCiTrack() {
  const badges = store.getState().get('badges')
  const tracks = badges.keys()

  for (var track of tracks) {
    if(badges.get(track).indexOf('gardenci') >= 0) {
      return track
    }
  }
  return "-1"
}

let currentCiTrack = getCiTrack()

store.subscribe(() => {
  const newCiTrack = getCiTrack()
  if (newCiTrack != currentCiTrack) {
    currentCiTrack = newCiTrack
    onCiTrackChanged(newCiTrack)
  }
})

function onCiTrackChanged(newCiTrack) {
    const state = store.getState()
    const assignments = state.get('assignments')
    const ciPair = assignments.get(newCiTrack)
    const ciPairSlackHandles = ciPair.map(name => state.get("slack").get(name))
    updateGroup('gardenci', ciPairSlackHandles, () => {
      console.log("slack group 'gardenci' updated to ", ciPairSlackHandles)
    })
}

const ConnectedBoard = connect(
  state => {
    const s = state.toJS()
    const a = state.get("assignments").reduce( (r, cards, track) => {
      r[track] = cards.map( name => {
        return {
          name: name,
          photo: s["photos"][ name ],
          slack: s["slack"][ name ],
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
      randomizePlane: () => dispatch(andSave(randomizePlane())),
      onCardHovered: x => x,
    }
  }
)(Board)

const ConnectedEditor = connect(
  state => {
    return {
      photos: state.get("photos").toJS(),
      cards: state.get("assignments").reduce((r, cards) => r.concat(cards), List()).sort().toJS(),
      slack: state.get("slack").toJS(),
    }
  },
  dispatch => {
    return {
      onAdd: (name, photo, handle) => dispatch(andSave(addCard(name, photo, handle))),
      onRemove: (name) => dispatch(andSave(removeCard(name))),
    }
  }
)(Editor)

export class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={browserHistory}>
           <Route path="/" component={ConnectedBoard}></Route>
           <Route path="/edit" component={ConnectedEditor}></Route>
        </Router>
      </Provider>
    );
  }
}

export default DragDropContext(HTML5Backend)(App);
