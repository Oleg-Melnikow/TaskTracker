const register = document.getElementById("register");
const userName = document.getElementById("name");
const userEmail = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.querySelector("button[type=submit]");

register.addEventListener("submit", function(evt){
    evt.preventDefault();
    console.log("register")
    const user = {
        name: userName.value,
        email: userEmail.value,
        password: password.value,
        TodoList: {ToDo: [], Completed: []}
    }
    if (localStorage.getItem("Users") === null){
        localStorage.setItem("Users", JSON.stringify([]))
    }
    let users = JSON.parse(localStorage.getItem("Users"))
    users = [...users, user]
    localStorage.setItem("Users", JSON.stringify(users))
    console.log(user)
    register.reset();
    document.location.href ="index.html"
})

function someUser(input){
    const feedback = input.nextElementSibling;
    input.addEventListener("blur", function(){
        const findUser = localStorage.getItem("Users") ? JSON.parse(localStorage.getItem("Users")) : null;
        if(findUser) for(user of findUser){
            if(user.email === input.value){
                console.log("That name exist", user.email)
                submitBtn.disabled = true
                feedback.textContent = "This email exists, please enter another Email"
                feedback.style.display = "block"
            }
        }
    })
    input.addEventListener("focus", function(){
        submitBtn.disabled = false;
        feedback.style.display = "none"
    })
}

someUser(userEmail)

