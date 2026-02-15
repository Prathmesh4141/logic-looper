import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../services/firebase";
import {
  signInWithRedirect ,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { motion } from "framer-motion";
import { FaBrain } from "react-icons/fa";
import { getRedirectResult } from "firebase/auth";
import { useEffect } from "react";


export default function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const googleLogin = async () => {
    try {
      await signInWithRedirect(auth, provider);

      navigate("/game");
    } catch {
      setError("Google login failed. Try again.");
    }
  };

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result?.user) {
        navigate("/game");
      }
    });
  }, []);
  
  const signup = async () => {
    setError("");
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCred.user, {
        displayName: name,
      });

      navigate("/game");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already registered. Please login.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError("Signup failed. Try again.");
      }
    }
  };

  const login = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/game");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("No account found. Please sign up.");
      } else if (err.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else {
        setError("Login failed. Try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364]">

      <div className="absolute w-72 h-72 bg-indigo-500 rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>
<motion.div
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: [0, -10, 0], opacity: 1 }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="absolute top-20 flex justify-center w-full"
>
  <div className="relative">
    {/* glow */}
    <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 rounded-full"></div>

    <FaBrain className="text-indigo-300 text-6xl drop-shadow-lg" />
  </div>
</motion.div>


      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 w-80 text-center"
      >
        <h1 className="text-3xl font-bold text-white mb-1">
          🧠 Logic Looper
        </h1>
        <p className="text-gray-300 mb-6 text-sm">
          Train your brain daily
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 text-sm p-2 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-3 rounded-lg bg-white/80 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email address"
          className="w-full p-3 rounded-lg bg-white/80 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-white/80 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={signup}
          className="bg-green-500 hover:bg-green-600 text-white w-full py-2 rounded-lg mb-2 shadow-md"
        >
          Sign Up
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={login}
          className="bg-indigo-500 hover:bg-indigo-600 text-white w-full py-2 rounded-lg mb-2 shadow-md"
        >
          Login
        </motion.button>

        <div className="flex items-center gap-3 my-4 text-gray-400 text-xs">
          <div className="flex-1 h-px bg-gray-400/30"></div>
          OR
          <div className="flex-1 h-px bg-gray-400/30"></div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={googleLogin}
          className="bg-white text-gray-800 w-full py-2 rounded-lg shadow hover:bg-gray-100"
        >
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}
