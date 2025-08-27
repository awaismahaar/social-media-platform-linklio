"use client"
import React, { useState } from 'react';
import styled from 'styled-components';

const SearchInput = ({ setOpen }) => {
  const [input, setInput] = useState("");
  return (
    <StyledWrapper>
      <form className="form dark:!bg-neutral-600 dark:border-neutral-700">
        <label htmlFor="search">
          <input onFocus={() => setOpen(true)} required autoComplete="off" placeholder="Search here..." id="search" type="text" />
          <div className="icon">
            <svg strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="swap-on dark:!text-white">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
            <svg strokeWidth={2} stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="swap-off">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <button type="reset" className="close-btn">
            <svg viewBox="0 0 20 20" className="h-5 w-5 dark:!text-white" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" fillRule="evenodd" />
            </svg>
          </button>
        </label>
      </form>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .form {
    --input-bg: #f0f0f5;
   /*  background of input */
    --padding: 1.5em;
    --rotate: 80deg;
   /*  rotation degree of input*/
    --gap: 2em;
    /*  gap of items in input */
    --icon-change-color: #15A986;
   /*  when rotating changed icon color */
    --height: 40px;
   /*  height */
    width: 100%;
    max-width: 500px;
    padding-inline-end: 1em;
   /*  change this for padding in the end of input */
    background: var(--input-bg);
    position: relative;
    border-radius: 4px;
  }

  .form label {
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--height);
  }

  .form input {
    width: 100%;
    padding-inline-start: calc(var(--padding) + var(--gap));
    outline: none;
    background: none;
    border: 0;
  }
  /* style for both icons -- search,close */
  .form svg {
    /* display: block; */
    color: #111;
    transition: 0.3s cubic-bezier(.4,0,.2,1);
    position: absolute;
    height: 15px;
  }
  /* search icon */
  .icon {
    position: absolute;
    left: var(--padding);
    transition: 0.3s cubic-bezier(.4,0,.2,1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /* arrow-icon*/
  .swap-off {
    transform: rotate(-80deg);
    opacity: 0;
    visibility: hidden;
  }
  /* close button */
  .close-btn {
    /* removing default bg of button */
    background: none;
    border: none;
    right: calc(var(--padding) - var(--gap));
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #111;
    padding: 0.1em;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transition: 0.3s;
    opacity: 0;
    transform: scale(0);
    visibility: hidden;
  }

  .form input:focus ~ .icon {
    transform: rotate(var(--rotate)) scale(1.3);
  }

  .form input:focus ~ .icon .swap-off {
    opacity: 1;
    transform: rotate(-80deg);
    visibility: visible;
    color: var(--icon-change-color);
  }

  .form input:focus ~ .icon .swap-on {
    opacity: 0;
    visibility: visible;
  }

  .form input:valid ~ .icon {
    transform: scale(1.3) rotate(var(--rotate))
  }

  .form input:valid ~ .icon .swap-off {
    opacity: 1;
    visibility: visible;
    color: var(--icon-change-color);
  }

  .form input:valid ~ .icon .swap-on {
    opacity: 0;
    visibility: visible;
  }

  .form input:valid ~ .close-btn {
    opacity: 1;
    visibility: visible;
    transform: scale(1);
    transition: 0s;
  }`;

export default SearchInput;
