const regBtn = document.getElementById('reg-profile')

regBtn.addEventListener('click', reg)

let name;
let surname;
let email;

function reg() {
    document
        .getElementById('reg-form')
        .addEventListener('submit', regFormHandler, {once: true})
}

function regFormHandler(event) {
    event.preventDefault()

    name = event.target.querySelector('#name').value
    surname = event.target.querySelector('#surname').value
    email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value
    const password1 = event.target.querySelector('#password1').value

    if(password1 !== password){
        console.log("Пароли не совпадают")
    }else{
        console.log(name)
        console.log(surname)
        console.log(email)
        console.log(password)
        regWithEmailAndPassword(name, surname, email, password)
    }
}

function regWithEmailAndPassword(name, surname, email, password) {
    axios.post('http://localhost:5000/api/user/registration', { name, surname, email, password })
        .then(response => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            localStorage.setItem('role', response.data.role);
            window.location.href = 'profile.html';
        })
        .catch(error => {
            console.error(error.response.data.message);
        });
}