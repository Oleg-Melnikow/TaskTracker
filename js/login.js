const login = document.getElementById("login");
const userEmail = document.getElementById("email");
const password = document.getElementById("password");
const submitBtn = document.querySelector("button[type=submit]");
console.log(submitBtn)

function someUser(input){
    const feedback = input.nextElementSibling;
    input.addEventListener("blur", function(){
        const findUser = localStorage.getItem("Users") ? JSON.parse(localStorage.getItem("Users")) : null;
        if(!findUser || (findUser && !findUser.some(user => user.email === input.value) && input.value !== "")){
                submitBtn.disabled = true
                feedback.textContent = "This email not exists, please follow register"
                feedback.style.display = "block"
            }
        //console.log(findUser.some(user => user.email === input.value))
    })
    input.addEventListener("focus", function(){
        submitBtn.disabled = false;
        feedback.style.display = "none"
    })
}

someUser(userEmail)

login.addEventListener("submit", function(evt){
    evt.preventDefault()
    console.log(userEmail.value, password.value);
    const findUser = JSON.parse(localStorage.getItem("Users"));
    let user = findUser.find(user => user.email === userEmail.value)
        if(user.password === password.value){
            console.log("login success!")
            const users = {email: userEmail.value, password: password.value}
            localStorage.setItem("Login", JSON.stringify(users));
            document.location.href ="todo.html"
        } else {
            console.log("enter correct password");
            password.value = ""
        }
})