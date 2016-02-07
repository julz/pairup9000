import React from 'react';
import ReactDOM from 'react-dom';
import { renderIntoDocument, scryRenderedDOMComponentsWithTag, scryRenderedComponentsWithType } from 'react-addons-test-utils';

import { wrapInTestDNDContext } from './dndutils';

import Card from '../Card';

describe("Card", function () {
  let renderedCard

  const findByType = (type) => scryRenderedComponentsWithType(renderedCard, type)
  const WrappedCard = wrapInTestDNDContext(Card)

  describe("by default", function() {
    beforeEach(function() {
      renderedCard = renderIntoDocument((
        <WrappedCard x={12} y={5} />
      ))
    })

    it("does not set opacity", function() {
      expect(ReactDOM.findDOMNode(renderedCard).style.opacity).not.toEqual("0")
    })

    it("sets the x and y position", function() {
      expect(ReactDOM.findDOMNode(renderedCard).style.left).toEqual("12px")
      expect(ReactDOM.findDOMNode(renderedCard).style.top).toEqual("5px")
    })
  })

  describe("when dragging", function() {
    beforeEach(function() {
      const dragging = true
      renderedCard = renderIntoDocument((
        <WrappedCard foo={dragging} />
      ))
    })

    it("makes the opacity 0 when the card is dragging", function() {
      const backend = renderedCard.getManager().getBackend()
      backend.simulateBeginDrag([findByType(Card)[0].getHandlerId()])

      expect(ReactDOM.findDOMNode(renderedCard).style.opacity).toEqual("0")
    })
  })
})
