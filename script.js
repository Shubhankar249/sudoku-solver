const arr = [[], [], [], [], [], [], [], [], []];
let temp = [[], [], [], [], [], [], [], [], []];

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        arr[i][j] = document.getElementById(i * 9 + j);

    }
}

function initializeTemp(temp) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            temp[i][j] = false;
        }
    }
}

function setTemp(board, temp) {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                temp[i][j] = true;
            }

        }
    }
}

function setColor(temp) {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (temp[i][j] === true) {
                arr[i][j].style.color = "#DC3545";
            }

        }
    }
}

function resetColor() {

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {

            arr[i][j].style.color = "green";


        }
    }
}

let board = [[], [], [], [], [], [], [], [], []];


let button = document.getElementById('generate-sudoku')
let solve = document.getElementById('solve')

console.log(arr)
function changeBoard(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] !== 0) {
                arr[i][j].innerText = board[i][j]
            }

            else
                arr[i][j].innerText = ''
        }
    }
}


button.onclick = function () {
    const xhrRequest = new XMLHttpRequest();
    xhrRequest.onload = function () {
        const response = JSON.parse(xhrRequest.response);
        console.log(response)
        initializeTemp(temp)
        resetColor()

        board = response.board
        setTemp(board, temp)
        setColor(temp)
        changeBoard(board)
    }
    let diff = document.getElementById('diff').value.toLowerCase();
    xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=' + diff)
    //we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
    xhrRequest.send()
}

function canPlace(i, board, sr, sc) {
    // check row
    for (let j=0; j<board.length; j++)
        if (board[sr][j]===i) return false;
    // check col
    for (let j=0; j<board.length; j++)
        if (board[j][sc]===i) return false;

    // check 3X3 grid
    let x = parseInt(sr/3), y = parseInt(sc/3);

    for (let j=x*3; j<x*3 +3; j++) {
        for (let k = y*3; k< y*3 + 3; k++) {
            if (board[j][k]===i) return false;
        }
    }
    return true;
}
let solved = false;
function solveSudokuHelper(board, sr, sc) {
    if (solved)
        return;
    if (sr === board.length) {
        solved = true;
        changeBoard(board);
        return;
    }
    if (sc===board.length) {
        solveSudokuHelper(board, sr+1, 0);
        return;
    }
    if (board[sr][sc]!==0)  {
        solveSudokuHelper(board, sr, sc+1);
        return;
    }

    for (let i=1; i<10; i++) {
        if (canPlace(i, board, sr, sc)) {
            board[sr][sc] = i;
            solveSudokuHelper(board, sr, sc+1);
            board[sr][sc] = 0;
        }
    }
}

solve.onclick = function () {
    solveSudokuHelper(board, 0, 0);
}
