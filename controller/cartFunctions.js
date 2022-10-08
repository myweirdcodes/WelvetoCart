module.exports = {
    totalAmount:(cartData)=>{
         total = cartData.products.reduce((acc,curr)=>{
            acc += curr.productId.price*curr.quantity;
            return acc;

         },0)
         return total;
    }
}