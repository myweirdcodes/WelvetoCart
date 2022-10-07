function addToCart(proId){
    $.ajax({
       url:'/cart/'+proId,
       method:'get',
       success:(response)=>{
          if(response.status){
            console.log(response.status,'addtocart script') 
            let count = document.getElementById('cart-count')
            countValue = count.getAttribute('data-notify')
            console.log(countValue)
            count.setAttribute('data-notify',parseInt(countValue)+1)
            // location.reload()
            // count = parseInt(count)+1
            // $("#cart-count").html(count)
          }
       }
    })
}

function addToWishlist(proId){
   $.ajax({
      url:'/addToWishlist/'+proId,
      method:'get',
      success:(response)=>{
         if(response.status){
            let count = document.getElementById('wishlist-count')
            countValue = count.getAttribute('data-notify')
            count.setAttribute('data-notify',parseInt(countValue)+1)
         }
      }
   })
}