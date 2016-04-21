import React, { Component } from 'react';

import Row from './Row';
import Pair from './Pair';

const width = 750

const boardStyle = {
  borderRadius: 8,
}

const headerStyle = {
  textAlign: "center",
  padding: 0,
  margin: 0,
  height: 100,
}

const mainStyle = {
  position: "relative",
  width: width,
  padding: 30,
}

const leftHeaderStyle = {
  textAlign: "center",
  width: 200,
  color: "white",
  position: "absolute",
  top: 0,
}

const rightHeaderStyle = {
  textAlign: "center",
  position: "absolute",
  left: 200,
  top: 0,
  width: 400,
  color: "white",
}

const sidebarHeaderStyle = {
  borderBottom: "1px solid white",
  color: "white",
}

const sidebarStyle = {
  position: "fixed",
  paddingTop: 140,
  right: 0,
  top: 0,
  width: "35%",
  height: "100%",
  textAlign: "center",
  background: "#FFA73D",
}

const parkingLotItemStyle = {
  listStyleType: "none",
}

const parkingLotInputStyle = {
  width: "100%",
}

const randomizeStyle = {
  color: "white",
  textAlign: "center",
  width: "100%",
}

export default class Board extends Component {
  render() {
    const rows = this.props.tracks.map((t, i) => (
       <Row
         key={i}
         track={t}
         trackName={this.props.trackNames[t]}
         badges={this.props.badges[t]}
         pair={this.props.assignments[t] || []}
         onCardDropped={this.props.onCardDropped}
         onCardHovered={this.props.onCardHovered}
         onTrackNameChanged={this.props.onTrackNameChanged}
         onBadgeAssigned={this.props.onBadgeAssigned}
         onToggleLock={this.props.onToggleLock}
         alternate={ i % 2 != 0 }
       >
      </Row>
    ))

    return (
      <div style={{padding: 0, margin: 0}}>
        <div style={headerStyle}>
        </div>
        <div style={mainStyle}>
          <div style={leftHeaderStyle}>Pairs</div>
          <div style={rightHeaderStyle}>Tracks</div>
          <div style={boardStyle}>
            {rows}
          </div>
          <div style={sidebarStyle}>
            <br />
            <span style={sidebarHeaderStyle}>Unassigned</span>
            <Pair
              members={ this.props.assignments["unassigned"] || [] }
              onCardDropped={ (card) => this.props.onCardDropped(card, "unassigned") }
              onCardHovered={ (card) => this.props.onCardHovered(card, "unassigned") }
              onToggleLock={ x => x }
            />
            <br />
            <span style={sidebarHeaderStyle}>Out</span>
            <Pair
              members={ this.props.assignments["out"] || [] }
              onCardDropped={ (card) => this.props.onCardDropped(card, "out") }
              onCardHovered={ (card) => this.props.onCardHovered(card, "out") }
              onToggleLock={ x => x }
            />
            <br />
            <span style={sidebarHeaderStyle}>PMing</span>
            <Pair
              members={ this.props.assignments["pm"] || [] }
              onCardDropped={ (card) => this.props.onCardDropped(card, "pm") }
              onCardHovered={ (card) => this.props.onCardHovered(card, "pm") }
              onToggleLock={ x => x }
            />
          </div>
          <div style={randomizeStyle} className="fa fa-random">&nbsp;Randomize: <span style={{cursor: "pointer", textDecoration: "underline"}} onClick={ this.props.randomizePlane }>CI Pair</span>&nbsp;|&nbsp;<span style={{cursor: "pointer", textDecoration:"underline"}} onClick={ this.props.randomize }>All Pairs</span> <span style={{color: "white"}}>(Double-Click a Pair to Lock)</span></div>
        </div>
      </div>
    );
  }
}
