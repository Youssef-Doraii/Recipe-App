import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import "../src/styles/Auth.css";

interface AuthProps {
  onAuthSuccess?: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const supabase = useSupabaseClient();
  const session = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState<"signIn" | "signUp">("signIn");

  useEffect(() => {
    if (session && onAuthSuccess) {
      onAuthSuccess();
    }
  }, [session, onAuthSuccess]);

  const handleAuth = async () => {
    setLoading(true);
    if (authType === "signIn") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session) {
    return (
      <div className="auth-container">
        <p>Logged in as: {session.user.email}</p>
        <button className="auth-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>{authType === "signIn" ? "Sign In" : "Sign Up"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
      />
      <button onClick={handleAuth} disabled={loading} className="auth-btn">
        {loading ? "Loading..." : authType === "signIn" ? "Sign In" : "Sign Up"}
      </button>
      <p
        className="auth-toggle"
        onClick={() => setAuthType(authType === "signIn" ? "signUp" : "signIn")}
      >
        {authType === "signIn"
          ? "Don’t have an account? Sign Up"
          : "Already have an account? Sign In"}
      </p>
    </div>
  );
}
