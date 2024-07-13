import { useState, useEffect } from 'react';
import React from 'react'
import ThemeToggle from './themeToggle';

const Navbar = () => {
  return (
    <div className='sticky top-0 9vh'>
        <nav className="text-white min-[1000px]:w-[80%] w-full m-auto py-4 px-7 flex justify-between rounded-b-lg sticky top-0 backdrop-blur-lg duration-300">
            <div className="logo flex items-center gap-2 cursor-pointer hover:scale-105 duration-200 transition-all">
                <img src="./logo.png" alt="" width="25"/>
                <h1 className='text-[20px] font-bold text-black dark:text-white'>DoneDeal</h1>
            </div>
            <div className="left flex gap-4 items-center">
            <ThemeToggle/>
            <ul className='flex gap-3 max-[450px]:hidden'>
                <li className='cursor-pointer hover:underline duration-100 hover:scale-105 hover:font-bold transition-all text-black dark:text-white'>Home</li>
                <li className='cursor-pointer hover:underline duration-100 hover:scale-105 hover:font-bold transition-all text-black dark:text-white'>Your task</li>
            </ul>
            </div>
        </nav>
    </div>
  )
}

export default Navbar
