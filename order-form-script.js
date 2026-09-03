const params = new URLSearchParams(window.location.search);


const productName =
  params.get("Product") || "Product";


const productDescription =
  params.get("Product_Description") || "";


const productPrice =
  Number(params.get("Product_Price") || 0);


const oldPrice =
  Number(params.get("Old_Price") || 0);


const productId =
  params.get("Product_ID") || "N/A";


const productImage =
  params.get("Product_Image") || "";


const deliveryType =
  params.get("Delivery_Type") || "free";


const deliveryCharges =
  deliveryType === "paid"
  ? Number(params.get("Delivery_Charges") || 0)
  : 0;


const $ = id =>
  document.getElementById(id);


function rupees(number){

  return "Rs. " +
    Number(number || 0)
      .toLocaleString("en-PK");

}


function setValue(id,value){

  const element = $(id);

  if(element){
    element.value = value ?? "";
  }

}


function createOrderId(){

  const now = new Date();

  const pakistanTime =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:"Asia/Karachi",
        year:"numeric",
        month:"2-digit",
        day:"2-digit",
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:false
      }
    ).formatToParts(now);


  const get = type =>
    pakistanTime.find(
      x => x.type === type
    )?.value || "00";


  return `JT-${get("year")}${get("month")}${get("day")}-${get("hour")}${get("minute")}${get("second")}`;

}


function getPakistanDate(){

  return new Intl.DateTimeFormat(
    "ur-PK",
    {
      timeZone:"Asia/Karachi",
      year:"numeric",
      month:"long",
      day:"numeric"
    }
  ).format(new Date());

}


function updateDeliveryDisplay(){

  const badge =
    $("deliveryBadge");

  const note =
    $("deliveryNote");

  const deliveryTotal =
    $("deliveryTotal");


  if(deliveryType === "paid" && deliveryCharges > 0){

    badge.className =
      "delivery-badge paid";

    badge.textContent =
      `🚚 Paid Delivery — ${rupees(deliveryCharges)}`;

    note.textContent =
      `ڈیلیوری چارجز ${rupees(deliveryCharges)} ہیں، جو Total Amount میں شامل ہیں۔`;

    deliveryTotal.textContent =
      rupees(deliveryCharges);

  }else{

    badge.className =
      "delivery-badge free";

    badge.textContent =
      "🎁 FREE DELIVERY";

    note.textContent =
      "آپ کے اس آرڈر کے لیے ڈیلیوری بالکل مفت ہے۔";

    deliveryTotal.textContent =
      "Free";

  }

}


function updateTotal(){

  const quantity =
    Math.min(
      10,
      Math.max(
        1,
        Number($("quantity").value || 1)
      )
    );


  $("quantity").value =
    String(quantity);


  const productTotal =
    productPrice * quantity;


  const grandTotal =
    productTotal + deliveryCharges;


  $("productTotal").textContent =
    rupees(productTotal);


  $("grandTotal").textContent =
    rupees(grandTotal);


  setValue(
    "hiddenTotal",
    grandTotal
  );

}


function setupProduct(){

  $("productName").textContent =
    productName;


  $("productPrice").textContent =
    rupees(productPrice);


  if(oldPrice > 0){

    $("oldPrice").textContent =
      rupees(oldPrice);

  }else{

    $("oldPrice").textContent =
      "";

  }


  if(productImage){

    $("productImage").src =
      productImage;

    $("hiddenProductImage").value =
      productImage;

  }else{

    $("productImage").style.display =
      "none";

  }


  setValue(
    "hiddenProduct",
    productName
  );


  setValue(
    "hiddenDescription",
    productDescription
  );


  setValue(
    "hiddenPrice",
    productPrice
  );


  setValue(
    "hiddenOldPrice",
    oldPrice
  );


  setValue(
    "hiddenProductId",
    productId
  );


  setValue(
    "hiddenDeliveryCharges",
    deliveryCharges
  );


  setValue(
    "hiddenDeliveryStatus",
    deliveryType === "paid"
    ? `Paid Delivery - ${rupees(deliveryCharges)}`
    : "Free Delivery"
  );


  updateDeliveryDisplay();
  updateTotal();

}


$("quantity").addEventListener(
  "change",
  updateTotal
);


$("orderForm").addEventListener(
  "submit",
  async function(event){

    event.preventDefault();


    const name =
      $("customerName").value.trim();

    const mobile =
      $("mobile").value.trim();

    const address =
      $("address").value.trim();


    const message =
      $("formMessage");


    if(!name){

      message.className =
        "message error";

      message.textContent =
        "براہِ کرم اپنا نام درج کریں۔";

      message.style.display =
        "block";

      return;

    }


    if(!mobile){

      message.className =
        "message error";

      message.textContent =
        "براہِ کرم موبائل / WhatsApp نمبر درج کریں۔";

      message.style.display =
        "block";

      return;

    }


    if(!address){

      message.className =
        "message error";

      message.textContent =
        "براہِ کرم مکمل Delivery Address درج کریں۔";

      message.style.display =
        "block";

      return;

    }


    const orderId =
      createOrderId();


    const quantity =
      Number($("quantity").value || 1);


    const productTotal =
      productPrice * quantity;


    const grandTotal =
      productTotal + deliveryCharges;


    setValue(
      "orderId",
      orderId
    );


    setValue(
      "_subject",
      `JANJUA New Order - ${orderId}`
    );


    setValue(
      "_url",
      window.location.href
    );


    setValue(
      "hiddenTotal",
      grandTotal
    );


    const submitBtn =
      $("submitBtn");


    submitBtn.disabled =
      true;

    submitBtn.textContent =
      "Submitting Order...";


    message.style.display =
      "none";


    try{

      const formData =
        new FormData(this);


      const response =
        await fetch(
          this.action,
          {
            method:"POST",
            body:formData,
            headers:{
              "Accept":"application/json"
            }
          }
        );


      if(!response.ok){

        throw new Error(
          "Order submission failed"
        );

      }


      showReceipt({

        orderId,
        name,
        mobile,
        address,
        quantity,
        productTotal,
        grandTotal

      });


    }catch(error){

      console.error(error);


      message.className =
        "message error";

      message.textContent =
        "معذرت، آرڈر Submit نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔";

      message.style.display =
        "block";


      submitBtn.disabled =
        false;

      submitBtn.textContent =
        "🛒 آرڈر Submit کریں";

    }

  }
);


function showReceipt(data){

  const {
    orderId,
    name,
    mobile,
    address,
    quantity,
    productTotal,
    grandTotal
  } = data;


  $("receiptImage").src =
    productImage;


  $("receiptProductName").textContent =
    productName;


  $("receiptDate").textContent =
    getPakistanDate();


  $("receiptOrderId").textContent =
    orderId;


  $("receiptProductId").textContent =
    productId;


  $("receiptCustomerName").textContent =
    name;


  $("receiptMobile").textContent =
    mobile;


  $("receiptAddress").textContent =
    address;


  $("receiptQuantity").textContent =
    quantity;


  $("receiptProductTotal").textContent =
    rupees(productTotal);


  $("receiptDelivery").textContent =
    deliveryType === "paid"
    ? rupees(deliveryCharges)
    : "Free Delivery";


  $("receiptTotal").textContent =
    rupees(grandTotal);


  if(deliveryType === "paid"){

    $("paymentNote").textContent =
      `💰 آپ کے آرڈر کی کل رقم ${rupees(grandTotal)} ہے۔ اس میں ${rupees(deliveryCharges)} ڈیلیوری چارجز شامل ہیں۔ ڈیلیوری کے وقت قابلِ ادائیگی رقم: ${rupees(grandTotal)}۔`;

  }else{

    $("paymentNote").textContent =
      `💰 آپ کے آرڈر کی کل رقم ${rupees(grandTotal)} ہے۔ آپ کے لیے ڈیلیوری بالکل مفت ہے۔ ڈیلیوری کے وقت قابلِ ادائیگی رقم: ${rupees(grandTotal)}۔`;

  }


  $("orderSection").style.display =
    "none";


  $("receiptWrapper").style.display =
    "block";


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });


  const receiptUrl =
    window.location.href;


  localStorage.setItem(
    "janjua_last_order",
    JSON.stringify({
      ...data,
      productId,
      productName,
      productImage,
      deliveryType,
      deliveryCharges,
      date:getPakistanDate()
    })
  );


  window._janjuaReceiptData = {
    orderId,
    name,
    mobile,
    address,
    quantity,
    productTotal,
    grandTotal
  };

}


$("printBtn").addEventListener(
  "click",
  () => {

    window.print();

  }
);


$("shareBtn").addEventListener(
  "click",
  async () => {

    const orderId =
      $("receiptOrderId").textContent;


    const shareText =
`JANJUA ORDER RECEIPT

Order ID: ${orderId}
Product ID: ${productId}
Product: ${productName}
Customer: ${$("receiptCustomerName").textContent}
Mobile: ${$("receiptMobile").textContent}
Address: ${$("receiptAddress").textContent}
Quantity: ${$("receiptQuantity").textContent}
Total: ${$("receiptTotal").textContent}

آپ کا آرڈر 3 سے 4 دن کے اندر ڈیلیور کر دیا جائے گا۔`;


    if(navigator.share){

      try{

        await navigator.share({
          title:"JANJUA Order Receipt",
          text:shareText
        });

      }catch(error){

        console.log(
          "Share cancelled"
        );

      }

    }else{

      try{

        await navigator.clipboard.writeText(
          shareText
        );

        alert(
          "Receipt کی معلومات Copy ہو گئی ہیں۔ اب آپ WhatsApp یا کسی بھی جگہ Paste کر سکتے ہیں۔"
        );

      }catch(error){

        alert(
          shareText
        );

      }

    }

  }
);


$("downloadBtn").addEventListener(
  "click",
  async () => {

    /*
      Browser-native download:
      ہم Receipt کو HTML file کی شکل میں
      موبائل میں محفوظ کر رہے ہیں۔
    */

    const receipt =
      $("receipt");


    const html =
`<!DOCTYPE html>
<html lang="ur" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>JANJUA Receipt</title>
<style>
body{
font-family:Arial,sans-serif;
background:#f4f7f5;
padding:20px;
color:#183b2a;
}
.receipt{
max-width:700px;
margin:auto;
background:white;
border:2px solid #d9c17a;
border-radius:18px;
overflow:hidden;
}
.header{
background:#063b27;
color:white;
text-align:center;
padding:20px;
}
.logo{
font-size:35px;
font-weight:900;
letter-spacing:6px;
}
.title{
color:#f2d889;
font-weight:bold;
margin-top:5px;
}
.body{
padding:20px;
}
.row{
display:flex;
justify-content:space-between;
gap:15px;
padding:10px 0;
border-bottom:1px dashed #ccd8d1;
}
.label{
font-weight:bold;
color:#555;
}
.value{
font-weight:bold;
text-align:left;
}
.note{
margin-top:20px;
padding:15px;
background:#e9f6ee;
color:#07552f;
border-radius:12px;
font-weight:bold;
text-align:center;
line-height:1.8;
}
</style>
</head>
<body>
<div class="receipt">
<div class="header">
<div class="logo">JANJUA</div>
<div class="title">ORDER RECEIPT</div>
</div>
<div class="body">

<div class="row">
<span class="label">آرڈر کی تاریخ</span>
<span class="value">${escapeHtml($("receiptDate").textContent)}</span>
</div>

<div class="row">
<span class="label">Order ID</span>
<span class="value">${escapeHtml($("receiptOrderId").textContent)}</span>
</div>

<div class="row">
<span class="label">Product ID</span>
<span class="value">${escapeHtml($("receiptProductId").textContent)}</span>
</div>

<div class="row">
<span class="label">Product</span>
<span class="value">${escapeHtml($("receiptProductName").textContent)}</span>
</div>

<div class="row">
<span class="label">Customer Name</span>
<span class="value">${escapeHtml($("receiptCustomerName").textContent)}</span>
</div>

<div class="row">
<span class="label">Mobile / WhatsApp</span>
<span class="value">${escapeHtml($("receiptMobile").textContent)}</span>
</div>

<div class="row">
<span class="label">Delivery Address</span>
<span class="value">${escapeHtml($("receiptAddress").textContent)}</span>
</div>

<div class="row">
<span class="label">Quantity</span>
<span class="value">${escapeHtml($("receiptQuantity").textContent)}</span>
</div>

<div class="row">
<span class="label">Product Total</span>
<span class="value">${escapeHtml($("receiptProductTotal").textContent)}</span>
</div>

<div class="row">
<span class="label">Delivery Charges</span>
<span class="value">${escapeHtml($("receiptDelivery").textContent)}</span>
</div>

<div class="row">
<span class="label">Total Amount</span>
<span class="value">${escapeHtml($("receiptTotal").textContent)}</span>
</div>

<div class="note">
📦 آپ کا آرڈر 3 سے 4 دن کے اندر آپ کو ڈیلیور کر دیا جائے گا۔<br>
براہِ کرم اپنا موبائل نمبر آن رکھیں تاکہ Delivery کے وقت آپ سے رابطہ کیا جا سکے۔
</div>

</div>
</div>
</body>
</html>`;


    const blob =
      new Blob(
        [html],
        {
          type:"text/html;charset=utf-8"
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      `JANJUA-Receipt-${$("receiptOrderId").textContent}.html`;


    document.body.appendChild(link);

    link.click();

    link.remove();


    setTimeout(
      () => URL.revokeObjectURL(url),
      1000
    );

  }
);


$("newOrderBtn").addEventListener(
  "click",
  () => {

    window.location.href =
      "shop.html";

  }
);


function escapeHtml(value){

  return String(value ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

}


setupProduct();
