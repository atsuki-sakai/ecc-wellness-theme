
const tagMapping = {
  "00001": "ECCスタッフ・役員",
  "00002": "HT・幼推講師",
  "00004": "外語講師",
  "00005": "ECCスタッフ紹介",
  "00006": "ECC役員紹介",
  "00007": "HT紹介",
  "00008": "幼推講師紹介",
  "00009": "外語紹介",
  "00010": "ECCジュニア生・生徒保護者",
  "00011": "ECC（外語）受講生・生徒",
  "00012": "学園スタッフ",
  "00013": "学園スタッフ紹介",
  "00014": "ECC顧問",
  "00015": "ベストワンオーナー",
  "00016": "取引先・既存代理店-A",
  "00017": "アンバサダー",
  "00019": "提携園",
  "00020": "ウノプリール",
  "00021": "ウェルシアコクミン",
  "00022": "取引先・既存代理店-B"
};

function toggleCodeInputVisibility() {
  console.log('toggleCodeInputVisibilit')
  const checkbox = document.getElementById('ecc-affiliate-checkbox');
  const codeInputContainer = document.getElementById('code-input-container');
  
  if (checkbox && codeInputContainer) {
    codeInputContainer.style.display = checkbox.checked ? 'block' : 'none';
  }
  console.log('toggleCodeInputVisibilit end')
}

function updateCustomerTags() {

  const customerCodeElement = document.getElementById('RegisterForm-code');
  const teacherCodeInput = document.querySelector('.teacher-code__input');
  const customerTagsElement = document.getElementById('customer_tags');
  const checkbox = document.getElementById('ecc-affiliate-checkbox');
  
  if (!customerCodeElement || !teacherCodeInput || !customerTagsElement || !checkbox) {
    console.error('One or more required elements are missing');
    return;
  }

  const customerCode = checkbox.checked ? customerCodeElement.value : '';
  
  if (customerCode == "00001" || customerCode == "00002" || customerCode == "00003" || customerCode == "00004") {
    teacherCodeInput.classList.add('show');
    console.log('shown');
  } else {
    teacherCodeInput.classList.remove('show');
    const inputElement = teacherCodeInput.querySelector('input');
    if (inputElement) {
      inputElement.value = ''; 
    }
    console.log('hidden');
  }
  console.log('入力されたコード:', customerCode);
    
  const customerTag = checkbox.checked ? (tagMapping[customerCode] || "一般会員") : "一般会員";
  console.log('設定されたタグ:', customerTag);

  customerTagsElement.value = customerTag;
}

document.addEventListener('DOMContentLoaded', function() {
  const codeInput = document.getElementById('RegisterForm-code');
  const form = document.querySelector('form');
  const checkbox = document.getElementById('ecc-affiliate-checkbox');
  
  if (checkbox) {
    checkbox.addEventListener('change', function() {
      toggleCodeInputVisibility();
      updateCustomerTags();
    });
  } else {
    console.error('ecc-affiliate-checkbox element not found');
  }
  
  if (codeInput) {
    codeInput.addEventListener('input', updateCustomerTags);
    console.log('イベントリスナーが設定されました');
  } else {
    console.error('RegisterForm-code 要素が見つかりません');
  }
  
  if (form) {
    form.addEventListener('submit', function(e) {
      const teacherCodeElement = document.getElementById('teacher-code');
      const customerNoteInput = document.querySelector('input[name="customer[note][講師コード]"]');
      
      if (teacherCodeElement && customerNoteInput) {
        const teacherCode = teacherCodeElement.value;
        if (teacherCode) {
          customerNoteInput.value = `講師コード: ${teacherCode}`;
          console.log(customerNoteInput.value);
        }
      } else {
        console.error('teacher-code または customer[note][講師コード] 要素が見つかりません');
      }
    });
  } else {
    console.error('フォーム要素が見つかりません');
  }

  // 初期化時にも実行
  toggleCodeInputVisibility();
  updateCustomerTags();
});