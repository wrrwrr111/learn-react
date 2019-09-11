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
    const boardData = this.props.boardData;
    const isTemp = this.props.isTemp;
    const squareItems = boardData.map((row, rowIndex) => {
      return row.map((col, colIndex) => {
        if(isTemp){
          return (
            <div 
            className='cel'
            onMouseEnter={()=>this.props.tryMove(rowIndex,colIndex)}//onMouseLeave
            key={rowIndex*5+colIndex}>
          </div>
          )
        }else{
          return <div className='cel' key={rowIndex*5+colIndex}></div>
        }
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
      boardData: [  // 20x20
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      tmpBoard:null,
      players: ['red', 'yellow', 'blue', 'green'].map((color, index) => {
        let id = Math.random().toFixed(5) * 100000 + 1; // TODO 
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
  // 选中棋子 同时生成临时棋盘
  selectPiece = (piece) => {
    const boardData = this.state.boardData;
    this.setState({
      selectedPiece: piece,
      tmpBoard:boardData,
    })
  }
  // 逆时针旋转选中棋子
  rotatePiece = (piece) => {
    const rotation = math.pi / 2;
    const C = math.cos(rotation).toFixed();
    const S = math.sin(rotation).toFixed();
    const selectedPiece = this.state.selectedPiece;
    let rotatedPiece = {...selectedPiece,
      pieceData: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
    };
    selectedPiece.pieceData.forEach((row, rowIndex) => {
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
          rotatedPiece.pieceData[x][y] = selectedPiece.playerId
        }
      })
    })
    this.setState({
      selectedPiece: rotatedPiece
    })
  }
  // 上下翻转选中棋子
  mirrorPiece = (piece) => {
    const selectedPiece = this.state.selectedPiece;
    let rotatedPiece = {...selectedPiece,
      pieceData: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
    };
    selectedPiece.pieceData.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col) {
          let x = 4 - rowIndex;
          let y = colIndex;
          rotatedPiece.pieceData[x][y] = selectedPiece.playerId
        }
      })
    })
    this.setState({
      selectedPiece: rotatedPiece
    })
  }
  // 在临时棋盘上移动棋子
  tryMove = (x, y) => {
    const selectedPiece = this.state.selectedPiece;
    console.log(x, y)
  }
  
  // 返回选中棋子平移 x, y后 棋子个点坐标
  translatePiece = (x,y) =>{
    const selectedPiece = this.state.selectedPiece;
  }
  render() {
    const players = this.state.players;
    const selectedPiece = this.state.selectedPiece;
    const boardData = this.state.boardData;
    const tmpBoard = this.state.tmpBoard
    const playerItems = players.map(player => {
      return (
        <PlayerItem player={player} selectPiece={this.selectPiece} key={player.id}></PlayerItem>
      )
    })
    return (
      <div className='square'>
        {playerItems}
        {selectedPiece && <PieceItem piece={selectedPiece} isSelected={true} rotatePiece={this.rotatePiece} mirrorPiece={this.mirrorPiece}></PieceItem>}
        <Board boardData={tmpBoard||boardData} isTemp={Boolean(tmpBoard)} tryMove={this.tryMove}></Board>
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