function addToCart(proId){
   event.preventDefault();
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


            Swal.fire('Hooray!', 'Product added to cart',
                  'success')

            // location.reload()
            // count = parseInt(count)+1
            // $("#cart-count").html(count)
          }
          else if(response.quantityIncrement){
            Swal.fire('Hooray!', 'Product already in cart, quantity increased by one!',
            'success')
          }
          else{
            Swal.fire('Sorry!', 'could not add product to Cart!',
            'Failed')
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


