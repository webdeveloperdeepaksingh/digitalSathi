"use client";
import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../../redux/slices/cartSlice';


export default function AddItemToCart({prodId}) {

  const dispatch = useDispatch();
  const handleAddToCart = (productData) =>{
    dispatch(addToCart(productData)); //calling addToCart reducer.
  }

  return (
    <div>
      <button onClick={()=>handleAddToCart(prodId)} className='font-bold py-2 w-full rounded-sm px-1 bg-amber-600 hover:bg-amber-500 text-white'>Add to Cart</button>
    </div>
  )
}
