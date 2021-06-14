const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const ListColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updateOnLoad = false;
let dragItem;
let currentColumn;
let dragging = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


// Set localStorage Arrays
function updateSavedColumns() {

  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const itemsArray = ['backlog', 'progress', 'complete', 'onHold'];

  itemsArray.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });

  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));

}

function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {

  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);

  //Apend
  columnEl.appendChild(listEl);
   
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updateOnLoad) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updateOnLoad = true;
  updateSavedColumns();
}

// Edit array item or delete if empty
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedItem =  ListColumns[column].children;
  if (!dragging) {
    if (!selectedItem[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedItem[id].textContent;
    }
    updateDOM();
  }
  
}

function addToColumn(column){

const itemText = addItems[column].textContent;
const selectedArray = listArrays[column];
selectedArray.push(itemText);
updateDOM();
}

// Show Add items
function showInput(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Show Add items
function hideInput(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Reflect dragged items on arrays
function rebuildArrays() {
  
  backlogListArray = Array.from(backlogList.children).map(i => i.textContent);
  progressListArray = Array.from(progressList.children).map(i => i.textContent);
  completeListArray = Array.from(completeList.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldList.children).map(i => i.textContent);

  updateDOM();
}

// When item is dragged
function drag(e){
  dragging = true;
  dragItem = e.target;
}

//Allow items to drop
function allowDrop(e) {
  e.preventDefault();
}


// When dragged item enters a column
function dragEnter(column) {
  
  ListColumns[column].classList.add('over');
  currentColumn = column;
}

function dragLeave(event) {
  if ( event.target.className == "drag-item" ) {
    ListColumns.forEach((column) =>{
      column.classList.remove('over');
    });
  }
}




// Drop items
function drop(e) {
  e.preventDefault();
  //Remove padding/Color effect after drop
  ListColumns.forEach((column) =>{
    column.classList.remove('over');
  });
  // Add item 
  const p = ListColumns[currentColumn];
  p.appendChild(dragItem);
  dragging = false;
  rebuildArrays();
}

// On load update DOM
updateDOM();

