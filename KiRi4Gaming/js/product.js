let buyBtn = document.getElementById('buyDevice')

buyBtn.addEventListener('click', buyDevice)

const urlParams = new URLSearchParams(window.location.search);
let deviceId = urlParams.get('deviceId');

async function buyDevice() {
    event.preventDefault()
    const isAuth = await checkAuth();
    if (isAuth) {
        axios.post(`http://localhost:5000/api/basket/addDevice?id=${product.id}&email=${localStorage.getItem('email')}`)
            .then(function (response) {
                showNotification(response.data.message);
            })
            .catch(function (error) {
                console.log(error);
            });
    } else {
        window.location = '../HTML/authorization.html';
    }
}

window.onload = function() {
    let id = parseInt(deviceId, 10);
    axios.post('http://localhost:5000/api/device/showDevice', {
            deviceId: id })
        .then(response => {
            let {device, deviceInfo} = response.data
            console.log(device);
            console.log(deviceInfo);
            document.getElementById('price').textContent = device.price + ' BYN'
            document.getElementById('type').textContent = device.type.name
            document.getElementById('name').textContent = device.type.name + ' ' + device.brand.name + ' ' + device.name
            document.querySelector('#productName').textContent = device.type.name + ' ' + device.brand.name + ' ' + device.name
            document.getElementById('productImg').src = `../js/static/${device.img}`
            document.getElementById('description').textContent = deviceInfo.description
        })
        .catch(error => {
            if (error.response) {
                console.error(error.response.data.message);
            } else {
                console.error(error.message);
            }
        });
};