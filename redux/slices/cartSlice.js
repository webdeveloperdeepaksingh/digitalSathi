import { createSlice } from "@reduxjs/toolkit";
import {toast} from 'react-toastify';

let initialCartItems = [];
 if (typeof window !== 'undefined') {
    // get the initial cart items from local storage or an empty array
     initialCartItems = localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];
   }

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: initialCartItems, // an array of cart items
        totalQuantity: initialCartItems.length, // the number of items in the cart
        totalPrice: initialCartItems.reduce((acc, items) => (Number(acc) + Number(items.prodDisc)),0),
      },   
    reducers:{
        addToCart:(state, action) =>{
            const {_id, prodName, prodImage, prodIntro, prodCat, prodType, prodVal, prodPrice, prodDisc, prodTax, prodDisct, prodAuth, prodCont, prodDate, prodTime, userId } = action.payload;
            const existingProduct = state.items.find(product => product._id === _id);
            // if the product is not in the cart, push it to the array
            if (!existingProduct) {
                state.items.push({_id, prodName, prodImage, prodIntro, prodCat, prodType, prodVal, prodPrice, prodDisc, prodTax, prodDisct, prodAuth, prodCont, prodDate, prodTime, userId });
                toast('Item added to cart...!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'success',
                    position: 'top-center'      
                  });
                // update the total quantity and price by adding the item quantity and price
                state.totalQuantity++;
                state.totalPrice += Number(prodDisc);
                // Set localStorage data
                if (typeof window !== 'undefined') {
                // save the cart items to local storage
                localStorage.setItem("cartItems", JSON.stringify(state.items));
             }  
            }else{
                toast('Item already added...!', {
                    hideProgressBar: false,
                    autoClose: 1000,
                    type: 'error',
                    position: 'top-center'      
                });
            }         
        },
        removeFromCart:(state, action) =>{
            const productId = action.payload._id;
            // find the index of the item to be removed
            const index = state.items.findIndex(item => item._id === productId);
            // update the total quantity and price by subtracting the item quantity and price
            state.totalQuantity--;
            state.totalPrice -= Number(state.items[index].prodDisc);
            // return a new array without the item
            state.items = state.items.filter((item) => item._id !== productId);
            
             if (typeof window !== 'undefined') {
                // save the cart items to local storage
                localStorage.setItem("cartItems", JSON.stringify(state.items));
             }
        },
        clearCart: (state) => {
            // Clear cart items, total quantity, and total price after succesful payment
            state.items = [];
            state.totalQuantity = 0;
            state.totalPrice = 0;
            if (typeof window !== 'undefined') {
             localStorage.removeItem("cartItems");
            }
        },
    }
});

export const {addToCart, removeFromCart, clearCart} = cartSlice.actions;
export default cartSlice.reducer;