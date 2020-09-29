const newItemForm = document.getElementById("add-form");
const titleTask = document.getElementById("inputTitle");
const textTask = document.getElementById("inputText");

const numberUp = document.getElementById("number-up");
const numberDown = document.getElementById("number-down");

const nameTodo = document.querySelector(".todo");
const nameComleted = document.querySelector(".comleted");
const currentTasks = document.getElementById("currentTasks");
const completedTasks = document.getElementById("completedTasks");
const countCompletedTasks = completedTasks.getElementsByTagName("li");
const countCurrentTasks = currentTasks.getElementsByTagName("li");
const fieldset = document.querySelector("fieldset");
const inputRadio = fieldset.querySelectorAll("input");

const taskTemplate = document.querySelector("#task-template").content;
const newItemTemplate = taskTemplate.querySelector(".list-group-item");

// let countTitle = document.createElement("span");
// let addCount = function(List, ListCollection){
//     const count = countTitle.cloneNode(true);
//     List.append(count);
//     count.textContent = ListCollection.length > 0 ? ` (${ListCollection.length})` : ""; 
//     console.log(ListCollection.length);
// }


const TodoList = {
    ToDo: [
        {
            title: "hello", 
            text: "hey", 
            priority: "Low", 
            date: new Date(), 
            comleted: false
        },
        {
            title: "New", 
            text: "hey", 
            priority: "Middle",
            date: new Date(2020, 8, 12, 14, 12),  
            comleted: false
        }
    ],
    Comleted: [
        {
            title: "Read", 
            text: "Read book about JS", 
            priority: "Middle",
            date: new Date(2020, 8, 12, 19, 12),  
            comleted: false
        },
        {
            title: "Walk", 
            text: "Walk on the park", 
            priority: "Middle",
            date: new Date(2020, 8, 14, 10, 30),  
            comleted: false
        },
        {
            title: "Car", 
            text: "Fix a car", 
            priority: "Low",
            date: new Date(2020, 8, 10, 12, 30),  
            comleted: false
        }
        
    ]
}

const setLocalStorage =  function(TodoList) {
    localStorage.setItem("TodoList", JSON.stringify(TodoList));
    console.log(JSON.stringify(TodoList));
}

const getLocalStorage = function() {
    let todolistLocalStorage = localStorage.getItem("TodoList")
    if(todolistLocalStorage) {
        return JSON.parse(todolistLocalStorage);
    }
    return null;
    
}

let getStorage =  getLocalStorage() ? getLocalStorage().ToDo : null;


function createTime(date) {
    function times(time) {
        return time < 10 ? `0${time}` : time;
    }
    let time = `${times(date.getHours())}:${times(date.getMinutes())}`;
    let dates = `${times(date.getDate())}.${times(date.getMonth() + 1)}.${date.getFullYear()}`;
    return `${time} ${dates}`       
}

function renderTask(TodoList, ListCollection) {
    TodoList.map(function(task){
    
        const tasks = newItemTemplate.cloneNode(true);
    
        const taskDescription = tasks.querySelector("h5");
        taskDescription.textContent = task.title;
    
        const taskPriority = tasks.querySelector(".priority");
        taskPriority.textContent = `${task.priority} priority`;
    
        const taskDate = tasks.querySelector(".date");
        taskDate.textContent = task.date;
    
        const tasksText = tasks.querySelector("p");
        tasksText.textContent = task.text;
        
        ListCollection.append(tasks);
        
    })
    //addCount(ListName, ListCollection.children);
}

renderTask(TodoList.ToDo, currentTasks);
renderTask(TodoList.Comleted, completedTasks);

function sortList(state, List, direction){
    let sortDown;
    switch(direction){
        case DOWN:
            sortDown = state.sort((a, b) => b.date - a.date);
            break;
        case UP:
            sortDown = state.sort((a, b) => a.date - b.date);
            break;
        default: 
            return 0;
    }
    List.innerHTML = "";
    renderTask(sortDown, List);
    console.log("sort");
}

const DOWN = "SORT_DOWN";
const UP = "SORT_UP"

numberDown.addEventListener("click", () => sortList(TodoList.Comleted, completedTasks, DOWN));
numberUp.addEventListener("click", () => sortList(TodoList.Comleted, completedTasks, UP));
numberDown.addEventListener("click", () => sortList(TodoList.ToDo, currentTasks, DOWN));
numberUp.addEventListener("click", () => sortList(TodoList.ToDo, currentTasks, UP));



function addTask(title, text, priority, date) {
    const tasks = newItemTemplate.cloneNode(true);
    
    const task = {title, text, priority, date, comleted: false}

    TodoList.ToDo = [...TodoList.ToDo, task];
    TodoList.ToDo.map(function(task){

        const taskDescription = tasks.querySelector("h5");
        taskDescription.textContent = task.title;

        const taskPriority = tasks.querySelector(".priority");
        taskPriority.textContent = `${task.priority} priority`;

        const taskDate = tasks.querySelector(".date");
        taskDate.textContent = createTime(date);

        const tasksText = tasks.querySelector("p");
        tasksText.textContent = task.text;
        currentTasks.appendChild(tasks);
    });

    
    titleTask.value = "";
    textTask.value = "";
    setLocalStorage(TodoList);
}

newItemForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let priority = "";
    const date = new Date();

    for(let i = 0; i < inputRadio.length; i++){
        inputRadio[i].checked ? priority = inputRadio[i].value : priority;
    }
    
    addTask(titleTask.value, textTask.value, priority, date);

})
