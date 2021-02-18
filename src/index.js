import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className={props.highLight? 'square highlight':'square'}
            onClick = {props.onClick}
        >
            {props.value}
        </button>

    );
}

class Board extends React.Component {

    renderSquare(i) {
        let hl = false;
        if (this.props.line.length > 0) {
            /*console.log('TEST')*/
            for (let index = 0; index < this.props.line.length; index++) {
                if (this.props.line[index] == i) {
                    hl = true;
                }
            }
        }
        else{
            /*console.log('TEST2')*/
        }
        return(
            <Square
                key={i}
                highLight ={hl}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        )
    }
/*<div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>*/

    createBoard(){
        let board = [];
        let square = 0;
        const rownum = 3;
        const colnum = 3;
        for (let index = 0; index < rownum; index++) {
            let col = [];
            for (let index = 0; index < colnum; index++) {
                col.push(this.renderSquare(square));
                square++;
            }
            board.push(<div key={index} className="board-row">{col}</div>)
        }
        return board;
    }

    render() {
        return (
            <div>
                {this.createBoard()}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history : [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            locations: [
                [0,0]
            ],
            selected: null,
            isAscending: true,
            line: []
        };
    }

    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                this.state.line = lines[i];
                return squares[a];
            }
        }
        return null;
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const locations = this.state.locations.slice(0,this.state.stepNumber + 1);
        const location = checklocation(i);
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext? 'X':'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            locations: locations.concat([location]),
            selected: null
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            selected: step,
            line: []
        })
    }

    changeSort(){
        this.setState({
            isAscending: !this.state.isAscending,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);
        const locations = this.state.locations;

        const moves = history.map((step, move) => {
            const font = this.state.selected == move? {fontWeight:'bold'} : {fontWeight:'normal'}
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            const loc = move? '('+locations[move][0]+','+locations[move][1]+')':null;
            return (
                <li key={move}
                    style={font}
                >
                    <button
                        onClick={() => this.jumpTo(move)}
                        style={font}
                    >
                        {desc}
                    </button>
                    <span> {loc}</span>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else {
            if (this.state.stepNumber == 9) {
                status = 'DRAW'
            }
            else{
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        line={this.state.line}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div className='btn'>
                        <button onClick={() => this.changeSort()}>{this.state.isAscending? 'Sort ↓' : 'Sort ↑'}</button>
                    </div>
                    <ol>{this.state.isAscending? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

/*function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            this.state.line = lines[i];
            return squares[a];
        }
    }
    return null;
}*/

function checklocation(clicked) {
    const pos = [
        [1,1],
        [2,1],
        [3,1],
        [1,2],
        [2,2],
        [3,2],
        [1,3],
        [2,3],
        [3,3],
    ]
    return pos[clicked];
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
