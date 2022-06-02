let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) =>document.querySelector(el);

//Listagem das pizzas:
pizzaJson.forEach((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    modalQt = 1;

    pizzaItem.setAttribute('data-item', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //Tela para adicionar ao carrinho:
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault();

        //Mostrar com as informações de cada pizza:
        let key = e.target.closest('.pizza-item').getAttribute('data-item');
        modalKey = key;
        /* 
        target: pega ele mesmo
        closest('.pizza-item'): procure o elemento mais próximo que tenha a class pizza-item
        */
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

       //Mostrar na tela:
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    })
    
    c('.pizza-area').append(pizzaItem); /*append: O mesmo que "innerHTML", porém serve não somente para textos e não substitui o que já foi colocado*/
});

//Eventos do modal:

function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500)
};

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
})

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt; 
    }
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    })
});

//Adicionar ao carrinho:
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    //Pizza: modalKey/
    //Tamanho:
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    //Quantidade: modalQt//


    let identifier = pizzaJson[modalKey].id+'@'+size;

    /*Procura os itens do meu array que tenham o identifier igual o que foi definido em cima*/
    let search = cart.findIndex((item)=> item.identifier == identifier);

    if(search > -1) {
        cart[search].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQt
        });
    }

    updateCard(); //Atualiza o carrinho
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

function updateCard() {
    c('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSize;
            switch (cart[i].size) {
                case 0: 
                    pizzaSize = 'P';
                    break;
                case 1:
                    pizzaSize = 'M';
                    break;
                case 2:
                    pizzaSize = 'P';
                    break;
            };

            let pizzaName = `${pizzaItem.name} (${pizzaSize})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                };
                
                updateCard();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCard();
            });

            c('.cart').append(cartItem);
        };

        desconto = subtotal * 0.10;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        c('aside').classList.remove('show'); //Desktop
        c('aside').style.left = '100vw'; //Mobile
    };
};