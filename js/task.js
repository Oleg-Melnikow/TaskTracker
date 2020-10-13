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
const listGroup = document.querySelectorAll(".list-group")
const logOut = document.getElementById("log-out");

const TODO = "ToDo";
const COMPLETED = "Completed";
const DOWN = "SORT_DOWN";
const UP = "SORT_UP";

let addCount = function (List) {
    const count = document.createElement("span");
    List.append(count);
}
addCount(nameTodo);
addCount(nameCompleted);

const setLocalStorage = function (key, value) {
    localStorage.setItem(`${key}`, JSON.stringify(value));
}

const getUsers = () => JSON.parse(localStorage.getItem("Users"));
const Login = () => JSON.parse(localStorage.getItem("Login"));
const getUser = () => getUsers().find(user => user.email === Login().email);
const getLocalStorage = () => getUser().TodoList;

let getTodolist = getLocalStorage() ? getLocalStorage() : null;

function createTime(date) {
    function times(time) {
        return time < 10 ? `0${time}` : time;
    }
    let time = `${times(date.getHours())}:${times(date.getMinutes())}:${times(date.getSeconds())}`;
    let dates = `${times(date.getDate())}.${times(date.getMonth() + 1)}.${date.getFullYear()}`;
    return `${time} ${dates}`
}

function setTodo(tasks) {
    const findUser = getUsers();
    findUser.find(user => user.email === Login().email).TodoList = tasks;
    setLocalStorage("Users", findUser);
}

let deleteTask = function (id, TodoList, ListCollection, nameList) {
    const tasks = {
        ...getLocalStorage(),
        [nameList]: TodoList[nameList].filter(task => task.id !== id)
    };
    setTodo(tasks);
    renderTask(getLocalStorage(), ListCollection, nameList);
}

let completeTask = function (id, task, todoList, ListCollection, nameList) {
    let TodoList = getLocalStorage();
    TodoList.Completed = [...TodoList.Completed, task];
    setTodo(TodoList);
    deleteTask(id, todoList, ListCollection, nameList);
    renderTask(getLocalStorage(), completedTasks, COMPLETED);
}

let editTask = function (id, task, TodoList, ListCollection, nameList) {
    const modal = exampleModal.cloneNode(true);
    modal.classList.add("show");
    modal.style.display = "block";
    const editTaskBtn = modal.querySelector("button[type=submit]");
    const inputTitle = modal.querySelector("#inputTitle");
    const inputText = modal.querySelector("#inputText");
    const fieldset = modal.querySelector("fieldset");
    const inputRadio = fieldset.querySelectorAll("input");

    for (let input of inputRadio) {
        input.value === task.priority ? input.checked = true : input.checked = false;
    }

    inputTitle.value = task.title;
    inputText.value = task.text;
    editTaskBtn.textContent = "Edit task";
    document.body.append(modal);

    const closeBtn = modal.querySelector(".close");
    const secondaryBtn = modal.querySelector(".btn-secondary");
    closeBtn.addEventListener("click", () => closeModal(modal));
    secondaryBtn.addEventListener("click", () => closeModal(modal));

    document.addEventListener('keydown', function (event) {
        if (event.code === 'Escape') {
            closeModal(modal);
        }
    });

    editTaskBtn.addEventListener("click", function (e) {
        e.preventDefault();
        let priority = 0;
        for (let input of inputRadio) {
            input.checked ? priority = input.value : priority;
        }

        task.title = inputTitle.value;
        task.text = inputText.value;
        task.priority = priority;

        const tasks = {
            ...getLocalStorage(),
            [nameList]: TodoList[nameList].map(t => {
                if (t.id === id) {
                    return {...t, ...task}
                } else return t
            })
        }
        setTodo(tasks);
        renderTask(getLocalStorage(), ListCollection, nameList);
        closeModal(modal);
    })
    function closeModal(modal) {
        modal.remove();
    }
}

function renderTask(TodoList, ListCollection, nameList) {
    ListCollection.innerHTML = "";
    TodoList[nameList].map(function (task) {
            switch (task.priority) {
                case "Low":
                    task.color = "green";
                    break;
                case "Medium":
                    task.color = "yellow";
                    break;
                case "High":
                    task.color = "red";
                    break;
                default:
                    return 0;
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
            if (nameList === COMPLETED) {
                editBtn.disabled = "disabled";
                successBtn.style.display = "none";
            }

            deleteBtn.addEventListener("click", function () {
                deleteTask(task.id, TodoList, ListCollection, nameList);
            })
            successBtn.addEventListener("click", function () {
                completeTask(task.id, task, TodoList, ListCollection, nameList);
            })
            editBtn.addEventListener("click", function () {
                editTask(task.id, task, TodoList, ListCollection, nameList)
            })

            /*const dragAndDrop = () => {
                tasks.addEventListener("dragstart", function (evt){
                    evt.target.classList.add("fade");
                    console.log("dragstart");

                })
                tasks.addEventListener("dragend", function (evt){
                    console.log("dragend");
                    evt.target.classList.remove("fade");
                })
            }
            dragAndDrop();*/
            /*tasks.onmousedown = function (evt) {
                let shiftX = evt.clientX - tasks.getBoundingClientRect().left;
                let shiftY = evt.clientY - tasks.getBoundingClientRect().top;
                tasks.style.width = "80%"
                tasks.style.cursor = "pointer"
                tasks.classList.remove("w-100")

                tasks.style.position = 'absolute';
                tasks.style.zIndex = "1000";
                document.body.append(tasks);
                moveAt(evt.pageX, evt.pageY);

                function moveAt(pageX, pageY) {
                    tasks.style.left = pageX - shiftX + 'px';
                    tasks.style.top = pageY - shiftY + 'px';
                }

                let currentDroppable = null;

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);

                    tasks.hidden = true;
                    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
                    tasks.hidden = false;

                    if (!elemBelow) return;

                    let droppableBelow = elemBelow.closest('.droppable');
                    console.log(droppableBelow)
                    if (currentDroppable !== droppableBelow) {
                        if (currentDroppable) {
                            // логика обработки процесса "вылета" из droppable (удаляем подсветку)
                            leaveDroppable(currentDroppable);
                        }
                        currentDroppable = droppableBelow;
                        if (currentDroppable) {
                            // логика обработки процесса, когда мы "влетаем" в элемент droppable
                            enterDroppable(currentDroppable);
                        }
                    }
                }

                document.addEventListener('mousemove', onMouseMove);

                tasks.onmouseup = function () {
                    document.removeEventListener('mousemove', onMouseMove);
                    tasks.onmouseup = null;
                };
            }

            function enterDroppable(elem) {
                elem.style.background = 'pink';
                console.log("ddd")
            }

            function leaveDroppable(elem) {
                elem.style.background = '';
            }

            tasks.ondragstart = function () {
                return false;
            };*/
        }
    )
    if (nameList === TODO) {
        let countCurrentTasks = currentTasks.getElementsByTagName("li");
        nameTodo.querySelector("span").textContent = ` (${countCurrentTasks.length})`;
    } else {
        let countCompletedTasks = completedTasks.getElementsByTagName("li");
        nameCompleted.querySelector("span").textContent = ` (${countCompletedTasks.length})`;
    }
}

renderTask(getTodolist, currentTasks, TODO);
renderTask(getTodolist, completedTasks, COMPLETED);

/*listGroup.forEach(list => {
    list.addEventListener("dragover",dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
})

function dragOver(evt) {
    evt.preventDefault();
}
function dragEnter(evt) {
    evt.preventDefault();
    this.classList.add("hovered");
}
function dragLeave(evt) {
    console.log("Leave")
    evt.preventDefault();
    this.classList.remove("hovered");
}
function setTask(tasks){
    console.log(tasks);
}
function dragDrop(tasks) {
    this.classList.remove("hovered");
    this.append(tasks);
    console.log("drop")
}*/

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
    let TodoList = getLocalStorage();
    TodoList[nameList] = sortDown;
    setTodo(TodoList);
    renderTask(getLocalStorage(), List, nameList);
}

numberDown.addEventListener("click", () => sortList(getLocalStorage(), currentTasks, DOWN, TODO));
numberUp.addEventListener("click", () => sortList(getLocalStorage(), currentTasks, UP, TODO));
numberDown.addEventListener("click", () => sortList(getLocalStorage(), completedTasks, DOWN, COMPLETED));
numberUp.addEventListener("click", () => sortList(getLocalStorage(), completedTasks, UP, COMPLETED));

function addTask(title, text, priority, date) {
    const task = {
        id: +date,
        title, text, priority,
        date: createTime(date),
        dates: date, color: null
    }
        let TodoList = getLocalStorage();
        TodoList.ToDo = [...TodoList.ToDo, task];
        const findUser = JSON.parse(localStorage.getItem("Users"));
        findUser.find(user => user.email === Login().email).TodoList = TodoList;
        const users = [...findUser]
        setLocalStorage("Users", users);

    renderTask(getLocalStorage(), currentTasks, TODO);
}

newItemForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let priority = "";

    for (let input of inputRadio) {
        input.checked ? priority = input.value : priority;
    }

    addTask(titleTask.value, textTask.value, priority, new Date());
    closeAddForm();
})

const closeBtn = document.querySelector(".close");
const secondaryBtn = document.getElementById("exit");

let resetForm = (button) => button.addEventListener("click", () => closeAddForm());

resetForm(closeBtn);
resetForm(secondaryBtn);

const openModal = document.getElementById("openModal");

openModal.addEventListener("click", function () {
    exampleModal.classList.add("show");
    exampleModal.style.display = "block";
    exampleModal.ariaModal = "true";
    exampleModal.ariaHidden = null;
    document.body.classList.add("modal-open");
    let backdrop = document.createElement("div");
    backdrop.classList.add("modal-backdrop");
    backdrop.classList.add("fade");
    backdrop.classList.add("show");
    document.body.append(backdrop);

})

function closeAddForm() {
    document.getElementById("add-form").reset();
    exampleModal.classList.remove("show");
    exampleModal.style.display = "none";
    exampleModal.style.paddingRight = null;
    exampleModal.ariaModal = null;
    exampleModal.ariaHidden = "true";
    document.body.classList.remove("modal-open");
    document.querySelector(".modal-backdrop").remove();
    document.body.style = null;
}

logOut.addEventListener("click", function (){
    localStorage.removeItem("Login");
    document.location.href ="index.html";
})