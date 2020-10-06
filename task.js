const newItemForm = document.getElementById("add-form");
const titleTask = document.getElementById("inputTitle");
const textTask = document.getElementById("inputText");

const numberUp = document.getElementById("number-up");
const numberDown = document.getElementById("number-down");

const nameTodo = document.querySelector(".todo");
const nameCompleted = document.querySelector(".completed");
const currentTasks = document.getElementById("currentTasks");
const completedTasks = document.getElementById("completedTasks");
const fieldset = document.querySelector("fieldset");
const inputRadio = fieldset.querySelectorAll("input");

const taskTemplate = document.querySelector("#task-template").content;
const newItemTemplate = taskTemplate.querySelector(".list-group-item");

const exampleModal = document.querySelector(".modal");

const TODO = "ToDo";
const COMPLETED = "Completed";
const DOWN = "SORT_DOWN";
const UP = "SORT_UP";

let TodoList = {ToDo: [], Completed: []}

let countTasks = document.createElement("span");

let addCount = function(List){
    const count = countTasks.cloneNode(true);
    List.append(count);
}
addCount(nameTodo);
addCount(nameCompleted);

function closeModal(modal){
    modal.classList.remove("mod");
    modal.style.display = "none";
    modal.areaModal = "false";
}

const setLocalStorage = function (key, value) {
    localStorage.setItem(`${key}`, JSON.stringify(value));
}

const getLocalStorage = function () {
    let todolistLocalStorage = localStorage.getItem("TodoList")
    if (todolistLocalStorage) {
        return JSON.parse(todolistLocalStorage);
    }
    return todolistLocalStorage
}

let getStorageToDo = getLocalStorage() ? getLocalStorage(): null;
let getStorageCompleted = getLocalStorage() ? getLocalStorage() : null

function createTime(date) {
    function times(time) {
        return time < 10 ? `0${time}` : time;
    }

    let time = `${times(date.getHours())}:${times(date.getMinutes())}:${times(date.getSeconds())}`;
    let dates = `${times(date.getDate())}.${times(date.getMonth() + 1)}.${date.getFullYear()}`;
    return `${time} ${dates}`
}

let deleteTask = function (id, TodoList, ListCollection, nameList) {
    const tasks = {
        ...getLocalStorage(),
        [nameList]: TodoList[nameList].filter(task => task.id !== id)
    };
    setLocalStorage("TodoList", tasks);
    renderTask(getLocalStorage(), ListCollection, nameList);
}

let completeTask = function (id, task, todoList, ListCollection, nameList) {
    TodoList = getLocalStorage();
    TodoList.Completed = [...TodoList.Completed, task];
    setLocalStorage("TodoList", TodoList);
    deleteTask(id, todoList, ListCollection, nameList);
    renderTask(getLocalStorage(), completedTasks, COMPLETED);
}

let editTask = function (id, task, TodoList, ListCollection, nameList){

    const modalContent = exampleModal.querySelector(".modal-content");
    const modal = modalContent.cloneNode(true);
    modal.classList.remove("modal-content");
    modal.classList.add("mod");
    const editTaskBtn = modal.querySelector("button[type=submit]");
    const inputTitle = modal.querySelector("#inputTitle");
    const inputText = modal.querySelector("#inputText");
    const fieldset = modal.querySelector("fieldset");
    const inputRadio = fieldset.querySelectorAll("input");

    for(let input of inputRadio){
        input.value === task.priority ?  input.checked = true : input.checked = false;
    }

    inputTitle.value = task.title;
    inputText.value = task.text;
    editTaskBtn.textContent = "Edit task";
    document.body.append(modal);

    const closeBtn = modal.querySelector(".close");
    const secondaryBtn = modal.querySelector(".btn-secondary");
    closeBtn.addEventListener("click", () => closeModal(modal));
    secondaryBtn.addEventListener("click", () => closeModal(modal));

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Escape') {
            closeModal(modal);
        }
    });

    editTaskBtn.addEventListener("click", function (e){
        e.preventDefault();
        let priority = 0;
        for(let input of inputRadio){
            input.checked ? priority = input.value : priority;
        }

        task.title = inputTitle.value;
        task.text = inputText.value;
        task.priority = priority;

        const tasks = {
            ...getLocalStorage(),
            [nameList]: TodoList[nameList].map(t => {
                if(t.id === id){
                    return {...t, ...task}
                } else return t
            })
        }
        setLocalStorage("TodoList", tasks);
        renderTask(getLocalStorage(), ListCollection, nameList);
        closeModal(modal);
    })
}

function renderTask(TodoList, ListCollection, nameList) {
    ListCollection.innerHTML = "";
    TodoList[nameList].map(function (task) {
        switch (task.priority){
            case "Low": task.color = "green"; break;
            case "Medium": task.color = "yellow"; break;
            case "High": task.color = "red"; break;
            default: return 0;
        }
        const tasks = newItemTemplate.cloneNode(true);
        tasks.style.backgroundColor = task.color;
        const taskDescription = tasks.querySelector("h5");
        taskDescription.textContent = task.title;
        const taskPriority = tasks.querySelector(".priority");
        taskPriority.textContent = `${task.priority} priority`;
        const taskDate = tasks.querySelector(".date");
        taskDate.textContent = task.date;
        const tasksText = tasks.querySelector("p");
        tasksText.textContent = task.text;
        ListCollection.append(tasks);

        const deleteBtn = tasks.querySelector(".btn-danger");
        const successBtn = tasks.querySelector(".btn-success");
        const editBtn = tasks.querySelector(".btn-info");
        if(nameList === COMPLETED) {
            editBtn.disabled = "disabled";
            successBtn.style.display = "none";
        }

        deleteBtn.addEventListener("click", function () {
            deleteTask(task.id, TodoList, ListCollection, nameList);
        })
        successBtn.addEventListener("click", function () {
            completeTask(task.id, task, TodoList, ListCollection, nameList);
        })
        editBtn.addEventListener("click", function (){
            editTask(task.id, task, TodoList, ListCollection, nameList)
        })
    })
    if(nameList === TODO){
        let countCurrentTasks = currentTasks.getElementsByTagName("li");
        nameTodo.querySelector("span").textContent = ` (${countCurrentTasks.length})`
    } else {
        let countCompletedTasks = completedTasks.getElementsByTagName("li");
        nameCompleted.querySelector("span").textContent = ` (${countCompletedTasks.length})`
    }
}

renderTask(getStorageToDo || TodoList, currentTasks, TODO);
renderTask(getStorageCompleted || TodoList, completedTasks, COMPLETED);

function sortList(state, List, direction, nameList) {
    let sortDown;
    switch (direction) {
        case DOWN:
            sortDown = state[nameList].sort((a, b) => Date.parse(b.dates) - Date.parse(a.dates));
            break;
        case UP:
            sortDown = state[nameList].sort((a, b) => Date.parse(a.dates) - Date.parse(b.dates));
            break;
        default:
            return 0;
    }
    List.innerHTML = "";
    TodoList = getLocalStorage();
    TodoList[nameList] = sortDown;
    setLocalStorage("TodoList", TodoList);
    renderTask(getLocalStorage(), List, nameList);
}

numberDown.addEventListener("click", () => sortList(getLocalStorage() || TodoList, currentTasks, DOWN, TODO));
numberUp.addEventListener("click", () => sortList(getLocalStorage() || TodoList, currentTasks, UP, TODO));
numberDown.addEventListener("click", () => sortList(getLocalStorage() || TodoList, completedTasks, DOWN, COMPLETED));
numberUp.addEventListener("click", () => sortList(getLocalStorage() || TodoList, completedTasks, UP, COMPLETED));

function addTask(title, text, priority, date) {
    const task = {
        id: +date,
        title, text, priority,
        date: createTime(date),
        dates: date, color : null
    }

    if (localStorage.getItem("TodoList") === null) {
        setLocalStorage("TodoList", TodoList);
        TodoList = getLocalStorage();
        TodoList.ToDo = [...TodoList.ToDo, task];
        setLocalStorage("TodoList", TodoList);
    } else {
        TodoList = getLocalStorage();
        TodoList.ToDo = [...TodoList.ToDo, task];
        setLocalStorage("TodoList", TodoList);
    }

    renderTask(getLocalStorage(), currentTasks, TODO);

}

newItemForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let priority = "";

    for(let input of inputRadio){
        input.checked ? priority = input.value : priority;
    }

    exampleModal.classList.remove("show");
    exampleModal.style = null;
    exampleModal.setAttribute("style", "none");
    exampleModal.ariaModal = null;
    exampleModal.ariaHidden = "true";
    document.querySelector(".modal-backdrop").remove();
    document.body.style = null;

    addTask(titleTask.value, textTask.value, priority, new Date());

    document.getElementById("add-form").reset();
})

const closeBtn = document.querySelector(".close");
const secondaryBtn = document.querySelector(".btn-secondary");

function resetForm(button) {
    button.addEventListener("click", function (){
        document.getElementById("add-form").reset();
    })
}
resetForm(closeBtn);
resetForm(secondaryBtn);