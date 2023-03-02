<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script>
    function applyCoupon() {
      let couponCode = document.getElementById('couponCode').value
      if (couponCode) {
        let totalAmount = document.getElementById('totalAmount').value
        axios.post('/couponApply', { couponCode, totalAmount }).then((result) => {
          if (result.data) {
            console.log(result.data.success)
            document.getElementById('discountedAmount').innerHTML = `₹ :${result.data.totalAmount} /-`
            document.getElementById('totalAmount').value = result.data.totalAmount
            document.getElementById('discount').innerHTML = `₹ :${result.data._doc.discountAmount} /-`
            document.getElementById('discountPrice').value=result.data._doc.discountAmount
          }
          else {
            window.location.reload()
          }
        })
      }
      else {
        window.location.reload()
      }

    } 
  

   function submitCheckOut(){
 axios.post('/placeOrder',document.querySelector('#order'), {
  headers: {
    'Content-Type': 'application/json'
  }
}).then((result)=>{
if(result.data.COD){
  window.location.href='/orderSuccess'
}else{
 razorpayPayment(result.data)
}
})
   }
   function razorpayPayment(order){
    var options = {
    "key": "rzp_test_OyYcdgZL72bzUl", // Enter the Key ID generated from the Dashboard
    "amount": order.result.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": "E-Zone", //your business name
    "description": "Online Transaction",
    "image": "https://i.ibb.co/zSMfgvM/Logo.png",
    "order_id": order.result.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": function (response){
      
        verifyPayment(response,order)
    },
    "prefill": {
        "name": order.name, //your customer's name
        "email":  order.email,
        "contact": order.phone
    },
    "notes": {
        "address": "Razorpay Corporate Office"
    },
    "theme": {
        "color": "#3399cc"
    }
};
var rzp1 = new Razorpay(options);
 rzp1.open();
   }
 function verifyPayment(payment,order){
  console.log('verify')
    axios.post('/verifyPayment',{payment,order}).then((resp)=>{
      if(resp.data.success){
         window.location.href='/orderSuccess'
      }else{
        console.log("Payment failed")
      }
    })
   }


  </script>