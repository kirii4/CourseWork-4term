window.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enter-profile');
    if (enterBtn) {
        enterBtn.addEventListener('click', enter);
    }
});
export let email, password;
function enter() {
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(event) {
    event.preventDefault()

    email = event.target.querySelector('#email').value
    password = event.target.querySelector('#password').value

    console.log(email)
    console.log(password)

    authWithEmailAndPassword(email, password)
}

function authWithEmailAndPassword(email, password) {
    let name, surname;
    axios.post('http://localhost:5000/api/user/login', {email, password })
        .then(response => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);
            window.location.href = 'profile.html';
        })
        .catch(error => {
            if (error.response) {
                const errorMessage = error.response.data.message;
                console.error(errorMessage);
                document.getElementById('error-message').innerHTML = errorMessage;
            } else {
                console.error(error.message);
                document.getElementById('error-message').innerHTML = 'При обработке вашего запроса произошла ошибка.';
            }
        });
}