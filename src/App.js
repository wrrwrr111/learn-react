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
    const currentBoard = this.props.currentBoard;
    const isTemp = this.props.isTemp;
    const squareItems = currentBoard.map((square, index) => {
      //渲染的时候跳过边界
      if (index < 21 || index > 441 || index % 21 === 0) return null;
      if (isTemp) {
        return (
          <div 
            className={square?`cel cel_${square}`:'cel'}
            onMouseEnter={()=>this.props.tryMove(index)}//onMouseLeave
            onClick={()=>this.props.move()}
            key={index}>
          </div>
        )
      } else {
        return <div className={square?`cel cel_${square}`:'cel'} key={index}></div>
      }
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
      const pieces = piece.pieceData.map((square, index) => {
        let row = parseInt(index / 5)
        let col = index % 5
        if (row === 0 && col === 0) {
          return <div className='cel' onClick={this.props.rotatePiece} key={index}>转</div>
        }
        if (row === 0 && col === 4) {
          return <div className='cel' onClick={this.props.mirrorPiece} key={index}>翻</div>
        }
        return <div className={square?`cel cel_${piece.playerIndex}`:'cel'} key={index}></div>
      })
      return <div className={`piece selected_${piece.playerIndex}`}>{pieces}</div>
    } else {
      const pieces = piece.pieceData.map((square, index) => {
        return <div className={square?`cel cel_${piece.playerIndex}`:'cel'} key={index}></div>
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
      <div className={`player player_${player.playerIndex}`}>
        {pieceItems}
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBoard: [...EMPTY_BOARD],
      tmpBoard: null,
      isLegal: false, //当前tryMove时候合法
      players: [1, 2, 3, 4].map((playerIndex) => {
        let playerId = Math.random().toFixed(5) * 100000 + 1; // TODO 
        return {
          playerIndex,
          playerId,
          pieces: PIECES_DATA.map(pieceData => {
            return {
              playerIndex,
              playerId,
              pieceData
            }
          }),
        }
      }),
      selectedPiece: null,
    }
  }
  // 选中棋子 同时生成临时棋盘
  selectPiece = (piece) => {
    const currentBoard = [...this.state.currentBoard];
    this.setState({
      selectedPiece: piece,
      tmpBoard: currentBoard,
    })
  }
  // 逆时针旋转选中棋子
  rotatePiece = (piece) => {
    const rotation = math.pi / 2;
    const C = math.cos(rotation).toFixed();
    const S = math.sin(rotation).toFixed();
    const selectedPiece = this.state.selectedPiece;
    let rotatedPiece = {
      ...selectedPiece,
      pieceData: [...EMPTY_PIECE],
    };
    selectedPiece.pieceData.forEach((square, squareIndex) => {
      let row = parseInt(squareIndex / 5)
      let col = squareIndex % 5
      if (square) {
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
          [row],
          [col],
          [1]
        ])
        rotatedPiece.pieceData[x * 5 + y] = selectedPiece.playerId
      }
    })
    this.setState({
      selectedPiece: rotatedPiece
    })
  }
  // 上下翻转选中棋子
  mirrorPiece = (piece) => {
    const selectedPiece = this.state.selectedPiece;
    let rotatedPiece = {
      ...selectedPiece,
      pieceData: [...EMPTY_PIECE],
    };
    selectedPiece.pieceData.forEach((square, squareIndex) => {
      let row = parseInt(squareIndex / 5)
      let col = squareIndex % 5
      if (square) {
        let x = 4 - row;
        let y = col;
        rotatedPiece.pieceData[x * 5 + y] = selectedPiece.playerId
      }
    })
    this.setState({
      selectedPiece: rotatedPiece
    })
  }
  // 在临时棋盘上移动棋子 有个备份棋子 超出范围择撤销
  tryMove = (tryIndex) => {
    const currentBoard = [...this.state.currentBoard];
    const selectedPiece = this.state.selectedPiece;
    const tryX = parseInt((tryIndex - 21) / 21);
    const tryY = tryIndex % 21 - 1;
    let tmpBoard = [...this.state.currentBoard];
    let rule = {
      range: true, //是否越界内
      side: true, //是否和自己边对边
      angle: false, //是否角对角
      first: false,
    };
    selectedPiece.pieceData.forEach((square, squareIndex) => {
      if (square) {
        const movedX = tryX + parseInt(squareIndex / 5) - 2;
        const movedY = tryY + squareIndex % 5 - 2;
        const movedIndex = 22 + movedX * 21 + movedY;
        if (
          currentBoard[movedIndex] === 9
        ) { // 判断边界 
          rule.inRange = false;
        } else if (
          currentBoard[movedIndex] === selectedPiece.playerIndex + 4
        ) { // 判断是否第一个
          rule.first = true;
        } else if (
          currentBoard[movedIndex - 1] === selectedPiece.playerIndex ||
          currentBoard[movedIndex + 1] === selectedPiece.playerIndex ||
          currentBoard[movedIndex - 21] === selectedPiece.playerIndex ||
          currentBoard[movedIndex + 21] === selectedPiece.playerIndex
        ) { // 判断是否同色边对边
          rule.side = false;
        } else if (
          currentBoard[movedIndex - 20] === selectedPiece.playerIndex ||
          currentBoard[movedIndex - 22] === selectedPiece.playerIndex ||
          currentBoard[movedIndex + 20] === selectedPiece.playerIndex ||
          currentBoard[movedIndex + 22] === selectedPiece.playerIndex
        ) { // 判断是否同色角对角
          rule.angle = true;
        }
        tmpBoard[movedIndex] = selectedPiece.playerIndex;
      }
    })
    let isLegal = rule.range && (rule.first || (rule.side && rule.angle))
    if (isLegal) { //落子合法才显示
      this.setState({
        tmpBoard,
        isLegal: isLegal,
      })
    }
  }
  // 落子
  move = () => {
    const isLegal = this.state.isLegal;
    const tmpBoard = [...this.state.tmpBoard];
    //TODO 移除对应棋子
    if (isLegal) {
      this.setState({
        currentBoard: tmpBoard,
        tmpBoard: null,
        isLegal: false,
      })
    }
  }

  render() {
    const players = this.state.players && [...this.state.players];
    const selectedPiece = this.state.selectedPiece;
    const currentBoard = this.state.currentBoard && [...this.state.currentBoard];
    const tmpBoard = this.state.tmpBoard && [...this.state.tmpBoard];
    const playerItems = players.map(player => {
      return (
        <PlayerItem player={player} selectPiece={this.selectPiece} key={player.playerId}></PlayerItem>
      )
    })
    return (
      <div className='square'>
        {playerItems}
        {selectedPiece && <PieceItem piece={selectedPiece} isSelected={true} rotatePiece={this.rotatePiece} mirrorPiece={this.mirrorPiece}></PieceItem>}
        <Board currentBoard={tmpBoard||currentBoard} isTemp={Boolean(tmpBoard)} tryMove={this.tryMove} move={this.move}></Board>
      </div>
    )
  }
}

//棋子数据 改为1维数组 降低了代码可观性
//空的棋盘 参考 http://www.radagast.se/othello/endgame.c
//9作为边界 0作为棋盘 棋子为1-4 起始位置为5-8
const EMPTY_BOARD = [
  9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
  9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  9, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7,
  9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9
];
//空的棋子
const EMPTY_PIECE = [
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0,
  0, 0, 0, 0, 0
];
//21种棋子
const PIECES_DATA = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0]
]

export default App;