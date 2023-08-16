const buttons = document.querySelectorAll('.product-catalog__btn');
const productsNames = document.querySelectorAll('.product-catalog__link');
const notificationElement = document.getElementById('notification');
const notificationTextElement = document.getElementById('notification-text');

const urlParams = new URLSearchParams(window.location.search);
let category = urlParams.get('category');

if (category == null) category = localStorage.getItem('category')

localStorage.setItem('category', category);

const page = document.getElementById('pageCatalog');
const title = document.getElementById('title');
title.textContent = category
page.textContent = category

if (category === 'Процессоры')              category = '1';
else if (category === 'Материнские платы')  category = '2';
else if (category === 'Видеокарты')         category = '3';
else if (category === 'Оперативная память') category = '4';
else if (category === 'Охлаждение')         category = '5';
else if (category === 'Жесткие диски')      category = '6';
else if (category === 'Накопители')         category = '7';
else if (category === 'Блоки питания')      category = '8';
else if (category === 'Звуковые карты')     category = '9';
else if (category === 'Корпуса')            category = '10';


function loadProductsWithTypeAndBrand(brandId, typeId) {
    let products
    const url = `http://localhost:5000/api/device/getAll?brandId=${brandId}&typeId=${typeId}`;
    axios.get(url)
        .then(function (response) {
            products = response.data.rows;
            const productCatalog = document.querySelector('.catalog-product__items')
            if (products.length === 0) {
                let pagination = document.querySelector('.catalog-product__pagination')
                pagination.style.display = 'none';
                let items = document.querySelector('.catalog-product__items')
                items.style.display = 'none';
                let text = document.querySelector('.catalog-product__text')
                text.style.display = 'block';
            } else {
                for (let i = 0; i < products.length; i++) {
                    const product = products[i];
                    const productElement = createProductElement(product);
                    productCatalog.appendChild(productElement);
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function loadProductsWithType() {
    let products
    axios.get('http://localhost:5000/api/device/getAll?typeId=' + category)
        .then(function (response) {
            products = response.data.rows;
            const productCatalog = document.querySelector('.catalog-product__items')
            if (products.length === 0) {
                let pagination = document.querySelector('.catalog-product__pagination')
                pagination.style.display = 'none';
                let items = document.querySelector('.catalog-product__items')
                items.style.display = 'none';
                let text = document.querySelector('.catalog-product__text')
                text.style.display = 'block';
            } else {
                for (let i = 0; i < products.length; i++) {
                    const product = products[i];
                    const productElement = createProductElement(product);
                    productCatalog.appendChild(productElement);
                    productCatalog.appendChild(document.createElement('br'))
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function showNotification(message) {
    notificationTextElement.textContent = message;
    notificationElement.classList.remove('hidden');
    notificationElement.classList.add('show');

    setTimeout(() => {
        notificationElement.classList.remove('show');
        notificationElement.classList.add('hidden');
    }, 3000);
}

function loadProductsWithBrand(brandId) {
    let products
    axios.get('http://localhost:5000/api/device/getAll?brandId=' + brandId)
        .then(function (response) {
            products = response.data.rows;
            const productCatalog = document.querySelector('.catalog-product__items')
            if (products.length === 0) {
                let pagination = document.querySelector('.catalog-product__pagination')
                pagination.style.display = 'none';
                let items = document.querySelector('.catalog-product__items')
                items.style.display = 'none';
                let text = document.querySelector('.catalog-product__text')
                text.style.display = 'block';
            } else {
                for (let i = 0; i < products.length; i++) {
                    const product = products[i];
                    const productElement = createProductElement(product);
                    productCatalog.appendChild(productElement);
                    productCatalog.appendChild(document.createElement('br'))
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

function createProductElement(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('product-catalog');

    const productLink = document.createElement('a');
    productLink.href = `../HTML/product.html?deviceId=${product.id}`;

    const productImg = document.createElement('img');
    productImg.classList.add('product-catalog__img');
    productImg.src = '../js/static/' + product.img;
    productImg.alt = product.name;
    productLink.appendChild(productImg);

    const productInfo = document.createElement('div');
    productInfo.classList.add('product-catalog__info');

    const productLeft = document.createElement('div');
    productLeft.classList.add('product-catalog__left');

    const productName = document.createElement('a');
    productName.classList.add('product-catalog__link');
    productName.href = `../HTML/product.html?deviceId=${product.id}`;
    productName.innerText = product.brand.name + ' ' + product.name;
    productLeft.appendChild(productName);

    productInfo.appendChild(productLeft);

    const productRight = document.createElement('div');
    productRight.classList.add('product-catalog__right');

    const productPrice = document.createElement('span');
    productPrice.classList.add('product-catalog__price');
    productPrice.innerText = product.price + ' BYN';
    productRight.appendChild(productPrice);

    const buyForm = document.createElement('form');
    buyForm.action = '#';

    const buyButton = document.createElement('button');
    buyButton.classList.add('product-catalog__btn');
    buyButton.type = 'submit';
    buyButton.innerText = 'Купить';

    buyForm.appendChild(buyButton);
    productRight.appendChild(buyForm);
    productInfo.appendChild(productRight);

    productElement.appendChild(productLink);
    productElement.appendChild(productInfo);

    buyButton.addEventListener('click', async function () {
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
    });

    return productElement;
}

document.addEventListener("DOMContentLoaded", function() {
    loadProductsWithType();
});