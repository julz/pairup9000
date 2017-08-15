import { combineReducers } from 'redux-immutable';
import Immutable from 'immutable';

import { defaultState } from './defaults';

const initialState = Immutable.fromJS(defaultState);

function assignments(state = Immutable.Map({}), action) {
  if (action.type == "ADD_CARD") {
    return drop(state, action.name, "unassigned")
  }

  if (action.type == "REMOVE_CARD") {
    return drop(state, action.name, "removed").set("removed", Immutable.List())
  }

  if (action.type == "DROP_CARD") {
    return drop(state, action.card, action.target)
  }

  return state
}

function badges(state = Immutable.Map(), action) {
  if (action.type != "DROP_BADGE") {
    return state
  }

  return drop(state, action.badge, action.target)
}

function drop(state = Immutable.Map(), item, target) {
  const ensureRowExists = Immutable.Map().set(target, Immutable.List()).merge(state)
  const removeExisting = (v) => v.filter( i => i != item )

  return ensureRowExists.map(removeExisting).updateIn([target], l => l.concat(item))
}

function tracks(state = Immutable.List(), action) {
  return state
}

function trackNames(state = Immutable.Map(), action) {
  return (action.type == "UPDATE_TRACK")
    ? state.set(action.track, action.name)
    : state
}

function photos(state = Immutable.Map(), action) {
  if (action.type == "ADD_CARD") {
    return state.set(action.name, action.photo)
  }

  return state
}

function slack(state = Immutable.Map(), action) {
  if (action.type == "ADD_CARD") {
    return state.set(action.name, action.slack)
  }

  return state
}
function locked(state = Immutable.Map(), action) {
  return (action.type == "TOGGLE_LOCK")
    ? state.set(action.card, !state.get(action.card))
    : state
}

function version(state = 0, action) {
  return state
}

const reduce = combineReducers({
  assignments: assignments,
  badges: badges,
  tracks: tracks,
  trackNames: trackNames,
  photos: photos,
  slack: slack,
  locked: locked,
  version: version,
})

export default function(state = initialState, action) {
  if (action.type == "REPLACE_STATE") {
    return action.state["version"] > state.get("version")
            ? Immutable.fromJS(action.state) : state
  }

  return reduce(state, action).set("version", state.get("version") + 1)
}
