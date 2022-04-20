window.onload = () => {
  const cells = document.querySelectorAll(".game-field_cell");

  const cross = document.querySelector("#cross");
  const circle = document.querySelector("#circle");
  const btnReset = document.querySelector(".reset-button");
  const btnNewSize = document.querySelector(".reset-button");
  const winnerField = document.querySelector(".winner");

  const [x, o] = ["x", "o"];

  //состояние игры
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

  //заполнение клеток
  const viewField = (target) => {
    if (gameState.fields[target.dataset.number - 1] === x)
      target.classList.add("jedy");
    if (gameState.fields[target.dataset.number - 1] === o)
      target.classList.add("sith");
  };

  // закрашивание победных клеток
  const paintCells = (cells) => {
    cells.forEach((index) => {
      const field = document.querySelector(`[data-number='${index + 1}']`);
      const winnerClassList =
        gameState.currentPlayer === x ? "winner-jedy" : "winner-sith";
      field.classList.add(winnerClassList);
    });
  };

  //обработка клика по кнопке
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
        const winnerName = gameState.currentPlayer === x ? "Джедаи" : "Ситхи";
        winnerField.textContent = "Победили " + winnerName + "!";
      }
      gameState.currentPlayer = gameState.currentPlayer === x ? o : x;
    }
  };

  // очистка клеток
  const clearFields = () => {
    cells.forEach((cell) => {
      cell.innerHTML = "";
      winnerField.textContent = "";
      cell.classList.remove("sith");
      cell.classList.remove("jedy");
      cell.classList.remove("winner-sith");
      cell.classList.remove("winner-jedy");
    });
  };

  //кнопка reset
  const handleReset = () => {
    clearFields();
    const newFields = gameState.fields.map(() => "");
    gameState.fields = newFields;
    gameState.currentPlayer = x;
    gameState.winner = null;
  };

  //привязка обработчиков
  cells.forEach((cell) => {
    cell.addEventListener("click", clickCell);
  });
  btnReset.addEventListener("click", handleReset);
};
