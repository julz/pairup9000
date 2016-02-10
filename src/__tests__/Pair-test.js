import React from 'react';
import ReactDOM from 'react-dom';
import { renderIntoDocument, scryRenderedDOMComponentsWithTag, scryRenderedComponentsWithType } from 'react-addons-test-utils';
import { findAllWithType } from 'react-shallow-testutils';

import { wrapInTestDNDContext } from './dndutils';

import Pair from '../Pair';
import Card from '../Card';

describe("Pair", function () {
  let renderedPair
  let dropCalledWith, hoverCalledWith

  const findByType = (type) => scryRenderedComponentsWithType(renderedPair, type)
  const findByTag = (tag) => scryRenderedDOMComponentsWithTag(renderedPair, tag)

  const WrappedPair = wrapInTestDNDContext(Pair)

  beforeEach(function() {
    dropCalledWith = {}
    const onCardDropped = function(card, pos) {
      dropCalledWith = { card: card, position: pos }
    }

    hoverCalledWith = null
    const onCardHovered = function(card) {
      hoverCalledWith = card
    }

    renderedPair = renderIntoDocument((
      <WrappedPair
        connectDropTarget={x => x}
        onCardDropped={onCardDropped}
        onCardHovered={onCardHovered}
        members={[
          {name: "julz", photo: "some-url"},
          {name: "zhou"},
          {name: "gareth"}
        ]} />
    ))
  })

  it("contains a card for each existing card", function() {
    expect(findByType(Card).map(c => c.props.name)).toEqual(["julz", "zhou", "gareth"])
    expect(findByType(Card).map(c => c.props.photo)).toEqual(["some-url", undefined, undefined])
  })

  it("responds to a card being hovered by calling the onCardHovered callback", function() {
    const backend = renderedPair.getManager().getBackend()
    const firstCard = findByType(Card)[0]

    backend.simulateBeginDrag([firstCard.getHandlerId()])
    backend.simulateHover([findByType(Pair)[0].getHandlerId()])
    backend.simulateEndDrag()

    expect(hoverCalledWith).toEqual("julz")
  })

  it("draws an extra drop target when hovered over", function() {
    const backend = renderedPair.getManager().getBackend()
    const firstCard = findByType(Card)[0]

    backend.simulateBeginDrag([firstCard.getHandlerId()])
    expect(findByTag("div")[0].childNodes.length).toEqual(3)

    backend.simulateHover([findByType(Pair)[0].getHandlerId()])

    expect(findByTag("div")[0].childNodes.length).toEqual(4)
    expect(findByTag("div")[0].childNodes[3].style.left).toEqual("259px")
    backend.simulateEndDrag()
  })

  describe("layout", function() {
    it("positions each pair correctly", function() {
      expect(findByType(Card).map(p => p.props.x)).toEqual([4, 89, 174])
      expect(findByType(Card).map(p => p.props.y)).toEqual([5, 5, 5])
    })
  })

  describe("drop", function() {
    const drop = function(offsetX) {
      const backend = renderedPair.getManager().getBackend()
      const firstCard = findByType(Card)[0]

      backend.simulateBeginDrag([firstCard.getHandlerId()])

      backend.simulateHover([findByType(Pair)[0].getHandlerId()], {
        clientOffset: { x: offsetX, y: 0 },
        getSourceClientOffset: () => { return { x: offsetX, y: 0 } }
      })

      backend.simulateDrop()
      backend.simulateEndDrag()
    }

    it("responds to a card being dropped by calling the onCardDropped callback", function() {
      drop(0)
      expect(dropCalledWith.card).toEqual("julz")
    })

    it("passes position as 0 when the offset is less than the center of the first card", function() {
      drop(74)
      expect(dropCalledWith.position).toEqual(0)
    })

    it("passes position as 1 when the offset is greater than the center of the first card", function() {
      drop(75)
      expect(dropCalledWith.position).toEqual(1)
    })

    it("passes position as 6 when the offset is greater than the center of the fifth card", function() {
      drop(75 * 5)
      expect(dropCalledWith.position).toEqual(5)
    })
  })
})
