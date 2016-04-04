import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

import Radium from 'radium'

export const width = 77;
export const height = 101;

const styles = {
  base: {
    width: width,
    height: height,
    border: "1px solid rgba(0,0,0,0.9)",
    margin: 4,
    boxShadow: "0px 2px 2px rgba(0,0,0,0.2)",
    background: "white",
    position: "absolute",
    transition: "all 0.4s cubic-bezier(0.190, 1.000, 0.220, 1.000) 0.1s",
    textAlign: "center",
    transform: "rotate(-0.5deg)",
  },
  locked: {
    background: "#fed",
    border: "1px solid orange",
  },
  dragging: {
    opacity: 0,
  }
}

const labelStyle = {
  width: "100%",
  position: "absolute",
  bottom: 5,
  left: 0,
  textAlign: "center",
  fontSize: "smaller",
  color: "blue",
}

const photoStyle = {
  position: "absolute",
  left: 5,
  top: 5,
  width: 68,
  height: 70,
  backgroundPosition: "-5px -5px",
}

export class Card extends Component {
  render() {
    return this.props.connectDragSource(
      <div onDoubleClick={ this.props.onDblClick } style={[
        styles.base,
        this.props.isDragging && styles.dragging,
        this.props.locked && styles.locked,
        { left: this.props.x, top: this.props.y }
      ]}>
      <div style={[
        photoStyle,
        { backgroundImage: "url("+this.props.photo+")" },
      ]} />
        <div style={labelStyle}>{this.props.name}</div>
      </div>
    )
  }
}

const cardSource = {
  beginDrag(props, monitor, component) {
    const item = { name: props.name };
    return item;
  },
}

export default DragSource("CARD", cardSource, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
})(Radium(Card));

