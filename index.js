// create instance of Game
var game = new Game();

// object definitions

function Game() {
  // variables with initial value
  let numberOfRows = 10;
  let doubleColors = false;
  let emptySpaces = false;
  let solution = new Solution(doubleColors, emptySpaces);
  let activeRow = 12; // first row is 12, last row is 3
  let activeHole = 0; //first hole in a row is 0, last is determined by player
  let firstRow = 12;
  let lastRow = 3;

  // add listeners to color buttons
  addListenersToColorButtons();
  // add listener to check button
  addListenerToCheckButton();
  // make the first row active
  addListenersToRow(activeRow);
  // add listener to modal button
  addListenerToModalButton();
  // add listener to save settings buttons
  addListenerToSaveSettingsButton();

  //class methods
  this.getNumberOfRows = function() {
    return numberOfRows;
  }
  this.getActiveRow = function() {
    return activeRow;
  }
  this.getActiveHole = function() {
    return activeHole;
  }
  this.setActiveHole = function(newActiveHole) {
    activeHole = newActiveHole;
  }
  this.isLastRow = function() {
    return (activeRow === (firstRow - numberOfRows + 1));
  }
  this.makeActiveHoleInactive = function () {
    let imageTagActive = document.querySelectorAll(".row")[activeRow].querySelectorAll(".hole")[activeHole].innerHTML;
    let imageTagInactive = imageTagActive.replace('Selected', '');
    document.querySelectorAll(".row")[activeRow].querySelectorAll(".hole")[activeHole].innerHTML = imageTagInactive;
  }
  this.makeNextRowActive = function() {
    return --activeRow;
  }
  this.checkSolution = function() {
    // first get the colors from the active row
    let rowColors = [];
    let row = document.querySelectorAll(".row")[activeRow].querySelectorAll(".hole");
    for (let i = 0; i < row.length; i++) {
      rowColors[i] = row[i].innerHTML.split("Pin")[0].split("/")[1].toLowerCase();
    }
    // check of the filled colors are correct
    return solution.checkSolution(rowColors);
  }
  this.showSolution = function () {
    solution.showSolution();
  }
  this.startNewGame = function () {
    // initialize board:
    // remove listeners from active row
    removeListenersFromRow(activeRow);
    // hide solution
    solution.hideSolution();
    // initialize feedback and holes for the rows that were used in last game
    for (let j = activeRow; j <= firstRow; j++) {
      let row = document.querySelectorAll(".row")[j];
      row.querySelector(".feedback").innerHTML = '<img src="images/0white0black.png" alt="">';
      for (let k = 0; k < 4; k++) {
        row.querySelectorAll(".hole")[k].innerHTML = '<img src="images/emptyPin.png" alt="">';
      }
    }
    // hide all rows that will not be used
    for (let a = lastRow; a < (firstRow - numberOfRows +  1); a++) {
      document.querySelectorAll(".row")[a].classList.add("hidden");
    }
    // show all rows that will be used
    for (let b = (firstRow - numberOfRows + 1); b <= firstRow; b++) {
      document.querySelectorAll(".row")[b].classList.remove("hidden");
    }
    // make first row active
    activeRow = firstRow;
    addListenersToRow(firstRow);
    // set first hole active
    activeHole = 0;
    document.querySelectorAll(".row")[firstRow].querySelectorAll(".hole")[0].innerHTML = '<img src="images/emptyPinSelected.png" alt="">';
    // make new solution
    solution = new Solution(doubleColors, emptySpaces);
  }
  this.saveSettings = function () {
    // save empty spaces setting
    if (document.querySelector(".empty-spaces-checkbox").checked) {
      emptySpaces = true;
      // show the empty space button
      document.querySelector(".empty-button-row").classList.remove("hidden");
    } else {
      emptySpaces = false;
      // hide the empty space button
      document.querySelector(".empty-button-row").classList.add("hidden");
    }
    // save double colors setting
    doubleColors = document.querySelector(".double-colors-checkbox").checked;
    // process new number of rows settings
    let newNumber = parseInt(document.querySelector("#rows-datalist").value);
    if (!isNaN(newNumber)) {
      numberOfRows = newNumber;
    }
    // start new game after saving all setting
    this.startNewGame();
  }
}

function Solution(doubleColorsAllowed, emptySpacesAllowed) {
  let colors = [];
  let colorValue = 0
  let colorValues = [];
  let numberOfColors = 6;
  if (emptySpacesAllowed) {
    numberOfColors = 7;
  }
  for (let i = 0; i <= 3; i++) {
    colorValue = Math.floor(Math.random() * numberOfColors);
    if (!doubleColorsAllowed) {
      while (colorValues.includes(colorValue)) {
        colorValue = Math.floor(Math.random() * numberOfColors);
      }
    }
    colorValues[i] = colorValue;

    if (colorValue === 0) {
      colors[i] = "red";
    } else if (colorValue === 1) {
      colors[i] = "green";
    } else if (colorValue === 2) {
      colors[i] = "white";
    } else if (colorValue === 3) {
      colors[i] = "blue";
    } else if (colorValue === 4) {
      colors[i] = "yellow";
    } else if (colorValue === 5) {
      colors[i] = "black";
    } else if (colorValue === 6) {
      colors[i] = "empty";
    }
  }
  this.checkSolution = function(rowColors) {
    let numberOfBlackPins = 0;
    let numberOfWhitePins = 0;
    // make a copy of the solution colors so it can manipulated
    let colorsCopy = colors.slice();
    let rowColorsCopy = rowColors.slice();
    // check for exact matches and give them black as feedback
    let numberOfRemovedColors = 0;
    for (let i = 0; i < rowColors.length; i++) {
      if (colors[i] === rowColors[i]) {
        numberOfBlackPins++;
        // remove the exact match from the arrays
        colorsCopy.splice(i - numberOfRemovedColors, 1);
        rowColorsCopy.splice(i - numberOfRemovedColors, 1);
        numberOfRemovedColors++;
      }
    }
    // check for colors that don't have an exact match and give white as feedback
    for (j = 0; j < rowColorsCopy.length; j++) {
      if (colorsCopy.includes(rowColorsCopy[j])) {
        let index = colorsCopy.indexOf(rowColorsCopy[j]);
        colorsCopy.splice(index, 1);
        numberOfWhitePins++;
      }
    }
    return [numberOfBlackPins, numberOfWhitePins];
  }
  this.showSolution = function () {
    let imageText = "";
    for (let i = 0; i < 4; i++) {
        imageText = '<img src="images/' + colors[i] + 'Pin.png" alt="">'
        document.querySelectorAll(".row")[1].querySelectorAll(".hole")[i].innerHTML = imageText;
    }
  }
  this.hideSolution = function () {
    for (let i = 0; i < 4; i++) {
      document.querySelectorAll(".row")[1].querySelectorAll(".hole")[i].innerHTML = '<img src="images/hideHole.png" alt="">';
    }
  }
}

// listener section

function addListenersToRow(row) {
  for (let i = 0; i <= 3; i++) {
    document.getElementsByClassName("row")[row].getElementsByClassName("hole")[i].addEventListener('click', makeHoleActive);
  }
}

function removeListenersFromRow(row) {
  for (let i = 0; i <= 3; i++) {
    document.getElementsByClassName("row")[row].getElementsByClassName("hole")[i].removeEventListener('click', makeHoleActive);
  }
}

function addListenersToColorButtons() {
  for (let i = 0; i < document.querySelectorAll(".color-btn").length; i++) {
    document.querySelectorAll(".color-btn")[i].addEventListener("click", handleColorbutton);
  }
  document.querySelector(".empty-btn").addEventListener("click", handleColorbutton);
}

function addListenerToCheckButton() {
  document.querySelector(".check-btn").addEventListener("click", handleCheckButton);
}

function addListenerToModalButton() {
  document.querySelector(".modal-button").addEventListener("click", function () {
    game.startNewGame();
  });
}

function addListenerToSaveSettingsButton() {
  document.querySelector(".save-settings-button").addEventListener("click", function () {
    game.saveSettings();
  });
}

// functions called by listeners

function makeHoleActive(event) {
  // if user clicks a hole that is already active then do nothing
  if (!event.target.outerHTML.includes("Selected")) {
    // so user clicked an inactive hole
    let activeRow = game.getActiveRow();
    let activeHole = game.getActiveHole();
    // make active hole inactive
    game.makeActiveHoleInactive();
    // make the clicked hole active
    event.target.outerHTML = event.target.outerHTML.replace("Pin", "PinSelected");
    // first determine at which position the clicked hole is
    let imageTag = "";
    let counter = 0;
    while (!imageTag.includes("Selected")) {
      imageTag = document.querySelectorAll(".row")[activeRow].querySelectorAll(".hole")[counter].innerHTML;
      if (!imageTag.includes("Selected")) {
        counter++;
      }
    }
    // pass the new active hole to Game
    game.setActiveHole(counter);
  }
}

function handleColorbutton(event) {
  let buttonTag = event.target.outerHTML;
  let pinColor = buttonTag.split("/button")[1].split(".")[0].toLowerCase();
  let activeRow = game.getActiveRow();
  let activeHole = game.getActiveHole();
  // fill hole with colored pin and make current field inactive
  let newImageTag = '<img src="images/' + pinColor + 'Pin.png" alt="">';
  document.querySelectorAll(".row")[activeRow].querySelectorAll(".hole")[activeHole].innerHTML = newImageTag;
  // make hole to the right active, or the left hole if the most right hole is active
  let newActiveHole = 0;
  if (activeHole !== 3) {
    newActiveHole = activeHole + 1;
  }
  let currentTag = document.querySelectorAll(".row")[activeRow].querySelectorAll(".hole")[newActiveHole].innerHTML;
  let newTagActive = currentTag.replace("Pin", "PinSelected");
  document.querySelectorAll(".row")[activeRow].querySelectorAll(".hole")[newActiveHole].innerHTML = newTagActive;
  game.setActiveHole(newActiveHole);
}

function handleCheckButton() {
  // remove listeners from active row
  let activeRow = game.getActiveRow();
  let activeHole = game.getActiveHole();
  removeListenersFromRow(activeRow);
  // make active hole inactive
  game.makeActiveHoleInactive();
  // check solution and get feedback
  let feedback = game.checkSolution();
  let numberOfBlackPins = feedback[0];
  let numberOfWhitePins = feedback[1];
  // show feedback
  let feedbackText = numberOfWhitePins + "white" + numberOfBlackPins + "black";
  let currentText = document.querySelectorAll(".feedback")[activeRow - 3].innerHTML;
  let changedText = currentText.replace("0white0black", feedbackText);
  document.querySelectorAll(".feedback")[activeRow - 3].innerHTML = changedText;
  // if input matches Solution
  if (numberOfBlackPins === 4) {
    //show solution
    game.showSolution();
    // show popup
    showModal(numberOfBlackPins === 4);
    // else if was last row
  } else {
    if (game.isLastRow()) {
      //   game over
      //show solution
      game.showSolution();
      // show popup
      showModal(numberOfBlackPins === 4);
    } else {
      //   make next row active
      let nextRow = game.makeNextRowActive();
      addListenersToRow(nextRow);
      // set first hole active
      document.querySelectorAll(".row")[nextRow].querySelectorAll(".hole")[0].innerHTML = '<img src="images/emptyPinSelected.png" alt="">';
      game.setActiveHole(0);
    }
  }
}

function showModal (userWon) {
  let modalText = "";
  if (userWon) {
    modalText = "🏆 You won!";
  } else {
    modalText = "😩 Game over!";
  }
  document.querySelector(".modal-text").innerHTML = modalText;
  $('#myModal').modal({
    backdrop: false
  });
}
