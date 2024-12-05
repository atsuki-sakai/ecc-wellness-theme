  // 日本の祝日（2024年）
 const holidays = [
    '2024-01-01', '2024-01-08', '2024-02-11', '2024-02-12', '2024-02-23',
    '2024-03-20', '2024-04-29', '2024-05-03', '2024-05-04', '2024-05-05',
    '2024-05-06', '2024-07-15', '2024-08-11', '2024-08-12', '2024-08-13',
    '2024-08-14', '2024-08-15', '2024-09-16', '2024-09-22', '2024-09-23',
    '2024-10-14', '2024-11-03', '2024-11-04', '2024-11-23', '2024-12-23',
    '2024-12-29', '2024-12-30', '2024-12-31'
  ];

function isBusinessDay(date) {
    const day = date.getDay();
    const dateString = date.toISOString().split('T')[0];
    return day !== 0 && day !== 6 && !holidays.includes(dateString);
}

function getNextBusinessDay(date) {
    do {
        date.setDate(date.getDate() + 1);
    } while (!isBusinessDay(date));
    return date;
}

function getMinDeliveryDate() {
    let date = new Date();
    for (let i = 0; i < 3; i++) {
        date = getNextBusinessDay(date);
    }
    return date.toISOString().split('T')[0];
}

function updateMinDate(deliveryDateInput) {
    const minDate = getMinDeliveryDate();
    deliveryDateInput.min = minDate;
    deliveryDateInput.value = minDate;
}

 // 価格を修正するための関数
function adjustPrices(items, variantIds) {
  return items.map(item => {
    const matchedVariant = variantIds.find(variant => variant.variantId == item.variant_id);
    if (matchedVariant) {
      return {
        ...item,
        price: matchedVariant.price,
        original_price: matchedVariant.price,
        discounted_price: matchedVariant.price,
        line_price: matchedVariant.price,
        original_line_price: matchedVariant.price,
        final_price: matchedVariant.price,
        final_line_price: matchedVariant.price
      };
    }
    return item;
  });
}

function setLoadingState(isLoading) {
  const checkoutButton = document.getElementById('checkout');
  const spinner = checkoutButton.querySelector('.spinner');
  const buttonText = checkoutButton.querySelector('.button-text');
    if (isLoading) {
        checkoutButton.disabled = true;
        spinner.style.display = 'inline-block';
        buttonText.textContent = '処理中...';
    } else {
        checkoutButton.disabled = false;
        spinner.style.display = 'none';
        buttonText.textContent = '請求書払いで注文';
    }
}

// orderDataのline_itemsをvariantIdsの価格で更新
function updatePrices(orderData, variantIds) {
  orderData.line_items.forEach(item => {
    const matchedVariant = variantIds.find(variant => variant.variantId == item.variant_id);
    if (matchedVariant) {
      item.price = matchedVariant.price;
      item.original_price = matchedVariant.price;
      item.discounted_price = matchedVariant.price;
      item.line_price = matchedVariant.price;
      item.original_line_price = matchedVariant.price;
      item.final_price = matchedVariant.price;
      item.final_line_price = matchedVariant.price;
    }
  });
}


async function createBtobOrder(orderData) {
  console.log(orderData);
  const redirectUrl = "https://ecc-wellness.com/pages/btob-order-success";
    const checkoutBtn = document.getElementsByClassName('b2b-checkout-btn')[0];
  checkoutBtn.disabled = true;
  checkoutBtn.textContent = '処理中...';
  
   try {
    const response = await fetch('https://dhz2gjm1l8.execute-api.ap-northeast-1.amazonaws.com/prod/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Success:', data);

    // カートをクリア
    try {
      await fetch('/cart/clear.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // カートがクリアされたらリダイレクト
      window.location.href = redirectUrl;
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('カートのクリア中にエラーが発生しました。もう一度お試しください。');
      setLoadingState(false);
      checkoutBtn.disabled = false;
      checkoutBtn.textContent = '請求書払いで注文';
    }
  } catch (error) {
    console.error('Error:', error);
    // エラー時の処理
    alert('注文の処理中にエラーが発生しました。もう一度お試しください。', error);
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = '請求書払いで注文';
    setLoadingState(false);
  }
}
