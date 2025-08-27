"use client"
import axios from 'axios';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { LineSpinner } from 'ldrs/react'
import 'ldrs/react/LineSpinner.css'

const Otp = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(false);
  }, [])
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <LineSpinner
        size="40"
        stroke="3"
        speed="1"
        color="black"
      />
    </div>
  }
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next field
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    const email = localStorage.getItem("email") || "";
    console.log("Submitting OTP:", otpCode);

    try {
      setLoading(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/otp/verify-otp`, { otp: otpCode, email }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setOtp(['', '', '', '']);
        localStorage.removeItem("email")
        router.push("/auth/account")
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data.message);
      setOtp(['', '', '', '']);
    }
    finally {
      setLoading(false);
    }
  };
  return (
    <StyledWrapper>
        <form className="otp-Form dark:!bg-black/50 dark:!text-white" onSubmit={handleSubmit}>
          <div>
            <ShieldCheck className='w-20 h-20 text-blue-500' />
          </div>
          <span className="mainHeading text-2xl md:text-4xl dark:!text-white">Enter OTP Code</span>
          <p className="otpSubheading text-sm md:text-lg dark:!text-white">We have sent a verification code to your email address.</p>
          <div className="inputContainer">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                className="otp-input dark:!text-white"
                ref={(el) => (inputRefs.current[i] = el)}
                value={otp[i]}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                required
              />
            ))}
          </div>
           {!loading ? (
             <button className="verifyButton text-lg" type="submit">Verify</button>
           ): (
             <button disabled className="verifyButton text-lg" type="button">Loading...</button>
           )}
          <p className="resendNote dark:!text-white">Didn't verify the account? <Link href="/auth/account" className="resendBtn hover:underline">Go to Login page</Link></p>
        </form>
        
        
        
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .otp-Form {
    width: 380px;
    height: 450px;
    background-color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px 30px;
    gap: 20px;
    position: relative;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.082);
    border-radius: 15px;
  }

  .mainHeading {
    color: rgb(15, 15, 15);
    font-weight: 700;
  }

  .otpSubheading {
    color: black;
    line-height: 17px;
    text-align: center;
  }

  .inputContainer {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .otp-input {
    background-color: rgb(228, 228, 228);
    width: 50px;
    height: 50px;
    text-align: center;
    border: none;
    border-radius: 7px;
    caret-color: rgb(127, 129, 255);
    color: rgb(44, 44, 44);
    outline: none;
    font-weight: 600;
  }

  .otp-input:focus,
  .otp-input:valid {
    background-color: rgba(127, 129, 255, 0.199);
    transition-duration: .3s;
  }

  .verifyButton {
    width: 100%;
    height: 40px;
    border: none;
    background-color: rgb(127, 129, 255);
    color: white;
    font-weight: 600;
    cursor: pointer;
    border-radius: 10px;
    transition-duration: .2s;
  }

  .verifyButton:hover {
    background-color: rgb(144, 145, 255);
    transition-duration: .2s;
  }

  .exitBtn {
    position: absolute;
    top: 5px;
    right: 5px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.171);
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: none;
    color: black;
    cursor: pointer;
  }

  .resendNote {
    color: black;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .resendBtn {
    background-color: transparent;
    border: none;
    color: rgb(127, 129, 255);
    cursor: pointer;
    font-weight: 700;
  }`;

export default Otp;
