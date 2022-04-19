window.onload = () => {
  const cells = document.querySelectorAll(".game-field_cell");

  const cross = document.querySelector("#cross");
  const circle = document.querySelector("#circle");
  const btnReset = document.querySelector(".reset-button");
  const btnNewSize = document.querySelector(".reset-button");
  const winnerField = document.querySelector(".winner");

  const [x, o] = ["x", "o"];

  //model
  const gameState = {
    fields: ["", "", "", "", "", "", "", "", ""],
    currentPlayer: x,
    winner: null,
    prevCell: 0,
    fieldSize: 3,
    cellsWinner: [],
  };

  const { fieldSize } = gameState;

  //Проверка на выигрышную комбинацию
  const checkFill = (player) => {
    const { fieldSize } = gameState;
    const checkColumns = () => {
      for (let i = 0; i < fieldSize; i++) {
        arrayColumn = gameState.fields.reduce((acc, field, index) => {
          if (field === player && (index - i) % gameState.fieldSize === 0) {
            return acc.concat(index);
          }
          return acc;
        }, []);
        if (arrayColumn?.length >= fieldSize) {
          return arrayColumn;
        }
      }
    };

    const checkRows = () => {
      for (let i = 0; i < fieldSize; i++) {
        const arrayRow = gameState.fields.reduce((acc, field, index) => {
          if (
            field === player &&
            index < (i + 1) * fieldSize &&
            index >= i * fieldSize
          ) {
            return acc.concat(index);
          }
          return acc;
        }, []);

        if (arrayRow?.length >= fieldSize) {
          return arrayRow;
        }
      }
    };
    const checkDiagonal = () => {
      const arrayIncrease = gameState.fields.reduce((acc, field, index) => {
        if (
          field === player &&
          index % (fieldSize - 1) === 0 &&
          index > 0 &&
          index < fieldSize * fieldSize - 1
        )
          return acc.concat(index);
        return acc;
      }, []);

      if (arrayIncrease.length >= fieldSize) {
        return arrayIncrease;
      }
      const arrayDecrease = gameState.fields.reduce((acc, field, index) => {
        if (field === player && index % (fieldSize + 1) === 0)
          return acc.concat(index);
        return acc;
      }, []);

      if (arrayDecrease.length >= fieldSize) {
        return arrayDecrease;
      }
    };

    return checkColumns() || checkRows() || checkDiagonal();
    return null;
  };
  // view
  const paintCells = (cells) => {
    cells.forEach((index) => {
      const field = document.querySelector(`[data-number='${index + 1}']`);
      field.style.background = "purple";
    });
  };

  const clearCells = (cells) => {
    cells.forEach((index) => {
      const field = document.querySelector(`[data-number='${index + 1}']`);
      field.style.background = "white";
    });
  };

  //controller
  const clickCell = (e) => {
    if (gameState.winner) return;
    const cellNumber = e.target.dataset.number;
    //model
    if (!e.target.childNodes.length) {
      gameState.fields[cellNumber - 1] = gameState.currentPlayer;
      viewField(e.target);
      gameState.cellsWinner = checkFill(gameState.currentPlayer);
      if (gameState.cellsWinner) {
        paintCells(gameState.cellsWinner);
        gameState.winner = gameState.currentPlayer;
        winnerField.textContent = "Победили " + gameState.currentPlayer + "!";
      }
      gameState.currentPlayer = gameState.currentPlayer === x ? o : x;
    }
  };

  //view
  const viewField = (target) => {
    function fillSymbol(object) {
      const objectCopy = object.cloneNode(true);
      objectCopy.style.height = "100%";
      objectCopy.style.width = "100%";
      target.append(objectCopy);
    }

    if (gameState.fields[target.dataset.number - 1] === x) fillSymbol(cross);
    if (gameState.fields[target.dataset.number - 1] === o) fillSymbol(circle);
  };

  //кнопки
  const clearFields = () => {
    //view
    cells.forEach((cell) => (cell.innerHTML = ""));
    winnerField.textContent = "";
    //controller
    clearCells(gameState.cellsWinner);
    const newFields = gameState.fields.map(() => "");
    gameState.fields = newFields;
  };

  const handleReset = () => {
    clearFields();
    gameState.currentPlayer = x;
    gameState.winner = null;
  };

  const handleNewSize = () => {
    cells.forEach((cell) => (cell.innerHTML = ""));
    gameState.fields.map((field) => {
      field = "";
    });
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", clickCell);
  });
  btnReset.addEventListener("click", handleReset);
  btnNewSize.addEventListener("click", handleNewSize);
};
