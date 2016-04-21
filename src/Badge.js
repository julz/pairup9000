import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

const badgeStyle = {
  borderRadius: 88,
  width: 36,
  height: 36,
  zIndex: 99,
  position: "absolute",
  top: 30,
  left: 210,
  boxShadow: "0px 0px 0px 1px black, 0px 0px 2px 2px rgba(0,0,0,0.2)",
  border: "solid #ffffff 4px",
  color: "#fff",
  textShadow: "0px 0px 2px black",
  textAlign: "center",
  background: "#8EFF19",
  fontSize: "x-large",
}

const labelStyle = {
  fontSize: "x-small",
  position: "absolute",
  bottom: -20,
  left: 0,
  width: "100%",
  textAlign: "center",
  color: "black",
  textShadow: "none",
  background: "white",
}

class Badge extends Component {
  render() {
    return this.props.connectDragSource(<div style={badgeStyle}><span className="fa fa-plane">&#9992;</span><div style={labelStyle}>CI Pair</div></div>)
  }
}

export default DragSource("BADGE", {
  beginDrag: (props, monitor, component) => {
    return { name: props.name }
  }
}, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
})(Badge);

