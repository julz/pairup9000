import React from 'react';
import ReactDOM from 'react-dom';
import { Simulate, renderIntoDocument, scryRenderedDOMComponentsWithTag, scryRenderedComponentsWithType } from 'react-addons-test-utils';
import { findAllWithType } from 'react-shallow-testutils';

import { wrapInTestDNDContext } from './dndutils';

import Row from '../Row';
import Badge from '../Badge';
import Pair from '../Pair';

describe("Row", function () {
  let renderedRow

  const findByType = (type) => scryRenderedComponentsWithType(renderedRow, type)
  const findByTag = (tag) => scryRenderedDOMComponentsWithTag(renderedRow, tag)

  let lastDrop
  const onCardDropped = (card, track, pos) => { lastDrop = { card: card, track: track, pos: pos } }

  let lastHovered
  const onCardHovered = (card, track, pos) => { lastHovered = { card: card, track: track, pos: pos } }

  let lastTrackNameChange
  const onTrackNameChanged = (id, name) => { lastTrackNameChange = { id: id, name: name } }

  let badgeAssigned
  const onBadgeAssigned = (track, badge) => { badgeAssigned = { track: track, badge: badge } }

  const WrappedRow = wrapInTestDNDContext(Row)

  beforeEach(function() {
    renderedRow = renderIntoDocument((
      <WrappedRow
        track="potato"
        pair={["zhou", "julz", "gareth"]}
        badges={["somebadge"]}
        onCardDropped={onCardDropped}
        onCardHovered={onCardHovered}
        onTrackNameChanged={onTrackNameChanged}
        onBadgeAssigned={onBadgeAssigned}
      />
    ))
  })

  it("contains a Pair with the assigned cards", function() {
    expect(findByType(Pair)[0].props.members).toEqual(["zhou", "julz", "gareth"])
  })

  it("drawns a CI badge if the row is assigned the CI pair", function() {
    expect(findByType(Badge).length).toEqual(1)

    renderedRow = renderIntoDocument((
      <WrappedRow
        track="potato"
        pair={["zhou", "julz", "gareth"]}
        onCardDropped={onCardDropped}
        onCardHovered={onCardHovered}
        onTrackNameChanged={onTrackNameChanged}
      />
    ))

    expect(findByType(Badge).length).toEqual(0)
  })

  it("gives Pair an onCardDropped method that adds the track name when called", function() {
    const p = findByType(Pair)[0]
    p.props.onCardDropped("some-card", 77)
    expect(lastDrop.card).toEqual("some-card")
    expect(lastDrop.track).toEqual("potato")
    expect(lastDrop.pos).toEqual(77)
  })

  it("gives Pair an onCardHovered method that adds the track name when called", function() {
    const p = findByType(Pair)[0]
    p.props.onCardHovered("some-card", 66)
    expect(lastHovered.card).toEqual("some-card")
    expect(lastHovered.track).toEqual("potato")
    expect(lastHovered.pos).toEqual(66)
  })

  it("fires onTrackNameChanged with track id and new name when track name changed", function() {
    const input = findByTag("input")[0]
    Simulate.change(input, { target: { value: "foo" } })
    expect(lastTrackNameChange.id).toEqual("potato")
    expect(lastTrackNameChange.name).toEqual("foo")
  })

  describe("dropping badges", function() {
    it("calls onBadgeAssigned with the track and badge when a badge is dropped", function() {
      const backend = renderedRow.getManager().getBackend()
      const badge = findByType(Badge)[0]

      backend.simulateBeginDrag([badge.getHandlerId()])
      backend.simulateHover([findByType(Row)[0].getHandlerId()])
      backend.simulateDrop()
      backend.simulateEndDrag()

      expect(badgeAssigned.track).toEqual("potato")
      expect(badgeAssigned.badge).toEqual("somebadge")
    })
  })
})
