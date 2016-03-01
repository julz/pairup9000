import { combineReducers } from 'redux-immutable';
import Immutable from 'immutable'

const initialState = Immutable.fromJS({
  assignments: {
    "0": ["julz", "zhou"],
    "1": ["george", "alberto"],
    "2": ["georgi"],
    "out": ["will" ],
    "unassigned": ["ed", "petar"],
  },
  tracks: [
    "0", "1", "2", "3", "4",
  ],
  trackNames: {
    "0": "Track One",
    "1": "Track Two",
    "2": "Track Three",
  },
  badges: {
    "1": [ "CI" ],
  },
  photos: {
    "julz": "https://avatars2.githubusercontent.com/u/354013?v=3&s=72",
    "svett":"https://avatars1.githubusercontent.com/u/703323?s=72" ,
    "zhou": "https://avatars3.githubusercontent.com/u/4571626?v=3&s=72",
    "georgi": "https://avatars1.githubusercontent.com/u/9860469?v=3&s=72",
    "gareth": "https://avatars3.githubusercontent.com/u/918129?v=3&s=72",
    "george": "https://avatars1.githubusercontent.com/u/1753414?v=3&s=72",
    "will": "https://avatars3.githubusercontent.com/u/1255755?v=3&s=72",
    "alberto": "https://avatars1.githubusercontent.com/u/15064?v=3&s=72",
    "ed": "https://avatars3.githubusercontent.com/u/6475144?v=3&s=72",
    "petar": "http://www.publicdomainpictures.net/pictures/80000/nahled/a-pair-of-pears.jpg",
  },
  locked: { "julz": true },
  version: 0,
})

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
