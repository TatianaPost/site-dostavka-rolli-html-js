const items = [
    {
        id: 1,
        title: 'Филадельфия хит ролл',
        price: 300,
        weight: 180,
        itemsInbox: 6,
        img: 'philadelphia.jpg',
        counter: 1,
        cost: 300
    },
    {
        id: 2,
        title: 'Калифорния темпура',
        price: 250,
        weight: 205,
        itemsInbox: 6,
        img: 'california-tempura.jpg',
        counter: 1,
        cost: 250
},
    {
        id: 3,
        title: 'Запеченый ролл «Калифорния»',
        price: 230,
        weight: 182,
        itemsInbox: 6,
        img: 'zapech-california.jpg',
        counter: 1,
        cost: 230
    },
    {
        id: 4,
        title: 'Филадельфия',
        price: 320,
        weight: 230,
        itemsInbox: 6,
        img: 'philadelphia.jpg',
        counter: 1,
        cost: 320
    }

]

let state = {
    items: items,   // можно просто items, если имя переменной совпадает
    cart: [],
    totalPrice: 0,
    deliveryPrice: 0
}

const productsContainer = document.querySelector('#productsMainContainer')
const cartItemsContainer = document.querySelector('#cartItemsHolder')
const cartEmptyNotification = document.querySelector('#cartEmpty');
const cartTotalContainer = document.querySelector('#cartTotal')
const makeOrderContainer = document.querySelector('#makeOrder')
const cartContainer = document.querySelector('#cart')
const cartTotalPrice = document.querySelector('#cartTotalPrice')
const deliveryPriceContainer = document.querySelector('#deliveryPriceContainer')
const deliveryMinimalFree = 600
const deliveryFree = 'бесплатно'
const deliveryPrice = 500

const renderItem = function (item) {
    const markup = `
        <div class="col-md-6">
            <div class="card mb-4" data-productid="${item.id}">
                <img class="product-img" src="img/roll/${item.img}" alt="${item.title}">
                <div class="card-body text-center">
                    <h4 class="item-title">${item.title}</h5>
                    <p><small class="text-muted">${item.itemsInbox} шт.</small></p>

                    <div class="details-wrapper">
                        <div class="items">
                            <div class="items__control" data-click="minus">-</div>
                            <div class="items__current" data-count>${item.counter}</div>
                            <div class="items__control" data-click="plus">+</div>
                        </div>

                        <div class="price">
                            <div class="price__weight">${item.weight}&nbsp;г.</div>
                            <div class="price__currency"><span data-cost>${item.cost}</span>&nbsp;₽</div>
                        </div>
                    </div>

                    <button type="button" class="btn btn-block btn-outline-warning" data-click="addToCart">+ в корзину</button>

                </div>
            </div>
        </div>

    `;   
    productsContainer.insertAdjacentHTML('beforeend', markup)

}

state.items.forEach(renderItem);

const renderItemInCart = function (item) {
    const markup = `
            <div class="cart-item" data-productid="${item.id}">
                <div class="cart-item__top">
                    <div class="cart-item__img">
                        <img src="img/roll/${item.img}" alt="${item.title}">
                    </div>
                    <div class="cart-item__desc">
                        <div class="cart-item__title">${item.title}</div>
                        <div class="cart-item__weight">${item.itemsInbox} шт. / ${item.weight}г.</div>

                        <div class="cart-item__details">
                            <div class="items items--small">
                                <div class="items__control" data-click="minus">-</div>
                                <div class="items__current" data-count>${item.counter}</div>
                                <div class="items__control" data-click="plus">+</div>
                            </div>

                            <div class="price">
                                <div class="price__currency"><span data-cost>${item.cost}</span>&nbsp;₽</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    `;   
    cartItemsContainer.insertAdjacentHTML('beforeend', markup)

}

const updateCounter = function (id, type, arr, obj, isNullable=false) {
    const itemIndex = arr.findIndex( function(element) {  // индекс того элемента массива, который удовлетворит условию
        if (element.id == id) {                                   // findIndex перепроверяет все элементы массива и возвращает первый элемент, который попал под условие
            return true;
        }
    }) 

    let count = arr[itemIndex].counter;     

    if (type == 'minus') {
        if (isNullable || count - 1 > 0) {
            count--;
        }
    
    } else if (type == 'plus') {
        count++;
    }
    
    if (count == 0) {
        arr.splice(itemIndex, 1);
        cartItemsContainer.querySelector('[data-productid="' + id + '"]').innerHTML = "";
        checkCart();
    } else {    
        arr[itemIndex].counter = count;
        arr[itemIndex].cost = count * arr[itemIndex].price;
        updateViewCounter(id, arr, obj);
    }
}

const updateViewCounter = function (id, arr, obj) {
    // 1) По ID найти объект продукта в state.items для того, чтобы получить значение его свойства counter
    const itemIndex = arr.findIndex( function(element) { 
        if (element.id == id) {                                  
            return true;
        }
    }) 

    // значение счетчика из состояния нашего приложения
    const countToShow = arr[itemIndex].counter
    //console.log(countToShow)

    // 2) Обновить значение счетчика в разметке
    // 2.1) Найти место в разметке, где находится счетчик // [data-count]
    const currentProduct = obj.querySelector('[data-productid="' + id + '"]');    
    const counter = currentProduct.querySelector('[data-count]');
    // 2.2) Обновить значение счетчика в разметке
    counter.innerText = countToShow;
    
    // 3) Обновить стоимость товара
    const productPrice = currentProduct.querySelector('[data-cost]');
    // 2.2) Обновить значение счетчика в разметке
    productPrice.innerText = arr[itemIndex].cost;
    
}

const checkCart = function () {
    if (state.cart.length > 0) {
        cartEmptyNotification.style.display = 'none';
        cartTotalContainer.style.display = 'block';
        makeOrderContainer.style.display = 'block';
    } else {
        cartEmptyNotification.style.display = 'block';
        cartTotalContainer.style.display = 'none';
        makeOrderContainer.style.display = 'none';
    }
}

const addToCart = function (id) {
    const itemIndex = state.items.findIndex( function(element) { 
        if (element.id == id) {                                  
            return true;
        }
    }) 
    
    // Проверить есть ли в корзине товар с таким ID
    const itemIndexInCart = state.cart.findIndex( function(element) { 
        if (element.id == id) {                                  
            return true;
        }
    }) 
            
    // Если такого товара в корзине нет, то создаем новый объект и помещаем в корзину
    if (itemIndexInCart == -1) {
        const newItem = {
            id: state.items[itemIndex].id,
            title: state.items[itemIndex].title,
            price: state.items[itemIndex].price,
            weight: state.items[itemIndex].weight,
            itemsInbox: state.items[itemIndex].itemsInbox,
            img: state.items[itemIndex].img,
            counter: state.items[itemIndex].counter,
            cost: state.items[itemIndex].cost
        }
        state.cart.push(newItem)
        
    // Если такой товар уже есть в корзине, то увеличить количество
    } else {
        state.cart[itemIndexInCart].counter += state.items[itemIndex].counter;
    }
    state.items[itemIndex].counter = 1;
    state.items[itemIndex].cost = state.items[itemIndex].price;
    updateViewCounter(id, state.items, productsContainer);
    
    cartItemsContainer.innerHTML = "";
    state.cart.forEach(renderItemInCart);
    
    checkCart();    
}

const calculateDelivery = function(){
    let currentDeliveryPrice = 0;
    if (state.totalPrice >= deliveryMinimalFree) {
        deliveryPriceContainer.innerHTML = deliveryFree;
        deliveryPriceContainer.classList.add('free');
    } else {
        deliveryPriceContainer.innerHTML = deliveryPrice + ' ₽';
        deliveryPriceContainer.classList.remove('free');
        currentDeliveryPrice = deliveryPrice;
    }
    state.deliveryPrice = currentDeliveryPrice;
}

const calculateTotalPrice = function(){
    let totalPrice = 0;
    
    state.cart.forEach(function (element){
      let thisPrice = element.counter * element.price;
        totalPrice += thisPrice;
    })  
    
    state.totalPrice = totalPrice;
    calculateDelivery();
    state.totalPrice += state.deliveryPrice;
    cartTotalPrice.innerHTML = state.totalPrice;
}

productsContainer.addEventListener('click', function(e) {  // e - событие, кот. происходит во время клика
    if (e.target.matches('[data-click="minus"]')) {
        const id =  e.target.closest('[data-productid]').dataset.productid; // e.target - цель, т.е. по чему кликнули
        updateCounter(id, 'minus', state.items, productsContainer);
        
    } else if (e.target.matches('[data-click="plus"]')) {
        const id =  e.target.closest('[data-productid]').dataset.productid; // e.target - цель, т.е. по чему кликнули
        updateCounter(id, 'plus', state.items, productsContainer);
        
    } else if (e.target.matches('[data-click="addToCart"]')) {
        const id =  e.target.closest('[data-productid]').dataset.productid; // e.target - цель, т.е. по чему кликнули
        addToCart(id);
        calculateTotalPrice();
    }
});

cartContainer.addEventListener('click', function(e) {  
    if (e.target.matches('[data-click="minus"]')) {
        const id =  e.target.closest('[data-productid]').dataset.productid; 
        updateCounter(id, 'minus', state.cart, cartContainer, 'true');
        calculateTotalPrice();
        
    } else if (e.target.matches('[data-click="plus"]')) {
        const id =  e.target.closest('[data-productid]').dataset.productid; 
        updateCounter(id, 'plus', state.cart, cartContainer, 'true');
        calculateTotalPrice();
    }
});
