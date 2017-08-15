import React, { Component } from 'react';

const linkStyle = {
  color: "blue",
  textDecoration: "underline",
  cursor: "pointer",
  textAlign: "center",
}

class Editor extends Component {
  constructor() {
    super();
    this.state = {}
  }

  render() {
    const rows = this.props.cards.map(card => (
      <tr>
        <td><input type="text" value={ card } onChange={x => x}></input></td>
        <td><input type="text" value={ this.props.slack[card] } onChange={x => x}></input></td>
        <td><input size="80" type="text" value={ this.props.photos[card] } onChange={x => x}></input></td>
        <td><button style={linkStyle} onClick={() => this.props.onRemove(card)}>Remove</button></td>
      </tr>
    ))

    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th>Slack Handle</th>
              <th>Picture</th>
            </tr>
            {rows}
            <tr>
              <td><input value={this.state.newName} onChange={(event) => this.setState({newName: event.target.value})} /></td>
              <td><input value={this.state.newHandle} onChange={(event) => this.setState({newHandle: event.target.value})} /></td>
              <td><input size="80" value={this.state.newPhoto} onChange={(event) => this.setState({newPhoto: event.target.value})} /></td>
              <td><button style={linkStyle} onClick={() => {
                this.props.onAdd(this.state.newName, this.state.newPhoto, this.state.newHandle);
                this.setState({"newName": ""});
                this.setState({"newHandle": ""});
                this.setState({"newPhoto": ""});
              }}>Add Card</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default Editor
