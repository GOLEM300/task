const getTemplate = (item) => {
  //get link template for support products
  const associatedProducts = item.assocProducts.split("\n");
  const links = associatedProducts.map((element) => {
    return `<a href="#" class="url--link">${element}</a>`;
  });

  return `
    <div class="product product_horizontal">
      <span class="product_code">Код: "${item.code}"</span>
      <div class="product_status_tooltip_container">
        <span class="product_status">Наличие</span>
      </div>
      <div class="product_photo">
        <a href="#" class="url--link product__link">
          <img
            src="${item.primaryImageUrl}"
          />
        </a>
      </div>
      <div class="product_description">
        <a href="#" class="product__link"
          >"${item.title}"</a
        >
      </div>
      <div class="product_tags hidden-sm">
        <p>Могут понадобиться:</p>
        ${links.join("")}
      </div>
      <div class="product_units">
        <div class="unit--wrapper">
          <div class="unit--select unit--active" data-change_active-metres="${item.productId}">
            <p class="ng-binding" data-btn="metres" data-id="${
              item.productId
            }">За м. кв.</p>
          </div>
          <div class="unit--select" data-change_active-pack="${item.productId}">
            <p class="ng-binding" data-btn="pack" data-id="${
              item.productId
            }">За упаковку</p>
          </div>
        </div>
      </div>
      <p class="product_price_club_card">
        <span class="product_price_club_card_text"
          >По карте<br />клуба</span
        >
        <span class="goldPrice" data-change_gold="${item.productId}">${
    item.priceGoldAlt.toFixed()
  }</span>
        <span class="rouble__i black__i">
          <svg
            version="1.0"
            id="rouble__b"
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            y="0"
            width="30px"
            height="22px"
            viewBox="0 0 50 50"
            enable-background="new 0 0 50 50"
            xml:space="preserve"
          >
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#rouble_black"
            ></use>
          </svg>
        </span>
      </p>
      <p class="product_price_default">
        <span class="retailPrice" data-change_retail="${item.productId}">${
    item.priceRetailAlt.toFixed()
  }</span>
        <span class="rouble__i black__i">
          <svg
            version="1.0"
            id="rouble__g"
            xmlns="http://www.w3.org/2000/svg"
            x="0"
            y="0"
            width="30px"
            height="22px"
            viewBox="0 0 50 50"
            enable-background="new 0 0 50 50"
            xml:space="preserve"
          >
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#rouble_gray"
            ></use>
          </svg>
        </span>
      </p>
      <div class="product_price_points">
        <p class="ng-binding">Можно купить за ${item.bonusAmount} балла</p>
      </div>
      <div class="list--unit-padd"></div>
      <div class="list--unit-desc">
        <div class="unit--info">
          <div class="unit--desc-i"></div>
          <div class="unit--desc-t">
            <p>
              <span class="ng-binding"
                >Продается упаковками:</span
              >
              <span class="unit--infoInn"
                >1 упак. = 2.47 м. кв.
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="product__wrapper">
        <div class="product_count_wrapper">
          <div class="stepper">
            <input
              class="product__count stepper-input"
              type="number"
              value="1"
              readonly
              id="${item.productId}"
            />
            <span class="stepper-arrow up" data-btn="arrow_up" data-id="${
              item.productId
            }"></span>
            <span class="stepper-arrow down" data-btn="arrow_down" data-id="${
              item.productId
            }"></span>
          </div>
        </div>
        <span
          class="btn btn_cart"
          data-url="/cart/"
        >
          <svg class="ic ic_cart">
            <use
              xmlns:xlink="http://www.w3.org/1999/xlink"
              xlink:href="#cart"
            ></use>
          </svg>
          <span class="ng-binding" data-btn="buy" data-id="${
            item.productId
          }">В корзину</span>
        </span>
      </div>
    </div>
`;
};

//get data from products.json file
async function loadProducts() {
  const data = await fetch("products.json")
    .then((res) => res.json())
    .catch((err) => console.error(err));

  //render html template
  function render() {
    const html = data.map(getTemplate).join("");
    document.querySelector(".products_page").innerHTML = html;
  }

  render();

  document.addEventListener("click", (event) => {
    event.preventDefault();
    const btnType = event.target.dataset.btn;
    const id = event.target.dataset.id;

    //get index for change item price
    let index = data.findIndex((obj) => obj.productId == id);

    switch (btnType) {
      case "arrow_up":
        document.getElementById(id).value++;
        break;
      
      case "arrow_down":
        if (document.getElementById(id).value > 1) {
          document.getElementById(id).value--;
        }
        break;
      
      case "metres":
        document.querySelector(`[data-change_active-metres="${id}"]`).closest("div").classList.add("unit--active")
        document.querySelector(`[data-change_active-pack="${id}"]`).closest("div").classList.remove("unit--active")
        document.querySelector(`[data-change_retail="${id}"]`).innerHTML = data[index].priceRetailAlt.toFixed();
        document.querySelector(`[data-change_gold="${id}"]`).innerHTML = data[index].priceGoldAlt.toFixed();
        break;

      case "pack":
        document.querySelector(`[data-change_active-pack="${id}"]`).closest("div").classList.add("unit--active")
        document.querySelector(`[data-change_active-metres="${id}"]`).closest("div").classList.remove("unit--active")
        document.querySelector(`[data-change_retail="${id}"]`).innerHTML = data[index].priceRetail.toFixed();
        document.querySelector(`[data-change_gold="${id}"]`).innerHTML = data[index].priceGold.toFixed();
        break;

      case "buy":
        alert(`you bought it "${id}"`);
        break;

      default:
        break;
      
    }
  });
}

loadProducts();
