// 以下が変換に対応している対応通貨
const currencyMapping = {
  JPY: "JPY",
  USD: "USD",
  EUR: "EUR",
  BGN: "BGN",
  CZK: "CZK",
  DKK: "DKK",
  GBP: "GBP",
  HUF: "HUF",
  PLN: "PLN",
  RON: "RON",
  SEK: "SEK",
  CHF: "CHF",
  ISK: "ISK",
  NOK: "NOK",
  TRY: "TRY",
  AUD: "AUD",
  BRL: "BRL",
  CAD: "CAD",
  CNY: "CNY",
  HKD: "HKD",
  IDR: "IDR",
  ILS: "ILS",
  INR: "INR",
  KRW: "KRW",
  MXN: "MXN",
  MYR: "MYR",
  NZD: "NZD",
  PHP: "PHP",
  SGD: "SGD",
  THB: "THB",
  ZAR: "ZAR",
};


async function fetchExchangeRates() {
  const url = `https://w43pa9wcjk.execute-api.ap-northeast-1.amazonaws.com/prod/exchange-rate`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('exchangeRates', JSON.stringify(data));
    localStorage.setItem('lastFetch', new Date().toISOString());
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

function shouldFetchNewData() {
  const lastFetch = localStorage.getItem('lastFetch');
  if (!lastFetch) return true;

  const lastFetchDate = new Date(lastFetch);
  const now = new Date();
  const JSTOffset = 9 * 60; // 日本標準時のオフセットは+9時間
  const JSTD = new Date(now.getTime() + JSTOffset * 60 * 1000);
  
  if (JSTD.getHours() >= 16 && now.getDate() !== lastFetchDate.getDate()) {
    return true;
  }
  return false;
}

function getExchangeRate(exchangeRates, isoCode) {
  return exchangeRates[isoCode] || null;
}

function quantityListener() {
    // sht-qty-inp要素を取得: 数量セレクターの要素がテーマごとに変わるので注意
    const qtyInpElements = document.querySelectorAll('quantity-input');
  
    // 各sht-qty-inp要素に対して処理を行う
    qtyInpElements.forEach(function(qtyInpElement) {
      // 子要素のボタンを取得
      const buttons = qtyInpElement.querySelectorAll('button');
  
      // 各ボタンにクリックイベントリスナーを追加
      buttons.forEach(function(button) {
        button.addEventListener('click', function() {
          // ボタンがクリックされたときにページをリロード
          setTimeout(function() {
            window.location.reload();
          }, 2000); // 2000ミリ秒（2秒）後にリロード
        });
      });
  });
}

function calculateFreeShippingThreshold(
  baseRate,
  borderPrice,
  weightParam = 1.0
) {
  return parseFloat(baseRate) * weightParam * (borderPrice * 10 + 800);
}

function calculateAmountUntilFreeShipping(freeShippingThreshold, cartTotal) {
  return freeShippingThreshold - cartTotal;
}

function displayShippingMessage(amountUntilFreeShipping, currencySymbol, for_free_text, free_text) {
  const shippingMessageElement = document.getElementById("shipping-message");
  shippingMessageElement.style.display = "block";
  console.log(amountUntilFreeShipping)
  if (amountUntilFreeShipping > 0) {
    console.log("1")
    shippingMessageElement.innerHTML = ` ${for_free_text }${currencySymbol}${amountUntilFreeShipping.toFixed(2)}`;
  } else {
    console.log("2")
    shippingMessageElement.innerHTML = free_text;
  }
}
