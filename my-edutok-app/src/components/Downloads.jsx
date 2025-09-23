import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import './Download.css';

export default function AuthPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Rotating academic images with fallbacks
  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4nmBIsr0zNscdOy_L4VBG_Q9_EfYFEwg-vA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4nmBIsr0zNscdOy_L4VBG_Q9_EfYFEwg-vA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4nmBIsr0zNscdOy_L4VBG_Q9_EfYFEwg-vA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4nmBIsr0zNscdOy_L4VBG_Q9_EfYFEwg-vA&s",
  ];

  // Image preloading for smoother transitions
  useEffect(() => {
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const nextImage = useCallback(() => {
    setCurrentImage(prev => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [nextImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        console.log("Login data:", { email: formData.email, password: formData.password });
        setSuccessMessage("Login successful! Redirecting...");
      } else {
        console.log("Signup data:", formData);
        setSuccessMessage("Account created successfully! Welcome aboard!");
      }

      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch (error) {
      setErrors({ submit: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setSuccessMessage("");
  };

  const ImageTransition = ({ src, alt, isActive }) => (
    <motion.img
      src={src}
      alt={alt}
      className="absolute h-full w-full object-cover"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 1.5 }}
    />
  );

  return (
    <div className="flex h-screen w-screen font-sans overflow-hidden bg-gray-900">
      {/* Left Side - Branding with Hero Background */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            {images.map((image, index) => (
              <ImageTransition
                key={image}
                src={image}
                alt="Academic"
                isActive={index === currentImage}
              />
            ))}
          </AnimatePresence>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-purple-900/70 to-black/70"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative text-center p-8 z-10 text-white"
        >
          <motion.h1 
            className="text-6xl font-extrabold mb-6 tracking-wide drop-shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Shine Up
          </motion.h1>
          <motion.p 
            className="text-xl max-w-md mx-auto italic leading-relaxed text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Learn. Teach. Shine. <br /> Your academic journey, shared with the world.
          </motion.p>
        </motion.div>
      </div>

      {/* Right Side - Auth Card */}
      <div className="flex flex-col w-full lg:w-1/2 items-center justify-center px-6 bg-gradient-to-br from-purple-800 via-indigo-900 to-black">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20"
        >
          {/* Logo */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mb-6"
          >
            <motion.img
              src="/logo.png"
              alt="Shine Up Logo"
              className="w-20 h-20 drop-shadow-xl"
              whileHover={{ rotate: 5, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </motion.div>

          {/* Tabs */}
          <div className="flex mb-8 bg-white/5 rounded-xl p-1">
            <button
              className={`flex-1 py-3 font-semibold rounded-xl transition-all duration-300 ${
                isLogin
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 font-semibold rounded-xl transition-all duration-300 ${
                !isLogin
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center text-green-400 text-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
            onSubmit={handleSubmit}
          >
            {!isLogin && (
              <div>
                <div className={`flex items-center bg-white/10 rounded-lg px-4 py-3 border transition-all duration-300 ${
                  errors.fullName ? "border-red-400" : "border-white/20 focus-within:border-pink-400"
                }`}>
                  <User className="text-gray-300 mr-3" size={20} />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white placeholder-gray-400 focus:outline-none"
                  />
                </div>
                {errors.fullName && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs mt-1 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" />
                    {errors.fullName}
                  </motion.p>
                )}
              </div>
            )}

            <div>
              <div className={`flex items-center bg-white/10 rounded-lg px-4 py-3 border transition-all duration-300 ${
                errors.email ? "border-red-400" : "border-white/20 focus-within:border-pink-400"
              }`}>
                <Mail className="text-gray-300 mr-3" size={20} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-transparent flex-1 text-white placeholder-gray-400 focus:outline-none"
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs mt-1 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div>
              <div className={`flex items-center bg-white/10 rounded-lg px-4 py-3 border transition-all duration-300 ${
                errors.password ? "border-red-400" : "border-white/20 focus-within:border-pink-400"
              }`}>
                <Lock className="text-gray-300 mr-3" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="bg-transparent flex-1 text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs mt-1 flex items-center"
                >
                  <AlertCircle size={12} className="mr-1" />
                  {errors.password}
                </motion.p>
              )}
            </div>

            {!isLogin && (
              <div>
                <div className={`flex items-center bg-white/10 rounded-lg px-4 py-3 border transition-all duration-300 ${
                  errors.confirmPassword ? "border-red-400" : "border-white/20 focus-within:border-pink-400"
                }`}>
                  <Lock className="text-gray-300 mr-3" size={20} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="bg-transparent flex-1 text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-xs mt-1 flex items-center"
                  >
                    <AlertCircle size={12} className="mr-1" />
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </div>
            )}

            {errors.submit && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center flex items-center justify-center"
              >
                <AlertCircle size={16} className="mr-2" />
                {errors.submit}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg text-white font-bold shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 relative"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                <span>{isLogin ? "Log In" : "Create Account"}</span>
              )}
            </motion.button>
          </motion.form>

          {/* Switch Link */}
          <p className="mt-6 text-gray-300 text-center text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-pink-400 font-semibold hover:underline focus:outline-none"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}