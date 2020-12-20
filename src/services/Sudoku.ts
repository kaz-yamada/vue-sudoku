type GridValues = { [key: string]: string };
type BooleanObject = { [key: string]: boolean };
export default class Sudoku {
  static GRID_LENGTH = 9;
  static TOTAL_SQUARES = 81;
  static DIGITS = '123456789';
  static ROWS = 'ABCDEFGHI';

  private _cols: string[] = [];
  private _rows: string[] = [];
  private _unitlist: string[][] = [];
  private _squares: string[];
  private _units: { [key: string]: string[][] } = {};
  private _peers: { [key: string]: string[] } = {};

  // Track the game
  private _gameString = '';
  private _gameSquares: BooleanObject = {};
  private _isGameOver = false;
  private _currentDifficulty = 0;

  // Track user's inputs
  private _values: GridValues = {};
  private _incorrectSquares: BooleanObject = {};
  private _notes: { [key: string]: BooleanObject } = {};

  static DIFFICULTY = [
    { name: 'Easy', value: 40 },
    { name: 'Medium', value: 30 },
    { name: 'Hard', value: 25 },
    { name: 'Very hard', value: 17 }
  ];

  constructor() {
    this._rows = Sudoku.ROWS.split('');
    this._cols = Sudoku.DIGITS.split('');
    this._squares = Sudoku.cross(this._rows, this._cols);

    // Columns
    for (const c in this._cols) {
      this._unitlist.push(Sudoku.cross(this._rows, [this._cols[c]]));
    }

    for (const r in this._rows) {
      this._unitlist.push(Sudoku.cross([this._rows[r]], this._cols));
    }

    const RROWS = [
      ['A', 'B', 'C'],
      ['D', 'E', 'F'],
      ['G', 'H', 'I']
    ];
    const CCOLS = [
      ['1', '2', '3'],
      ['4', '5', '6'],
      ['7', '8', '9']
    ];

    for (const rs in RROWS) {
      for (const cs in CCOLS) {
        this._unitlist.push(Sudoku.cross(RROWS[rs], CCOLS[cs]));
      }
    }

    this._squares.forEach(s => {
      this._units[s] = this._unitlist.filter(list => list.indexOf(s) > -1);

      const checkSquareMap: BooleanObject = {};

      this._peers[s] = this._units[s].reduce((acc, list) => {
        list.forEach(val => {
          if (checkSquareMap[val] !== true && val !== s) {
            checkSquareMap[val] = true;
            acc.push(val);
          }
        });

        return acc;
      }, []);
    });
  }

  // Setters & Getters
  // -------------------------------------------------------------------------
  public get values() {
    return this._values;
  }

  public get rows() {
    return this._rows;
  }

  public get cols() {
    return this._cols;
  }

  public get incorrectSquares() {
    return this._incorrectSquares;
  }

  public get gameSquares() {
    return this._gameSquares;
  }

  public get notes() {
    return this._notes;
  }

  public get currentDifficulty() {
    const diff = Sudoku.DIFFICULTY.find(
      obj => obj.value <= this._currentDifficulty
    );

    return diff ? diff.name : '';
  }

  public get isGameOver() {
    return this._isGameOver;
  }

  /**
   * Get the string for the game in the current state
   */
  public getCurrentGameString = () => Object.values(this._values).toString();

  /**
   * Get the list of peers for the square
   * @param square the square code to find peers for e.g. A1
   */
  public getSelectedPeers(square: string) {
    return [...this._peers[square]];
  }

  /**
   * Get all the square IDs that share the same value
   * @param s
   */
  public getAllSameValues(s: string) {
    const value = this._values[s];
    if (!Sudoku.DIGITS.includes(value)) return [];

    return Object.keys(this._values).reduce((acc, key) => {
      if (this._values[key] === value) {
        acc.push(key);
      }

      return acc;
    }, [] as string[]);
  }

  /**
   *
   * @param value
   * @param square
   */
  public setSquareValue(value: string, square: string, isNotesMode = false) {
    if (this._values[square] === value || this._gameSquares[square]) return;

    if (value === 'Delete') {
      this._values[square] = '.';
    } else if (Sudoku.DIGITS.includes(value)) {
      if (isNotesMode) {
        this.setSquareNote(value, square);
      } else {
        this._values[square] = value;
      }
    }

    // Check for errors
    if (!isNotesMode) {
      this._isGameOver = this.checkGame();
    }

    return this._isGameOver;
  }

  private setSquareNote(value: string, square: string) {
    if (!this._notes[square]) {
      this._notes[square] = [...Sudoku.DIGITS].reduce((obj, d) => {
        obj[d] = false;
        return obj;
      }, {} as BooleanObject);
    }

    this._notes[square][value] = !this._notes[square][value];
  }

  // Game Controls
  // -------------------------------------------------------------------------

  /**
   *
   * @param difficulty
   */
  public createNewGame = (difficulty = Sudoku.DIFFICULTY[0].value) => {
    this._incorrectSquares = {};
    this._values = {};
    this._currentDifficulty = difficulty;
    this._isGameOver = false;
    this._notes = {};

    this._gameString = this.generatePuzzle(difficulty);
    this.parseGrid(this._gameString);

    return this._gameString;
  };

  /**
   *
   */
  public resetGame = () => {
    this.parseGrid(this._gameString);
    this._incorrectSquares = {};

    return this._gameString;
  };

  /**
   * Make a random puzzle with N or more assignments. Restart on contradictions.
   * Note the resulting puzzle is not guaranteed to be solvable, but empirically
   * about 99.8% of them are solvable. Some have multiple solutions.
   *
   * @param N The number of squares filled at the start of the puzzle
   */
  private generatePuzzle = (N: number): string => {
    const values = this._squares.reduce((obj, sq) => {
      obj[sq] = Sudoku.DIGITS;
      return obj;
    }, {} as GridValues);

    const shuffled = this.shuffle(this._squares);

    for (const s of shuffled) {
      if (!this.assign(values, s, this.choose(values[s]))) break;

      const ds = [];

      for (const sq of this._squares) {
        if (values[sq].length === 1) ds.push(values[sq]);
      }

      const set = [...new Set(ds)];

      if (ds.length >= N && set.length >= 8) {
        const str = this._squares.reduce((acc, sq) => {
          acc += values[sq].length === 1 ? values[sq] : '.';
          return acc;
        }, '');

        return str;
      }
    }

    // Retry
    return this.generatePuzzle(N);
  };

  // Parse & Solvers
  // -------------------------------------------------------------------------

  /**
   * Convert grid to a dict of possible values, {square: digits}, or
   * return False if a contradiction is detected.
   *
   * @param grid
   */
  public parseGrid = (grid: string) => {
    this._gameString = grid;
    this._values = { ...this.getGridValues(grid) };
  };

  /**
   *
   */
  public solve = () => {
    this.resetGame();
    const v = this.validateGrid();
    const ans = this.search(v);

    if (typeof ans === 'object') this._values = { ...ans };

    this._isGameOver = true;

    return this.getCurrentGameString();
  };

  /**
   * Check if puzzle is solveable
   */
  public validateGrid = () => {
    const possibilities = this._squares.reduce((obj, square) => {
      obj[square] = Sudoku.DIGITS;
      return obj;
    }, {} as GridValues);

    const isValid = Object.entries(this._values).every(([s, d]) => {
      if (Sudoku.DIGITS.includes(d) && !this.assign(possibilities, s, d)) {
        return false;
      }
      return true;
    });

    if (isValid) this._values = { ...possibilities };

    return isValid ? possibilities : isValid;
  };

  /**
   * Convert a string to an object of { square: char }
   * @param gridString
   */
  private getGridValues = (gridString: string) => {
    return [...gridString].reduce((obj, val, i) => {
      obj[this._squares[i]] = val;
      this._gameSquares[this._squares[i]] = val !== '.' && val !== '0';

      return obj;
    }, {} as GridValues);
  };

  /**
   * Eliminate all the other values (except d) from values[s] and propagate.
   * Return values, except return False if a contradiction is detected.
   *
   * @param values
   * @param s
   * @param d
   * @returns
   */
  private assign = (
    values: GridValues,
    s: string,
    d: string
  ): GridValues | boolean => {
    const otherValues = values[s].replace(d, '');
    for (const d2 of [...otherValues]) {
      const all = this.eliminate(values, s, d2);

      if (!all) return false;
    }

    return values;
  };

  /**
   * Eliminate d from values[s]; propagate when values or places <= 2.
   * Return values, except return False if a contradiction is detected.
   */
  private eliminate = (
    values: GridValues,
    s: string,
    d: string
  ): boolean | GridValues => {
    // Already eliminated
    if (!values[s].includes(d)) return values;

    values[s] = values[s].replace(d, '');

    //  (1) If a square s is reduced to one value d2, then eliminate d2 from the peers.
    if (values[s].length === 0) {
      // Contradiction: removed last value
      return false;
    } else if (values[s].length === 1) {
      const d2 = values[s];
      for (const s2 of this._peers[s]) {
        if (!this.eliminate(values, s2, d2)) return false;
      }
    }

    // (2) If a unit u is reduced to only one place for a value d, then put it there.
    for (const u of this._units[s]) {
      const dplaces: string[] = [];
      for (const sq of u) {
        if (values[sq].includes(d)) dplaces.push(sq);
      }

      if (dplaces.length === 0) return false;
      else if (dplaces.length === 1) {
        if (!this.assign(values, dplaces[0], d)) return false;
      }
    }

    return values;
  };

  /**
   *
   * @param values
   */
  private search = (values: GridValues | boolean): GridValues | boolean => {
    if (!values) return false;

    if (typeof values === 'object') {
      const unknowns: GridValues = {};
      let smallest = '';
      let solved = true;

      for (const s of this._squares) {
        if (values[s].length > 1) {
          solved = false;
          unknowns[s] = values[s];

          if (smallest === '' || values[s].length < unknowns[smallest].length) {
            smallest = s;
          }
        }
      }

      // All squares have 1 possible value
      if (solved) return values;

      for (let i = 0; i < values[smallest].length; i++) {
        const d = values[smallest].charAt(i);
        const res = this.some(
          this.search(this.assign({ ...values }, smallest, d))
        );

        if (res) return res;
      }
    }

    return false;
  };

  /**
   * Checks the peers of the passed square to see if the values
   * conflict with each other
   *
   * @param s
   *
   * returns true if there are any conflicting values, false if not
   */
  public checkPeers = (s: string) => {
    this.checkSquare(s);

    for (const key in this._incorrectSquares) {
      if (this._incorrectSquares[key]) {
        this.checkSquare(key);
      }
    }

    return this._incorrectSquares[s];
  };

  private checkSquare = (s: string) => {
    const peers = this._peers[s];
    const value = this._values[s];

    if (!peers) return false;

    this._incorrectSquares[s] = peers.reduce(
      (hasConflict: boolean, peerSquare) => {
        const peerValue = this._values[peerSquare];

        if (value === peerValue && peerSquare !== '0' && peerValue !== '.') {
          hasConflict = true;
          this._incorrectSquares[peerSquare] = true;
        }

        return hasConflict;
      },
      false
    );

    return this._incorrectSquares[s];
  };

  public checkGame = () => {
    let isGameOver = true;
    for (const key in this._values) {
      const v = this._values[key];
      const peers = this._peers[key];
      let hasConflict = false;

      for (const peerSquare of peers) {
        const peerValue = this._values[peerSquare];
        if (v === peerValue && peerSquare !== '0' && peerValue !== '.') {
          this._incorrectSquares[peerSquare] = true;
          hasConflict = true;
          isGameOver = false;
        }
      }

      isGameOver = v === '.' || v === '0' ? false : isGameOver;
      this.incorrectSquares[key] = hasConflict;
    }

    return isGameOver;
  };

  // Utils
  // -------------------------------------------------------------------------

  /**
   * Return an array with the products of the elements array 1 with the
   * elements of array 2
   *
   * @param arr1
   * @param arr2
   */
  static cross = (arr1: string[], arr2: string[]): string[] => {
    return arr1.reduce((acc, val1) => {
      acc.push(...arr2.map(val2 => val1 + val2));

      return acc;
    }, [] as string[]);
  };

  /**
   *
   * @param seq
   */
  private some = (seq: boolean | GridValues) => {
    if (typeof seq === 'object') {
      for (const key in seq) {
        if (seq[key]) return seq;
      }
    }

    return false;
  };

  /**
   *
   * @param seq
   */
  private shuffle = (seq: string[]) => {
    const shuffled = [...seq];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }

    return shuffled;
  };

  /**
   *
   * @param choices
   */
  private choose = (choices: string) =>
    choices.charAt(Math.floor(Math.random() * choices.length));
}
