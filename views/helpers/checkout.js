{/* <script>   new WOW().init();</script>
<!--/.Footer-->
<script>
  function billingAddress(addId) {
    console.log(addId);
    $.ajax({
      url: '/billingAddress',
      data: {
        address: addId,
      },
      method: 'post',
      success: (res) => {
        console.log("this is from response",res);
        
        document.getElementById("firstName").value = res.address.firstName;
        document.getElementById("phoneNumber").value = res.address.phoneNumber;
        document.getElementById("email").value = res.address.email;
        document.getElementById("address").value = res.address.address;
        document.getElementById("lastName").value = res.address.lastName;
        document.getElementById("pincode").value = res.address.pincode;
        document.getElementById("city").value = res.address.city;
        document.getElementById("landmark").value = res.address.landmark;
        document.getElementById("state").value = res.address.state;

      },

      error: (error) => {
        alert('hierror')
        console.log(error)
      },
    })
  }


</script> */}