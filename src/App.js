import { Navigation } from "lucide-react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig"; // change if your file name is different
import { useNavigate } from "react-router-dom";
export default function App() {

  // ✅ MUST be inside component
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Login function
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/map");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(to bottom right, #eff6ff, #eef2ff, #f5f3ff)"
    }}>

      <div style={{ width: "100%", maxWidth: "400px", padding: "20px" }}>
        
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
        }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "25px" }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
              <div style={{
                background: "linear-gradient(to bottom right, #2563eb, #4f46e5)",
                padding: "10px",
                borderRadius: "8px"
              }}>
                <Navigation size={28} color="white" />
              </div>
              <h1 style={{ fontSize: "24px", margin: 0 }}>NavigateU</h1>
            </div>
            <p style={{ fontSize: "14px", color: "gray" }}>
              Accessible Navigation System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>

            <div style={{ marginBottom: "15px" }}>
              <label>Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email} // ✅ connected
                onChange={(e) => setEmail(e.target.value)} // ✅ connected
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password} // ✅ connected
                onChange={(e) => setPassword(e.target.value)} // ✅ connected
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "none",
                background: "linear-gradient(to right, #2563eb, #4f46e5)",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
              Log in
            </button>
          </form>

          <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
            Don't have an account? <span style={{ color: "blue" }}>Sign up</span>
          </p>

        </div>
      </div>
    </div>
  );
}