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

class SquareItem extends React.Component {
  render() {
    return <div className='cel'></div>
  }
}
class Board extends React.Component {
  render() {
    const boardMatrix = this.props.boardMatrix
    const squareItems = boardMatrix.valueOf().map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        return (
          <SquareItem key={rowIndex*5+colIndex}></SquareItem>
        )
      })
    })
    return (
      <div className='board'>{squareItems}</div>
    )
  }
}
class PieceItem extends React.Component {
  render() {
    const piece = this.props.piece;
    const isSelected = this.props.isSelected;
    if (isSelected) {
      //选中时 添加反转和旋转
      const pieces = piece.pieceData.map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          if (rowIndex === 0 && colIndex === 0) {
            return <div className='cel' onClick={this.props.rotatePiece} key={rowIndex*5+colIndex}>转</div>
          }
          if (rowIndex === 0 && colIndex === 4) {
            return <div className='cel' onClick={this.props.mirrorPiece} key={rowIndex*5+colIndex}>翻</div>
          }
          return <div className={col?`cel ${piece.pieceClass}`:'cel'} key={rowIndex*5+colIndex}></div>
        })
      })
      return <div className={`piece selected_${piece.playerIndex}`}>{pieces}</div>
    } else {
      const pieces = piece.pieceData.map((row, rowIndex) => {
        return row.map((col, colIndex) => {
          return <div className={col?`cel ${piece.pieceClass}`:'cel'} key={rowIndex*5+colIndex}></div>
        })
      })
      return <div className='piece' onClick={this.props.selectPiece}>{pieces}</div>
    }
  }
}
class PlayerItem extends React.Component {
  render() {
    const player = this.props.player;
    const pieceItems = player.pieces.map((piece, pieceIndex) => {
      return (
        <PieceItem 
        piece={piece} 
        selectPiece={(e)=>{this.props.selectPiece(piece,e)}} 
        key={pieceIndex}>
        </PieceItem>
      )
    })

    return (
      <div className={`player player_${player.index}`}>
        {pieceItems}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardMatrix: math.zeros(20, 20),
      players: ['red', 'yellow', 'blue', 'green'].map((color, index) => {
        let id = Math.random().toFixed(5)*100000+1; // TODO 
        return {
          index,
          id,
          pieces: PIECESDATA.map(pieceData => {
            return {
              playerIndex: index,
              playerId: id,
              pieceClass: color,
              pieceData: pieceData
            }
          }),
        }
      }),
      selectedPiece: null,
    }
  }

  selectPiece = (piece) => {
    this.setState({
      selectedPiece: piece
    })
  }

  rotatePiece = (piece) => {
    const rotation = math.pi / 2;
    const C = math.cos(rotation).toFixed();
    const S = math.sin(rotation).toFixed();
    const originPiece = this.state.selectedPiece;
    let rotatedPiece = Object.assign({},originPiece,{
      pieceData: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
    });
    originPiece.pieceData.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col) {
          let [
            [x],
            [y],
            // eslint-disable-next-line
            [z]
          ] = math.multiply([
            [C, -S, (1 - C) * 2 + S * 2],
            [S, C, (1 - C) * 2 - S * 2],
            [0, 0, 1]
          ], [
            [rowIndex],
            [colIndex],
            [1]
          ])
          rotatedPiece.pieceData[x][y] = originPiece.playerId
        }
      })
    })
    this.setState({
      selectedPiece: rotatedPiece
    })
  }

  mirrorPiece = (piece) => {
    const originPiece = this.state.selectedPiece;
    let rotatedPiece = Object.assign({},originPiece,{
      pieceData: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
    });
    originPiece.pieceData.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col) {
          let x = 4-rowIndex;
          let y = colIndex;
          rotatedPiece.pieceData[x][y] = originPiece.playerId
        }
      })
    })
    this.setState({
      selectedPiece: rotatedPiece
    })
  }

  render() {
    const players = this.state.players;
    const selectedPiece = this.state.selectedPiece;
    const boardMatrix = this.state.boardMatrix;
    const playerItems = players.map(player => {
      return (
        <PlayerItem player={player} selectPiece={this.selectPiece} key={player.id}></PlayerItem>
      )
    })
    return (
      <div className='square'>
        {playerItems}
        {selectedPiece && <PieceItem piece={selectedPiece} isSelected={true} rotatePiece={this.rotatePiece} mirrorPiece={this.mirrorPiece}></PieceItem>}
        <Board boardMatrix={boardMatrix}></Board>
      </div>
    )
  }
}

//棋子数据
const PIECESDATA = [
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