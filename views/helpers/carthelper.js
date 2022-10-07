// changeProdQuant: (req, res) => {
//     userHelpers.changeProdQuant(req.body).then(async (response) => {
//       response.total = await userHelpers.getTotalPrice(req.body.user);
//       response.totalBookingPrice = await userHelpers.getTotalBookingPrice(
//         req.body.user
//       );
//       res.json(response);
//     });
//   },




//   changeProdQuant: (details) => {
//     details.count = parseInt(details.count);
//     details.quantity = parseInt(details.quantity);
//     return new Promise(async (resolve, reject) => {
//       if (details.count == -1 && details.quantity == 1) {
//         db.get()
//           .collection(collection.CART_COLLECTION)
//           .updateOne(
//             { _id: objectId(details.cart) },
//             {
//               $pull: { products: { item: objectId(details.product) } },
//             }
//           )
//           .then((response) => {
//             resolve({ removeProduct: true });
//           });
//       } else {
//         db.get()
//           .collection(collection.CART_COLLECTION)
//           .updateOne(
//             {
//               "products.item": objectId(details.product),
//               _id: objectId(details.cart),
//             },
//             {
//               $inc: { "products.$.quantity": details.count },
//             }
//           )
//           .then((response) => {
//             resolve({ status: true });
//           });
//       }
//     });
//   },





//<script>
//	function changeQuantity(cartId, proId, count) {
//		console.log(cartId, proId, count, 'bnrrrrrrrrrrrrrrrrrrrrr')
//		let quantity = parseInt(document.getElementById(proId).innerHTML)
//$.ajax({
  //  url: '/changeProductQuantity',
    //method: 'POST',
    //data: {
//        prodId: proId,
//      cartId: cartId,
//        count: count
//        quantity:quantity
//    },
//    success: (response) => {
//        if(response.removeProduct){
//            alert('product removed from the cart')
//            location.reload()
//        }
//        else{
//           document.getElementById(prodId).innerHTML=quantity+count
//        }
//        
//    }
//})
//		
//	}
//</script>




	

