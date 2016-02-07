import React, { Component } from 'react';

import Pair from './Pair';
import Radium from 'radium';

const rowStyle = {
  base: {
    borderBottom: "1px solid black",
    height: 130,
    width: "100%",
    position: "relative",
  },
  alternate: {
    background: "#eeeeee",
  },
}

const leftStyle = {
  width: 250,
}

const rightStyle = {
  position: "absolute",
  left: 280,
  width: 432,
  top: 20,
}

const inputStyle = {
  height: 80,
  width: "100%",
  fontSize: "x-large",
  border: 0,
  paddingLeft: 4,
  background: "none",
  //borderBottom: "1px solid #999",
}

class Row extends Component {
  render() {
    return (
      <div style={[
        rowStyle.base,
        this.props.alternate && rowStyle.alternate,
      ]}>
        <div style={leftStyle}>
        <Pair
          members={this.props.pair}
          onCardDropped={ (card, pos) => this.props.onCardDropped( card, this.props.track, pos ) }
          onCardHovered={ (card, pos) => this.props.onCardHovered( card, this.props.track, pos ) }
        />
        </div>
        <div style={rightStyle}>
          <input
            style={inputStyle}
            type="text"
            value={this.props.trackName}
            onChange={ (event) => this.props.onTrackNameChanged(this.props.track, event.target.value) }
          />
        </div>
      </div>
    )
  }
}

export default Radium(Row)
