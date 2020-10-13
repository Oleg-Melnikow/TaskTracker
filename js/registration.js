const register = document.getElementById("register");
const userName = document.getElementById("name");
const userEmail = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.querySelector("button[type=submit]");
const getUser = localStorage.getItem("Users");

register.addEventListener("submit", function (evt) {
    evt.preventDefault();
    const user = {
        name: userName.value,
        email: userEmail.value,
        password: password.value,
        TodoList: {ToDo: [], Completed: []}
    }
    if (getUser === null) {
        localStorage.setItem("Users", JSON.stringify([]));
    }
    let users = JSON.parse(getUser);
    users = [...users, user];
    localStorage.setItem("Users", JSON.stringify(users));
    document.location.href = "index.html";
    register.reset();
})

function someUser(input) {
    const feedback = input.nextElementSibling;
    input.addEventListener("blur", function () {
        const findUser = getUser ? JSON.parse(getUser) : null;
        if (findUser) for (let user of findUser) {
            if (user.email === input.value) {
                submitBtn.disabled = true;
                feedback.textContent = "This email exists, please enter another Email";
                feedback.style.display = "block";
            }
        }
    })
    input.addEventListener("focus", function () {
        submitBtn.disabled = false;
        feedback.style.display = "none";
    })
}

someUser(userEmail);

