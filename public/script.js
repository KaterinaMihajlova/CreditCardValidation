function applyValidation(field, data){
  if(data.valid){
    field.classList.replace("validation-invalid", "validation-valid");
  }else{
    field.classList.replace("validation-valid", "validation-invalid");
    field.innerHTML = data.message;
  }
}

function applyLuhnValidation(field, data){
  if(data.valid){
    field.classList.replace("validation-invalid", "validation-valid");
    document.getElementById("cardNumber").style.border = "thick solid #FF0000";
  }else{
    field.classList.replace("validation-valid", "validation-invalid");
    field.innerHTML = data.message;
    document.getElementById("cardNumber").style.border = "thick solid #00FF00";
  }
}

function validate()
{
  var card = document.getElementsByName("card_number");
  var cardName = document.getElementsByName("card_holder");
  var cardDate = document.getElementsByName("expiry_date");
  var cardCVC = document.getElementsByName("cvc");
  var luhnCard = document.getElementsByName("card_number");
  var cardError = document.getElementById("card_number_error");
  var cardNameError = document.getElementById("card_holder_error");
  var cardCVCError = document.getElementById("cvc_error");
  var cardDateError = document.getElementById("date_error");
  console.log(card[0].value +" "+ cardName[0].value  + " " + cardDate[0].value+ " " + cardCVC[0].value);


  if(!cardName[0].value.match((/^[a-zA-Z]+ [a-zA-Z]+$/))){
    document.getElementById("cardHolder").style.border = "thick solid #FF0000";
    alert('Please enter a Name and Last Name in the right format.');
    return ;
  } else{
    document.getElementById("cardHolder").style.border = "thick solid #00FF00";
  }
  
 if (!card[0].value.match(/^4[0-9]{12}(?:[0-9]{3})?$/)&&
      !card[0].value.match(/^5[1-5][0-9]{14}$/)&&
      !card[0].value.match(/^3[47][0-9]{13}$/)
  ) {
    document.getElementById("cardNumber").style.border = "thick solid #FF0000";
    alert('Please enter a valid credit card number.');
    return;
  }
  else{
    document.getElementById("cardNumber").style.border = "thick solid #00FF00";
  }

  if(cardDate[0].value == ""){
    document.getElementById("exp").style.border = "thick solid #FF0000";
    alert('Please enter a valid date.');
    return;
  } else{
    document.getElementById("exp").style.border = "thick solid #00FF00";
  }

  if(!cardCVC[0].value.match(/^\d{3}$/)&&
     !cardCVC[0].value.match(/^\d{4}$/)
  ){
    document.getElementById("cvcNumber").style.border = "thick solid #FF0000";
    alert('Please enter a valid CVC/CVV .');
    return;
  }else{
    document.getElementById("cvcNumber").style.border = "thick solid #00FF00";
  }
  
  fetch("/api/validate", {
    method:"POST", 
    body:JSON.stringify({"card": card[0].value, "cardName":cardName[0].value, "cardDate":cardDate[0].value, "cardCVC":cardCVC[0].value, "luhnCard":luhnCard[0].value}), 
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(resp=>{
    resp.json().then(json=>{
      applyValidation(cardError, json.fields.card);
      applyValidation(cardNameError, json.fields.cardName);
      applyValidation(cardCVCError, json.fields.cardCVC);
      applyValidation(cardError, json.fields.luhnCard);
      applyLuhnValidation(cardDateError, json.fields.cardDate);
    })
  });
  
}
