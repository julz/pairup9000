import React, { Component } from 'react';
import Radium from 'radium';
import { DropTarget } from 'react-dnd';

import Card, { width as cardWidth, height as cardHeight } from './Card';

const style = {
  width: "100%",
  height: 120,
  position: "relative",
  borderBottom: "1px solid #999",
  margin: 4,
}

const hoverHintStyle = {
  width: cardWidth,
  height: cardHeight,
  position: "absolute",
  background: "#ddd",
  border: "1px solid #ccc",
}

export class Pair extends Component {
  render() {
    const cards = this.props.members.map((m, i) => (
      <Card
        x={4 + (i * 85)}
        y={5}
        key={m.name}
        name={m.name}
        photo={m.photo}
        locked={m.locked}
        onDblClick={() => this.props.onToggleLock(m.name)}
      ></Card>
    ))

    let hoverHint = []
    if (this.props.hovered) {
      hoverHint = <div style={[
        hoverHintStyle,
        {
          left: this.props.members.length * 85 + 4,
          top: 10,
        }
      ]} />
    }

    return this.props.connectDropTarget((
      <div style={style}>
        {cards}
        {hoverHint}
      </div>
    ))
  }
}

export default DropTarget(["CARD"], {
  hover(props, monitor) {
    props.onCardHovered(monitor.getItem().name)
  },

  drop(props, monitor) {
    const offset = monitor.getClientOffset().x
    props.onCardDropped(monitor.getItem().name, Math.floor(offset / 75))
  }
}, (connect, monitor) => {
  return {
    "connectDropTarget": connect.dropTarget(),
    "hovered": monitor.isOver(),
  }
})(Radium(Pair));

