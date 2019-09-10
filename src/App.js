import React from 'react';
import './App.css';
import math from 'mathjs/dist/math.js'

function App() {
  return (
    <div className="App">
      <Game></Game>
    </div>
  );
}

class SquareItem extends React.Component{
  render(){
    return <div className='cel'></div>
  }
}
class Board extends React.Component{
  render(){
    const boardMatrix = this.props.boardMatrix
    const squareItems = boardMatrix.valueOf().map((row,rowIndex)=>{
      return row.map((col,colIndex)=>{
        return (
          <SquareItem></SquareItem>
        )
      })
    })
    return (
      <div className='board'>{squareItems}</div>
    )
  }
}
class PieceItem extends React.Component{
  render(){
    const pieceData = this.props.pieceData;
    const pieces = pieceData.map((row)=>{
      return row.map(col=>{
        return <div className={col?'cel blue':'cel'}></div>
      })
    })
    return <div class='piece'>{pieces}</div>
  }
}
class PlayerItem extends React.Component{
  render(){
    const pieces = this.props.pieces;
    const pieceItems = pieces.map((pieceData,pieceIndex)=>{
      return(
        <PieceItem pieceData={pieceData} key={pieceIndex}></PieceItem>
      )
    })

    return (
      <div className='player player1'>
        {pieceItems}
      </div>
    )
  }
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      boardMatrix:math.zeros(20,20),
      players:[{
        pieces:pieces,
      }],
    }
  }

  componentDidMount(){
  }

  addPlayer(){
    const player = {
      pieces:pieces
    }
    this.setState({
      players:[...this.state.players,player]
    })
  }
  render(){
    const players = this.state.players;
    const playerItems = players.map((player,playerIndex)=>{
      const pieces = player.pieces;
      return (
        <PlayerItem pieces={pieces}></PlayerItem>
      )
    })
    return (
      <div className='square'>
        {playerItems}
        <Board boardMatrix={this.state.boardMatrix}></Board>
      </div>
    )
  }
}
const pieces = [
  [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0]
  ],
  [
      [0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 1, 0],
      [0, 0, 0, 0, 0]
  ]
]

export default App;
