"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPopup({ setShowLogin }) {
  const [currState, setCurrState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();

    let newUrl = url;

    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }

    try {
      const response = await axios.post(newUrl, data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid bg-black/60">

      <form
        onSubmit={onLogin}
        className="place-self-center w-[330px] bg-white text-gray-600 flex flex-col gap-6 p-7 rounded-lg shadow-lg"
      >

        {/* Title */}
        <div className="flex justify-between items-center text-black">
          <h2 className="text-xl font-semibold">{currState}</h2>

          <button
            type="button"
            onClick={() => setShowLogin(false)}
            className="text-xl font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">

          {currState === "Login" ? null : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
              className="border border-gray-300 p-2.5 rounded outline-none focus:ring-2 focus:ring-red-400"
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
            className="border border-gray-300 p-2.5 rounded outline-none focus:ring-2 focus:ring-red-400"
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
            className="border border-gray-300 p-2.5 rounded outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="bg-red-500 text-white py-2.5 rounded hover:bg-red-600 transition"
        >
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        {/* Terms */}
        <div className="flex items-start gap-2 text-sm">
          <input type="checkbox" required className="mt-1" />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>

        {/* Switch login/signup */}
        {currState === "Login" ? (
          <p className="text-sm">
            Create a new account?{" "}
            <span
              onClick={() => setCurrState("Sign Up")}
              className="text-red-500 font-medium cursor-pointer"
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="text-sm">
            Already have an account?{" "}
            <span
              onClick={() => setCurrState("Login")}
              className="text-red-500 font-medium cursor-pointer"
            >
              Login here
            </span>
          </p>
        )}
      </form>
    </div>
  );
}

