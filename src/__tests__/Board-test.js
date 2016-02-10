import React from 'react';
import ReactDOM from 'react-dom';
import { renderIntoDocument, scryRenderedDOMComponentsWithTag, scryRenderedComponentsWithType } from 'react-addons-test-utils';
import { findAllWithType } from 'react-shallow-testutils';

import { wrapInTestDNDContext } from './dndutils';

import Board  from '../Board';
import Row from '../Row';

describe("Board", function () {
  let renderedBoard

  const findByType = (type) => scryRenderedComponentsWithType(renderedBoard, type)
  const findByTag = (tag) => scryRenderedDOMComponentsWithTag(renderedBoard, tag)

  const assignments = {
    "track1": ["personA", "personB"],
    "track2": ["personC"],
  }

  const onCardDropped = x => x
  const onCardHovered = x => x

  describe("with an empty board", function() {
    beforeEach(function() {
      const WrappedBoard = wrapInTestDNDContext(Board)
      renderedBoard = renderIntoDocument((
        <WrappedBoard
          tracks={[]}
          assignments={assignments}
          onCardDropped={onCardDropped}
          onCardHovered={onCardHovered}
        />
      ))
    })

    it("it has no rows", function() {
      expect(findByTag("tr").length).toEqual(0)
    })
  })

  describe("with some tracks", function() {
    const tracks = [ "track1", "track2", "track3" ]
    const trackNames = { "track1": "abc", "track2": "def", "track3": "ghj" }
    const badges = { "track1": [ "badge1", "badge2" ], "track3": [ "badge3" ] }

    beforeEach(function() {
      const WrappedBoard = wrapInTestDNDContext(Board)
      renderedBoard = renderIntoDocument((
        <WrappedBoard
          tracks={tracks}
          trackNames={trackNames}
          badges={badges}
          assignments={assignments}
          onCardDropped={onCardDropped}
          onCardHovered={onCardHovered}
        />
      ))
    })

    it("has one row per track", function() {
      expect(findByType(Row).length).toEqual(3)
    })

    it("gives each row the correct track", function() {
      expect(findByType(Row).map(r => r.props.track)).toEqual(["track1", "track2", "track3"])
    })

    it("gives each row the correct track name", function() {
      expect(findByType(Row).map(r => r.props.trackName)).toEqual(["abc", "def", "ghj"])
    })

    it("gives each row the correct badges", function() {
      expect(findByType(Row).map(r => r.props.badges)).toEqual([["badge1", "badge2"], undefined, ["badge3"]])
    })

    it("gives each row the correct set of pairs", function() {
      expect(findByType(Row).map(r => r.props.pair)).toEqual([
        ['personA', 'personB'],
        ['personC'],
        [],
      ])
    })

    it("gives each row the handlers", function() {
      findByType(Row).forEach(r => {
        expect(r.props.onCardDropped).toEqual(onCardDropped)
        expect(r.props.onCardHovered).toEqual(onCardHovered)
      })
    })
  })
})
