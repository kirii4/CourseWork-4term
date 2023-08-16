const cartElement = document.querySelector('.cart-products__items');

if (cartElement) {
    cartElement.addEventListener('click', handleCartClick);
}
if (cartElement) {
    cartElement.addEventListener('input', handleCartInput);
}

window.onload = function addCartItem() {
    let products;
    axios.get('http://localhost:5000/api/user/getId', { params: { email: localStorage.getItem('email') } })
        .then(response => {
            let userId = response.data.id
            axios.get('http://localhost:5000/api/basket/getAll', { params: { userId: userId } })
                .then(response => {
                    products = response.data.rows
                    if (products.length === 0) {
                        let form = document.querySelector('.cart__form')
                        if (form) {
                            form.style.display = 'none';
                        }
                        let empty = document.querySelector('.cart__empty')
                        if (empty) {
                            empty.style.display = 'block';
                        }
                    } else {
                        const cartElement = document.querySelector(".cart-products__items");
                        let cartItems = {};
                        for (let i = 0; i < products.length; i++) {
                            let product = products[i]
                            if (cartItems[product.device.id]) {
                                cartItems[product.device.id].quantity++;
                            } else {
                                cartItems[product.device.id] = {
                                    product: product.device,
                                    quantity: 1
                                };
                            }
                        }
                        cartElement.innerHTML = '';
                        for (let itemId in cartItems) {
                            if (cartItems.hasOwnProperty(itemId)) {
                                cartElement.innerHTML += createCartItemElement(cartItems[itemId].product, cartItems[itemId].quantity);
                            }
                        }
                    }
                })
                .catch(error => {
                    if (error.response) {
                        console.error(error.response.data.message);
                    } else {
                        console.error(error.message);
                    }
                })
        })
        .catch(error => {
            if (error.response) {
                console.error(error.response.message);
            } else {
                console.error(error.message);
            }
        })
}

function createCartItemElement(product, quantity) {
    return `
        <div class="item-cart">
            <div class="item-cart__flex">
                <img class="item-cart__img" src="${"../js/static/" + product.img}" alt="photo">
            </div>
            <div class="item-cart__info">
                <div>
                    <span class="item-cart__span">${product.type.name}</span>
                    <span class="item-cart__span">${product.brand.name}</span>
                    <span class="item-cart__span">${product.name}</span>
                </div>
            </div>
            <div class="item-cart__grid">
                <span class="item-cart__span">В наличии</span>
                <span class="productId" style="display: none">${product.id}</span>
                <div class="item-cart__quantity quantity-item">
                    <button class="quantity-item__btn decrease-js" type="button" style="border-radius: 10px 0 0 10px;">-</button>
                    <input class="quantity-item__input" id="quantity-item__input" maxlength="2" value="${quantity}">
                    <button class="quantity-item__btn increase-js" type="button" style="border-radius: 0 10px 10px 0;">+</button>
                </div>
                <span class="item-cart__span-price">${product.price} BYN</span>
            </div>
            <button type="button" class="item-cart__btn">
                <svg class="item-cart__icon" width="20" height="24" viewBox="0 0 20 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                 <path
                 d="M10 1.51734e-08C10.96 -8.629e-05 11.8835 0.368002 12.5802 1.02844C13.2769 1.68888 13.6938 2.59137 13.745 3.55L13.75 3.75H19.25C19.44 3.75006 19.6229 3.82224 19.7618 3.95197C19.9006 4.0817 19.9851 4.2593 19.998 4.44888C20.011 4.63846 19.9515 4.82589 19.8316 4.9733C19.7117 5.12071 19.5402 5.2171 19.352 5.243L19.25 5.25H18.191L16.971 20.303C16.8949 21.2421 16.4681 22.1181 15.7754 22.7568C15.0828 23.3955 14.1752 23.7501 13.233 23.75H6.767C5.82484 23.7501 4.91719 23.3955 4.22457 22.7568C3.53195 22.1181 3.10513 21.2421 3.029 20.303L1.808 5.25H0.75C0.568762 5.24999 0.393658 5.18436 0.25707 5.06523C0.120481 4.94611 0.0316483 4.78155 0.00699997 4.602L0 4.5C7.6429e-06 4.31876 0.0656429 4.14366 0.184767 4.00707C0.303892 3.87048 0.468446 3.78165 0.648 3.757L0.75 3.75H6.25C6.25 2.75544 6.64509 1.80161 7.34835 1.09835C8.05161 0.395088 9.00544 1.51734e-08 10 1.51734e-08ZM16.687 5.25H3.313L4.524 20.182C4.56973 20.7454 4.82587 21.271 5.24148 21.6542C5.65709 22.0374 6.2017 22.2501 6.767 22.25H13.233C13.7983 22.2501 14.3429 22.0374 14.7585 21.6542C15.1741 21.271 15.4303 20.7454 15.476 20.182L16.686 5.25H16.687ZM7.75 9C7.93124 9.00001 8.10634 9.06564 8.24293 9.18477C8.37952 9.30389 8.46835 9.46845 8.493 9.648L8.5 9.75V17.75C8.49994 17.94 8.42776 18.1229 8.29803 18.2618C8.1683 18.4006 7.9907 18.4851 7.80112 18.498C7.61154 18.511 7.42411 18.4515 7.2767 18.3316C7.12929 18.2117 7.0329 18.0402 7.007 17.852L7 17.75V9.75C7 9.55109 7.07902 9.36032 7.21967 9.21967C7.36032 9.07902 7.55109 9 7.75 9ZM12.25 9C12.4312 9.00001 12.6063 9.06564 12.7429 9.18477C12.8795 9.30389 12.9684 9.46845 12.993 9.648L13 9.75V17.75C12.9999 17.94 12.9278 18.1229 12.798 18.2618C12.6683 18.4006 12.4907 18.4851 12.3011 18.498C12.1115 18.511 11.9241 18.4515 11.7767 18.3316C11.6293 18.2117 11.5329 18.0402 11.507 17.852L11.5 17.75V9.75C11.5 9.55109 11.579 9.36032 11.7197 9.21967C11.8603 9.07902 12.0511 9 12.25 9ZM10 1.5C9.42987 1.49993 8.88098 1.7163 8.46425 2.10537C8.04751 2.49444 7.79402 3.02721 7.755 3.596L7.75 3.75H12.25L12.245 3.596C12.206 3.02721 11.9525 2.49444 11.5358 2.10537C11.119 1.7163 10.5701 1.49993 10 1.5Z" />
                 </svg>
            </button>
        </div>
    `;
}
document.addEventListener('click', function(event) {
    if (event.target.closest('.item-cart__btn')) {
        removeCartItem(event.target.closest('.item-cart'));
    }
});

function removeCartItem(cartItem) {
    const productSpan = cartItem.querySelector('.productId');
    const id = productSpan.textContent;
    const email = localStorage.getItem('email')
    if (cartItem) {
        axios.delete('http://localhost:5000/api/basket/deleteDevice', { params: { id, email} })
            .then((response) => {
                cartItem.parentNode.removeChild(cartItem);
                updateCartTotal();
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

function handleCartClick(event) {
    if (event.target.classList.contains('decrease-js')) {
        decreaseQuantity(event.target);
    } else if (event.target.classList.contains('increase-js')) {
        increaseQuantity(event.target);
    }
}

function handleCartInput(event) {
    if (event.target.classList.contains('quantity-item__input')) {
        updateCartTotal();
    }
}

function decreaseQuantity(decreaseBtn) {
    const cartItem = decreaseBtn.closest('.item-cart');
    const quantityInput = cartItem.querySelector('.quantity-item__input');
    let currentQuantity = parseInt(quantityInput.value);

    if (currentQuantity > 1) {
        currentQuantity--;
        quantityInput.value = currentQuantity;
        updateCartTotal();
    }
}

function increaseQuantity(increaseBtn) {
    const cartItem = increaseBtn.closest('.item-cart');
    const quantityInput = cartItem.querySelector('.quantity-item__input');
    let currentQuantity = parseInt(quantityInput.value);
    currentQuantity++;
    quantityInput.value = currentQuantity;
    updateCartTotal();
}

function updateCartTotal() {
    const cartItems = document.querySelectorAll('.item-cart');
    let total = 0;
    cartItems.forEach((cartItem) => {
        const priceElement = cartItem.querySelector('.item-cart__span-price').textContent.trim();
        const quantityElement = cartItem.querySelector('.quantity-item__input');
        const price = parseInt(priceElement.replace(/[^\d]/g, ''));
        const quantity = parseInt(quantityElement.value);
        total += price * quantity;
    });
    const totalPrice = document.querySelector('#total-price');
    if (totalPrice) {
        totalPrice.innerHTML = total.toString() + ' BYN';
    }
}

function addOrder(){
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;
    let cart = JSON.parse(localStorage.getItem("cart"));

}

let btnSubmit = document.getElementById('btnSubmit');

if (btnSubmit) {
    btnSubmit.addEventListener('click', createOrder);
}

async function createOrder(){
    event.preventDefault()
    let initials = document.getElementById('initials').value
    let phoneNumber = document.getElementById('phoneNumber').value
    let town = document.getElementById('town').value
    let address = document.getElementById('address').value
    let email = document.getElementById('email').value
    let region = document.getElementById('region').value
    let postIndex = document.getElementById('postIndex').value
    let paymentMethod
    document.querySelectorAll('input[name="payment"]').forEach(radioButton => {
        radioButton.addEventListener('change', function() {
            if (this.checked) {
                paymentMethod = this.value;
            }
        });
        if (radioButton.checked) {
            paymentMethod = radioButton.value;
        }
    });
    let delivery;
    document.querySelectorAll('input[name="delivery"]').forEach(radioButton => {
        radioButton.addEventListener('change', function() {
            delivery = this.value;
            console.log(delivery);
        });
        if (radioButton.checked) {
            delivery = radioButton.value;
        }
    });
    axios.post(`http://localhost:5000/api/order/createOrder`, { initials: initials,
                                                                phoneNumber: phoneNumber,
                                                                town: town,
                                                                address: address,
                                                                email: email,
                                                                region: region,
                                                                postIndex: postIndex,
                                                                delivery: delivery,
                                                                paymentMethod: paymentMethod})
        .then(function (response) {
        })
        .catch(function (error) {
            console.log(error);
        });
    const productElements = document.getElementsByClassName('item-cart');
    const cartItems = Array.from(productElements).map((item) => {
        const productIdElement = item.querySelector('.productId');
        const quantityElement = item.querySelector('.quantity-item__input');
        const productId = productIdElement.textContent;
        const quantity = quantityElement.value;
        return { productId, quantity };
    });
    axios.post(`http://localhost:5000/api/order/addDevice`, {email: email, cartItems: cartItems})
        .then(function (response){

        })
        .catch(function (error){
            console.log(error)
        })
    axios.delete(`http://localhost:5000/api/basket/deleteBasketDevice`, {params:{ email, cartItems}})
        .then(response => {

        })
        .catch(error => {
            console.error(error);
    });

}



window.addEventListener('load', updateCartTotal);