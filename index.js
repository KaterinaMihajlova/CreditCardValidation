const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

function resValid(){
    return {valid:true, message:""};
}
function resInvalid(message){
    return {valid:false, message:message};
}
function validateHolderName(holderName){
    if(holderName.match(/^[a-zA-Z]+ [a-zA-Z]+$/)){
        return resValid()
    }
    else{
        return resInvalid('Invalid Name and Last Name format!');
    }
}

function validateCardNumber(cardNum, cvc){
    if(cvc.match(/^\d{4}$/)){
        if(cardNum.match(/^(?:3[47][0-9]{13})$/)){
            return resValid()
        }
        else{
            resInvalid('Invalid American Express Card Format!');
        }
    }else if(cardNum.match(/^(?:4[0-9]{12}(?:[0-9]{3})?)$/)||cardNum.match(/^(?:5[1-5][0-9]{14})$/)){
        return resValid();
    }else{
        return resInvalid('Invalid card format!');
    }
}

function validateCVC(cvcCode){
  if((cvcCode.match(/^\d{3}$/))||(cvcCode.match(/^\d{4}$/))){
    return resValid();
  }else{
    return resInvalid('Invalid CVV/CVC!');
  }
}

function luhnCheck(cardNumber) {
    cardNumber = String(cardNumber);
    var sum = 0;
  
    for (var i = cardNumber.length - 1; i >= 0; i--) {
      var digit = parseInt(cardNumber.charAt(i), 10);
  
      if ((cardNumber.length - i) % 2 === 0) {
        digit *= 2;
        
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
    }
  
    if(sum % 10 === 0 && sum!=0){
        return resValid()
    }else{
        return resInvalid('Invalid card!');
    }
  }

  function validateDate(cardDate){
    if(cardDate==""){
        return resInvalid('Date is required!');
    }
    else{
        return resValid()
    }
  }
app.post("/api/validate",(req,res)=>{
    console.log(req.body.card, req.body.cardName, req.body.cardDate, req.body.cardCVC);
    const cardName = validateHolderName(req.body.cardName);
    const cardCVC = validateCVC(req.body.cardCVC);
    const card = validateCardNumber(req.body.card, req.body.cardCVC);
    const luhnCard = luhnCheck(req.body.card)
    const cardDate = validateDate(req.body.cardDate);
    
    res.json({
        valid: card.valid && cardCVC.valid && cardName.valid && luhnCard.valid && cardDate.valid,
        fields:{
            card,
            cardCVC,
            cardName,
            luhnCard,
            cardDate
        }
    });
})
app.listen(3000);