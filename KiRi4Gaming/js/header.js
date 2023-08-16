let headerText = `<div class="header__wrapper container">
         <div class="header__logo logo">
            <a href="../HTML/index.html"><img class="logo__img" src="../img/logo.png" alt="logo"></a>
         </div>
         <nav class="header__menu menu">
            <div class="menu__item" id="menu-item-category">
               <a class="menu__link" href="../HTML/category.html">Каталог</a>
            </div>
            <div class="menu__item" id="menu-item-delivery">
               <a class="menu__link" href="../HTML/delivery.html">Доставка</a>
            </div>
            <div class="menu__item" id="menu-item-payment">
               <a class="menu__link" href="../HTML/payment.html">Оплата</a>
            </div>
         </nav>
         <div class="header__right">
            <form action="#" class="header__form search-form">
               <label class="search-form__label">
                  <input class="search-form__input" type="text" placeholder="Поиск по сайту">
                  <img class="search-form__img" src="../img/search.svg" alt="icon">
               </label>
            </form>
            <nav class="header__icons icons">
               <a class="icons__link" onclick="redirectToProfile()"><img class="icons__img" src="../img/profile.svg"
                     alt="profile"></a>
               <a class="icons__link" onclick="redirectToBasket()">
                  <div class="icons__circle"></div><img class="icons__img" src="../img/basket.svg" alt="cart">
               </a>
            </nav>
         </div>
         <div class="header__burger burger-menu">
            <a id="burger-menu-link" aria-expanded="false"><img class="burger-menu__img" src="../img/burger.svg"
                  alt="MENU"></a>
            <div class="burger-menu__open">
               <ul class="burger-menu__list center">
                  <li class="burger-menu__item">
                     <form action="#" class="search-form">
                        <label class="search-form__label">
                           <input class="search-form__input" type="text" placeholder="Поиск по сайту">
                           <img class="search-form__img" src="../img/search.svg"
                           alt="icon">
                        </label>
                     </form>
                  </li>
                  <li class="burger-menu__item">МЕНЮ</li>
                  <li class="burger-menu__item"><a class="burger-menu__link" onclick="redirectToProfile()">Профиль</a></li>
                  <li class="burger-menu__item"><a class="burger-menu__link" onclick="redirectToBasket()">Корзина</a></li>
                  <li class="burger-menu__item"><a class="burger-menu__link" href="../HTML/category.html">Каталог</a></li>
                  <li class="burger-menu__item"><a class="burger-menu__link" href="../HTML/delivery.html">Доставка</a></li>
                  <li class="burger-menu__item"><a class="burger-menu__link" href="../HTML/payment.html">Оплата</a></li>
               </ul>
            </div>
         </div>
      </div>`;

function setHeader() {
  let header = document.createElement("header");
  header.className = "header";
  header.innerHTML = headerText;
  document.body.insertAdjacentElement("afterbegin", header);
}

  async function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      const response = await axios.get('http://localhost:5000/api/user/auth');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async function redirectToProfile() {
    const isAuth = await checkAuth();
    if (isAuth) {
      window.location.href = 'profile.html';
    } else {
      window.location.href = 'authorization.html';
    }
  }
async function redirectToBasket() {
  const isAuth = await checkAuth();
  if (isAuth) {
    window.location.href = 'basket.html';
  } else {
    window.location.href = 'authorization.html';
  }
}


setHeader();
