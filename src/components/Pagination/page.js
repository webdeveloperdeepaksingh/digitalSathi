'use client';
import ReactPaginate from 'react-paginate';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import React from 'react';

export default function Pagination({totalPages, setCurrentPage, currentPage}) {

  const handlePageChange = ({selected}) => {
    setCurrentPage(selected);
   }

  const showNextButton = currentPage !== totalPages - 1;
  const showPrevButton = currentPage !== 0;

  return (
    <div>
      <ReactPaginate
        breakLabel={<span className='mr-4'>...</span>}
        nextLabel={
          showNextButton ? (<span className='flex justify-center items-center text-white font-bold w-8 h-8 mr-4 bg-amber-600 rounded-md'>
          <BsChevronRight/></span>) : null
        }
        onPageChange={handlePageChange}
        pageRangeDisplayed={5}
        pageCount={totalPages}
        previousLabel={
          showPrevButton ? 
          (<span className='flex justify-center items-center text-white w-8 h-8 mr-4 bg-amber-600 rounded-md'>
          <BsChevronLeft /></span>) : null
        }
        containerClassName='flex items-center justify-center mt-8 mb-4'
        pageClassName='flex items-center justify-center w-6 h-6 mr-4 rounded-md hover:bg-amber-500 hover:text-white hover:font-bold'
        activeClassName='bg-amber-500 text-white font-bold'
       />
    </div>
  )
}
