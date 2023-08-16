document.querySelector('#logout').addEventListener('click', onLogoutClick);
document.querySelector('#save-profile').addEventListener('click', onSaveClick);
document.querySelector('#save-password').addEventListener('click', onSavePasswordClick);
document.querySelector('#add-device').addEventListener('click', onAddProductClick);

document.getElementById('email').value = localStorage.getItem('email')

async function onLogoutClick() {
    axios.post('http://localhost:5000/api/user/logout')
        .then(response => {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            window.location.href = 'authorization.html';
        })
        .catch(error => {
            console.error(error.response.data.message);
        });
}

async function onSaveClick() {
    event.preventDefault()
    const email = document.querySelector('#email').value;
    const newName = document.querySelector('#name').value;
    const newSurname = document.querySelector('#surname').value;
    if (newName === '' || newSurname === '') document.getElementById('error-name').innerHTML = `Ошибка`
    else await updateNameAndSurname(email, newName, newSurname);
}

async function updateNameAndSurname(email, name, surname) {
    try {
        const response = await axios.put(`http://localhost:5000/api/user/updateName`, {
            email: email,
            name: name,
            surname: surname
        });
        document.getElementById('error-name').innerHTML = `Успешно`
    } catch (error) {
        console.error(error);
        document.getElementById('error-name').innerHTML = `Ошибка`
    }
}

async function onSavePasswordClick() {
    event.preventDefault();
    //const password = jwt.decode(localStorage.getItem('password')).password;
    if (document.getElementById('oldpassword').value !== localStorage.getItem('password'))
        document.getElementById('error-message').innerHTML = `Неверный пароль`
    else {
        document.getElementById('error-message').innerHTML = ``
        if (document.getElementById('newpassword').value !== document.getElementById('newpassword1').value)
            document.getElementById('error-message-new-password').innerHTML = `Пароли не совпадают`
        else {
            document.getElementById('error-message-new-password').innerHTML = ``
            await updatePassword(document.querySelector('#email').value, document.getElementById('newpassword').value);
        }
    }
}

async function updatePassword(email, password) {
    try {
        const response = await axios.put(`http://localhost:5000/api/user/updatePassword`, {
            email: email,
            password: password
        });
        localStorage.setItem('password', password)
        document.getElementById('error-message-new-password').innerHTML = `Успешно`
    } catch (error) {
        console.error(error);
        document.getElementById('error-message-new-password').innerHTML = `Ошибка`
    }
}

async function onAddProductClick() {
    event.preventDefault()
    let nameDevice = document.getElementById('nameDevice')
    let priceDevice = document.getElementById('priceDevice')
    let makerDevice = document.getElementById('select-maker')
    let typeDevice = document.getElementById('select-type')
    let descriptionDevice = document.getElementById('product-description')
    let imgDevice = document.getElementById('imgDevice')
    let formData = new FormData();
    formData.append('name', nameDevice.value);
    formData.append('price', priceDevice.value);
    formData.append('brandId', makerDevice.value);
    formData.append('typeId', typeDevice.value);
    formData.append('info', descriptionDevice.value);
    console.log(descriptionDevice.value)
    formData.append('img', imgDevice.files[0]);

    axios.post('http://localhost:5000/api/device/create', formData)
        .then(response => {
            document.getElementById('error-message-new-device').innerHTML = `Успешно`
        })
        .catch(error => {
            document.getElementById('error-message-new-device').innerHTML = `Ошибка`
            console.error(error.response.data.message);
        });
}

window.onload = function () {
    event.preventDefault()
    document.getElementById("profile-catalog__form").style.display = "none";
    let email = localStorage.getItem('email')
    let password = localStorage.getItem('password')
    if (email && password) {
        axios.get('http://localhost:5000/api/user/info', {params: {email: email, password: password}})
            .then(response => {
                document.getElementById('name').value = response.data.data.name
                document.getElementById('surname').value = response.data.data.surname
                localStorage.setItem('role', response.data.data.role)
                if (response.data.data.img)
                    document.getElementById('avatar-img').style.backgroundImage = `url(../js/static/${response.data.data.img})`
                let bar = `
                        <ul class="profile__nav profile-list">
                            <li ><a onclick="openTab(event, 'info')">
                            <h2 class="profile-guard__heading">Информация</h2></a>
                            </li>
                        </ul>`;
                if (localStorage.getItem('role') === 'ADMIN') {
                    bar = `
            <ul class="profile__nav profile-list">
                <li class="profile-list__item active"><a onclick="openTab(event, 'info')"
                    class="profile-list__link">Информация</a>
                </li>
                <li class="profile-list__item"><a onclick="openTab(event, 'catalog')"
                    class="profile-list__link">Каталог</a>
                </li>
            </ul>`;
                }
                const statusBar = document.getElementById("status-bar");
                statusBar.innerHTML = bar;
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.response.data.message);
                } else {
                    console.error(error.message);
                }
            })
        axios.get('http://localhost:5000/api/brand/getAll')
            .then(response => {
                let selectMaker = document.getElementById('select-maker')
                const data = response.data;
                data.forEach(manufacturer => {
                    const option = document.createElement('option');
                    option.value = manufacturer.id;
                    option.text = manufacturer.name;
                    selectMaker.appendChild(option);
                });
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.message);
                } else {
                    console.error(error.message);
                }
            });
        axios.get('http://localhost:5000/api/type/getAll')
            .then(response => {
                let selectMaker = document.getElementById('select-type')
                const data = response.data;
                data.forEach(manufacturer => {
                    const option = document.createElement('option');
                    option.value = manufacturer.id;
                    option.text = manufacturer.name;
                    selectMaker.appendChild(option);
                });
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.message);
                } else {
                    console.error(error.message);
                }
            });
    } else {
        console.error('Email or password is missing')
    }
};

const avatarUpload = document.querySelector('#avatar-upload');

avatarUpload.addEventListener('change', async (event) => {
    const email = localStorage.getItem('email');
    const file = avatarUpload.files[0];
    const formData = new FormData();
    formData.append('img', file);
    formData.append('email', email);

    axios.put('http://localhost:5000/api/user/updateUserAvatar', formData, {})
        .then(response => {
        const avatarImg = document.querySelector('.avatar__img');
        avatarImg.style.backgroundImage = `url(../js/static/${response.data.data.img})`;
    }).catch(error => {
        console.error(error);
    });
});

const showBtn = document.getElementById('show-device');
showBtn.addEventListener('click', showDevice);

const showOrderBtn = document.getElementById('show-order');
showOrderBtn.addEventListener('click', showOrder);

const showMyOrderBtn = document.getElementById('my-order-modal');
showMyOrderBtn.addEventListener('click', showMyOrder);

const modal = document.getElementById('modal');
const modalOrder = document.getElementById('modal-order');
const modalMyOrder = document.getElementById('my-order-id');
const modalCloseBtn = modal.querySelector('.close');
const modalOrderCloseBtn = modalOrder.querySelector('.close');
const modalMyOrderCloseBtn = modalMyOrder.querySelector('.close');
const deviceTable = document.getElementById('device-table');
const orderTable = document.getElementById('order-table');
const myOrderTable = document.getElementById('my-order-table');
const tableHeadings = deviceTable.querySelectorAll('th');
const orderTableHeadings = orderTable.querySelectorAll('th');
const myOrderTableHeadings = myOrderTable.querySelectorAll('th');

function generateTableRows() {
    axios.get('http://localhost:5000/api/device/getAll')
        .then(function (response) {
            let devices = response.data.rows
            const rows = devices.map(device => {
                return `
          <tr>
            <td>${device.id}</td>
            <td>${device.brand.name}</td>
            <td>${device.type.name}</td>
            <td class="editable-cell">${device.name}</td>
            <td>${device.price}</td>
            <td><a style="color: red;" href="#" class="edit-link"><u>Изменить</u></a></td>
            <td><a style="color: red;" href="#" class="delete-link"><u>Удалить</u></a></td>
            <td><a style="color: red;" href="#" class="save-link"><u>Сохранить</u></a></td>
          </tr>
        `;
            });
            deviceTable.querySelector('tbody').innerHTML = rows.join('');
            attachEditLinkHandlers();
            attachDeleteLinkHandlers();
            attachSaveLinkHandlers();
            attachSortingEventListeners();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function generateTableOrderRows() {
    axios.get('http://localhost:5000/api/order/getAll')
        .then(function (response) {
            let orders = response.data
            const rows = orders.map(order => {
                let isDelivered
                if (order.order.isDelivered === false) isDelivered = 'Не доставлен'
                else isDelivered = 'Доставлен'
                const devices = order.order.orderItems ? order.order.orderItems.map(orderItem =>
                    orderItem.device.type.name + ' ' + orderItem.device.brand.name + ' ' + orderItem.device.name +
                    '(' + orderItem.quantity + ')').join('<br>') : '';
                return `
          <tr>
            <td>${order.order.id}</td>
            <td>${order.order.email}</td>
            <td>${order.order.town}</td>
            <td >${devices}</td>
            <td class="delivery-cell">${isDelivered}</td>
            <td><a style="color: red;" href="#" class="delete-link-order"><u>Удалить</u></a></td>
            <td><a style="color: red;" href="#" class="delivery-link"><u>Доставлен</u></a></td>
          </tr>
        `;
            });
            orderTable.querySelector('tbody').innerHTML = rows.join('');
            attachDeleteOrderLinkHandlers();
            attachDeliveredOrderLinkHandlers();
            attachOrderSortingEventListeners();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function generateTableMyOrderRows() {
    let email = localStorage.getItem('email');
    axios.get('http://localhost:5000/api/order/getOne', {params: {email: email}})
        .then(function (response) {
            let order = response.data;
            let isDelivered
            if (order.isDelivered === false) isDelivered = 'Не доставлен'
            else isDelivered = 'Доставлен'
            const devices = order.orderItems ? order.orderItems.map(orderItem =>
                orderItem.device.type.name + ' ' + orderItem.device.brand.name + ' ' + orderItem.device.name +
                '(' + orderItem.quantity + ')').join('<br>') : '';
            myOrderTable.querySelector('tbody').innerHTML = `
            <tr> 
            <td>${order.id}</td> 
            <td>${order.email}</td> 
            <td>${order.town}</td> 
            <td>${devices}</td> 
            <td>${isDelivered}</td> 
            <td><a style="color: red;" href="#" class="delete-link-order"><u>Отменить</u></a></td> 
            </tr> `;
            attachDeleteOrderLinkHandlers();
            attachMyOrderSortingEventListeners();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function attachEditLinkHandlers() {
    const editLinks = deviceTable.querySelectorAll('.edit-link');
    editLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const row = this.parentNode.parentNode;
            const nameCell = row.querySelector('.editable-cell');
            enableEditCell(nameCell);
        });
    });
}

function enableEditCell(cell) {
    const text = cell.innerText;
    const input = document.createElement('input');
    input.style.fontSize = '30px';
    input.value = text;
    input.classList.add('edit-input');

    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            disableEditCell(cell, input.value);
        }
    });

    cell.innerHTML = '';
    cell.appendChild(input);
    input.focus();
}

function disableEditCell(cell, value) {
    cell.innerHTML = value;
}

function showDevice(event) {
    event.preventDefault();
    modal.style.display = 'block';
    generateTableRows();
}

function showOrder(event) {
    event.preventDefault();
    modalOrder.style.display = 'block';
    generateTableOrderRows();
}

function showMyOrder(event) {
    event.preventDefault();
    modalMyOrder.style.display = 'block';
    generateTableMyOrderRows();
}

modalCloseBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});

modalOrderCloseBtn.addEventListener('click', function () {
    modalOrder.style.display = 'none';
});

modalMyOrderCloseBtn.addEventListener('click', function () {
    modalMyOrder.style.display = 'none';
});

function attachSortingEventListeners() {
    tableHeadings.forEach(heading => {
        heading.addEventListener('click', function () {
            const column = this.getAttribute('data-column');
            const rows = Array.from(deviceTable.querySelectorAll('tbody tr'));

            rows.sort((a, b) => {
                const aValueElement = a.querySelector(`td[data-column="${column}"]`);
                const aValue = aValueElement ? aValueElement.innerText : '';
                const bValueElement = b.querySelector(`td[data-column="${column}"]`);
                const bValue = bValueElement ? bValueElement.innerText : '';

                return aValue.localeCompare(bValue);
            });

            const tbody = deviceTable.querySelector('tbody');
            rows.forEach(row => {
                tbody.appendChild(row);
            });
        });
    });
}

function attachOrderSortingEventListeners() {
    orderTableHeadings.forEach(heading => {
        heading.addEventListener('click', function () {
            const column = this.getAttribute('data-column');
            const rows = Array.from(orderTable.querySelectorAll('tbody tr'));
            rows.sort((a, b) => {
                const aValueElement = a.querySelector(`td[data-column="${column}"]`);
                const aValue = aValueElement ? aValueElement.innerText : '';
                const bValueElement = b.querySelector(`td[data-column="${column}"]`);
                const bValue = bValueElement ? bValueElement.innerText : '';
                return aValue.localeCompare(bValue);
            });
            orderTable.querySelectorAll('tbody tr').forEach(row => row.remove());
            rows.forEach(row => {
                orderTable.querySelector('tbody').appendChild(row);
            });
        });
    });
}

function attachMyOrderSortingEventListeners() {
    myOrderTableHeadings.forEach(heading => {
        heading.addEventListener('click', function () {
            const column = this.getAttribute('data-column');
            const rows = Array.from(myOrderTable.querySelectorAll('tbody tr'));
            rows.sort((a, b) => {
                const aValueElement = a.querySelector(`td[data-column="${column}"]`);
                const aValue = aValueElement ? aValueElement.innerText : '';
                const bValueElement = b.querySelector(`td[data-column="${column}"]`);
                const bValue = bValueElement ? bValueElement.innerText : '';
                return aValue.localeCompare(bValue);
            });
            myOrderTable.querySelectorAll('tbody tr').forEach(row => row.remove());
            rows.forEach(row => {
                myOrderTable.querySelector('tbody').appendChild(row);
            });
        });
    });
}

function attachDeleteLinkHandlers() {
    const deleteLinks = document.querySelectorAll('.delete-link');
    deleteLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const row = this.closest('tr');
            const firstCell = row.querySelector('td:first-child');
            let id = firstCell.innerText;
            row.remove();
            axios.post(`http://localhost:5000/api/device/delete`, {id: id})
                .then(response => {
                }).catch(error => {
                console.error(error);
            });
        });
    });
}

function attachDeleteOrderLinkHandlers() {
    const deleteLinks = document.querySelectorAll('.delete-link-order');
    deleteLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const row = this.closest('tr');
            const firstCell = row.querySelector('td:first-child');
            let id = firstCell.innerText;
            row.remove();
            axios.post(`http://localhost:5000/api/order/deleteOrder`, {id: id})
                .then(response => {
                }).catch(error => {
                console.error(error);
            });
        });
    });
}

function attachSaveLinkHandlers() {
    const saveLinks = document.querySelectorAll('.save-link');
    saveLinks.forEach(link => {
        link.addEventListener('click', async function (event) {
            event.preventDefault();
            const row = this.closest('tr');
            const firstCell = row.querySelector('td:first-child');
            let id = firstCell.innerText;
            const fourthCell = row.querySelector('td.editable-cell');
            const name = fourthCell.innerText;
            axios.post(`http://localhost:5000/api/device/update`, {id: id, name: name})
                .then(response => {
                }).catch(error => {
                console.error(error);
            });
        });
    });
}

function attachDeliveredOrderLinkHandlers() {
    const saveLinks = document.querySelectorAll('.delivery-link');
    saveLinks.forEach(link => {
        link.addEventListener('click', async function (event) {
            event.preventDefault();
            const row = this.closest('tr');
            const firstCell = row.querySelector('td:first-child');
            let id = firstCell.innerText;
            const fifthCell = row.querySelector('td.delivery-cell');
            axios.post(`http://localhost:5000/api/order/delivered`, {id: id})
                .then(response => {
                    fifthCell.innerText = 'Доставлен'
                }).catch(error => {
                console.error(error);
            });
        });
    });
}