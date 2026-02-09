// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../../../firebaseConfig";
// import "./Login.css";
// import api from "./../../../axiosConfig";

// const Login: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const firebaseUser = result.user;
//       const idToken = await firebaseUser.getIdToken();
//       // const idToken = await firebaseUser.getIdToken(true);
//       console.log("ID_TOKEN", idToken);
//       // Send idToken to your backend
//       const response = await api.post(
//         `/auth/login`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${idToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("response>>", response);

//       const token = response.data.data.token;
//       const user = response.data.data.user;
//       console.log(token);

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       navigate("/dashboard");
//     } catch (err: any) {
//       console.error("Google login error:", err);

//       if (
//         err.response?.status === 401 ||
//         err.response?.data?.message?.includes("email")
//       ) {
//         setError("Email is not valid");
//       } else {
//         setError("Google Sign-In failed");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form">
//         <h2>Login</h2>
//         {error && <p className="error">{error}</p>}

//         <button
//           type="button"
//           className="google-btn"
//           onClick={handleGoogleLogin}
//           disabled={loading}
//         >
//           {loading ? "Please wait..." : "Continue with Google"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../../../firebaseConfig";
// import "./Login.css";
// import api from "./../../../axiosConfig";
// import Lottie from "lottie-react";
// import loginn from "./../../assets/Login.json";

// const Login: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   const handleEmailLogin = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await api.post(
//         "/auth/login",
//         { email },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       const token = response.data.data.token;
//       const user = response.data.data.user;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       navigate("/dashboard");
//     } catch (err: any) {
//       console.error("Email login error:", err);
//       if (
//         err.response?.status === 401 ||
//         err.response?.data?.message?.includes("email")
//       ) {
//         setError("Invalid email address.");
//       } else {
//         setError("Login failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const firebaseUser = result.user;
//       const idToken = await firebaseUser.getIdToken();

//       const response = await api.post(
//         "/auth/login",
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${idToken}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       const token = response.data.data.token;
//       const user = response.data.data.user;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       navigate("/dashboard");
//     } catch (err: any) {
//       console.error("Google login error:", err);
//       if (
//         err.response?.status === 401 ||
//         err.response?.data?.message?.includes("email")
//       ) {
//         setError("Google email is not allowed.");
//       } else {
//         setError("Google Sign-In failed.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={(e) => e.preventDefault()}>
//         <Lottie animationData={loginn} loop={false} style={{ height: 150 }} />
//         <h2>Login</h2>
//         {error && <p className="error">{error}</p>}

//         <button
//           type="button"
//           className="google-btn"
//           onClick={handleGoogleLogin}
//           disabled={loading}
//         >
//           {loading ? "Please wait..." : "Continue with Google"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { signInWithPopup } from "firebase/auth";
// import { auth, googleProvider } from "../../../firebaseConfig";
// import "./Login.css";
// import api from "./../../../axiosConfig";
// import Lottie from "lottie-react";
// import loginn from "./../../assets/Login.json";

// const Login: React.FC = () => {
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/dashboard");
//     }
//   }, [navigate]);

//   const handleEmailLogin = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const response = await api.post(
//         "/auth/login",
//         { email },
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const token = response.data.data.token;
//       const user = response.data.data.user;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       navigate("/dashboard");
//     } catch (err: any) {
//       console.error("Email login error:", err);
//       if (
//         err.response?.status === 401 ||
//         err.response?.data?.message?.includes("email")
//       ) {
//         setError("Invalid email address.");
//       } else {
//         setError("Login failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       const firebaseUser = result.user;
//       const idToken = await firebaseUser.getIdToken();

//       const response = await api.post(
//         "/auth/login",
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${idToken}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const token = response.data.data.token;
//       const user = response.data.data.user;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       navigate("/dashboard");
//     } catch (err: any) {
//       console.error("Google login error:", err);
//       if (
//         err.response?.status === 401 ||
//         err.response?.data?.message?.includes("email")
//       ) {
//         setError("Google email is not allowed.");
//       } else {
//         setError("Google Sign-In failed.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form className="login-form" onSubmit={(e) => e.preventDefault()}>
//         <Lottie animationData={loginn} loop={false} style={{ height: 150 }} />
//         <h2>Login</h2>

//         {error && <p className="error">{error}</p>}

//         {/* Email Input */}
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           disabled={loading}
//           className="email-input"
//         />

//         {/* Email Login Button */}
//         <button
//           type="button"
//           className="login-btn"
//           onClick={handleEmailLogin}
//           disabled={loading || !email.trim()}
//         >
//           {loading ? "Please wait..." : "Login"}
//         </button>

//         {/* OR Separator */}
//         <div className="or-separator">OR</div>

//         {/* Google Login Button */}
//         <button
//           type="button"
//           className="google-btn"
//           onClick={handleGoogleLogin}
//           disabled={loading}
//         >
//           {loading ? "Please wait..." : "Continue with Google"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../axiosConfig";
import loginn from "./../../assets/Login.json";
import Lottie from "lottie-react";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form
        className="login-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <h2>Login</h2>
        <Lottie animationData={loginn} loop={false} style={{ height: 150 }} />

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="form-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="form-input"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
