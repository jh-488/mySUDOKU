import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  squares: any[][] = [];
  solutions = [1,2,3,4,5,6,7,8,9]
  selectedSolution: any = null;
  displayLvls: boolean = false;
  notValid: boolean = false;
  hasWon: boolean = false;
  showInstructions: boolean = false;


  constructor() {}

  ngOnInit() {
    const header = document.getElementById('appHeader');

    if (header) {
      header.addEventListener('click', () => {
        window.location.reload()});
    }

    this.newGame();
  }


  // Start a new game with an empty grid
  newGame() {
    this.squares = [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    this.hasWon = false;
    this.notValid = false;
    this.displayLvls = false;
    this.showInstructions = false;
  }


  // Get the first empty spot (= 0) and return it's position/index
  getEmpty(): [number | null, number |null] {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.squares[i][j] == 0) {
          return [i,j]; // raw, col
        }
      }
    }
    // if there is no more empty spots
    return [null, null];
  }


  // Check if the number is valid <=> 
  // each column, each row, and each of the nine 3 × 3 subgrids 
  // that compose the grid contain all of the digits from 1 to 9 (no duplicates)
  isValid(num: number, row: number, col: number): boolean {
    // Check rows
    for (let y = 0; y < 9; y++) {
      if (this.squares[row][y] == num){
        return false;
      }
    }

    // Check columns
    for (let x = 0; x < 9; x++) {
      if (this.squares[x][col] == num) {
        return false;
      }
    }

    // Check 3*3 subgrids
    // Divide the 9*9 grid in 3*3 subgrids, so we could iterate over them
    const gridRowStart = Math.floor(row / 3) * 3;
    const gridColStart = Math.floor(col / 3) * 3;
    const gridRowEnd = gridRowStart + 3;
    const gridColEnd = gridColStart + 3;

    for (let i = gridRowStart; i < gridRowEnd; i++) {
      for (let j = gridColStart; j < gridColEnd; j++) {
        if (this.squares[i][j] == num) {
          return false;
        }
      }
    }

    // if we pass all conditions => the number is valid
    return true;
  }

  // solve the puzzle
  solve(): boolean {

    let [row,col] = this.getEmpty();

    if (row === null || col === null) {
      this.hasWon = true;
      return true;
    }

    for(let num = 1; num <= 9; num++) {
      if (this.isValid(num, row, col)) {
        this.squares[row][col] = num;
        this.notValid = false;
        if (this.solve()) {
          return true;
        }
      }
      this.squares[row][col] = 0;
    }
    return false;  
    }

    
    // Select a solution after the user click on it
    selectSolution(choice: number) {
      this.selectedSolution = choice; 
    }


    // Fill the chosen square with the solution only if it's valid
    fillSquare(row:any, col:number) {
      if (this.selectedSolution !== null && this.isValid(this.selectedSolution, row, col)) {
        this.squares[row][col] = this.selectedSolution; 
        this.selectedSolution = null;
        this.notValid = false;
      } 
      else {
        this.notValid = true;
      }
    }


    // make the user choose a difficulty level
    generatePuzzle() {
      this.displayLvls = true;
    }

    // generate a random puzzle from the json file depending on the chosen difficulty
    // needs to use the timestamp or else the solved puzzles will be cashed in the browser
    async selectDifficulty(lvl : string) {
      const timestamp = new Date().getTime();

      const EpuzzlesArray = await fetch(`../../assets/puzzles/easy.json?t=${timestamp}`);
      const MpuzzlesArray = await fetch(`../../assets/puzzles/medium.json?t=${timestamp}`);
      const HpuzzlesArray = await fetch(`../../assets/puzzles/hard.json?t=${timestamp}`);

      const Epuzzles = await EpuzzlesArray.json();
      const Mpuzzles = await MpuzzlesArray.json();
      const Hpuzzles = await HpuzzlesArray.json();
      
      const puzzleIndex = Math.floor(Math.random() * 5);
      
      if(lvl === 'easy') {
        this.squares = Epuzzles.easyPuzzles[puzzleIndex]['grid'];
      }
      if(lvl === 'medium') {
        this.squares = Mpuzzles.mediumPuzzles[puzzleIndex]['grid'];
      }
      if(lvl === 'hard') {
        this.squares = Hpuzzles.hardPuzzles[puzzleIndex]['grid'];
      }

      // hide the buttons after the level is chosen
      this.displayLvls = false;
      this.hasWon = false;
      this.notValid = false;
    }

    // check is the user solved the puzzle correctly
    checkSolution() {
      let [row,col] = this.getEmpty();

      if (row === null || col === null) {
        this.hasWon = true;
      }
    }
    
}
