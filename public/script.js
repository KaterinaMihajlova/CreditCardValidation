function applyValidation(field, data){
  if(data.valid){
    field.classList.replace("validation-invalid", "validation-valid");
  }else{
    field.classList.replace("validation-valid", "validation-invalid");
    field.innerHTML = data.message;
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
      applyValidation(cardDateError, json.fields.cardDate);
    })
  });
  
}
