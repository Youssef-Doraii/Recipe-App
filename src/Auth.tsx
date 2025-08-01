import { useState, useEffect } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";
import "./styles/Auth.css";

interface AuthProps {
  onAuthSuccess?: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const supabase = useSupabaseClient();
  const session = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (session && onAuthSuccess) {
      onAuthSuccess();
    }
  }, [session, onAuthSuccess]);

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);

    if (!email || !password || (authType === "signUp" && !displayName)) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    if (authType === "signIn") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setInfo(
          "Sign up successful! Please check your email to confirm your account before signing in."
        );
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (session) {
    return (
      <div className="auth-container">
        <p>
          Welcome,{" "}
          {session.user.user_metadata?.display_name || session.user.email}!{" "}
        </p>
        <button className="auth-btn" onClick={handleLogout}>
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <h2>{authType === "signIn" ? "Sign In" : "Sign Up"}</h2>
      {error && <div className="auth-error">{error}</div>}
      {info && <div className="auth-info">{info}</div>}
      <button
        type="button"
        className="auth-btn google-btn"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? "Loading..." : "Sign in with Google"}
      </button>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="auth-input"
        autoComplete="email"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="auth-input"
        autoComplete={
          authType === "signUp" ? "new-password" : "current-password"
        }
        required
      />
      {authType === "signUp" && (
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="auth-input"
          required
        />
      )}
      <button onClick={handleAuth} disabled={loading} className="auth-btn">
        {loading ? "Loading..." : authType === "signIn" ? "Sign In" : "Sign Up"}
      </button>
      <p
        className="auth-toggle"
        onClick={() => {
          setAuthType(authType === "signIn" ? "signUp" : "signIn");
          setError(null);
          setInfo(null);
        }}
      >
        {authType === "signIn"
          ? "Don’t have an account? Sign Up"
          : "Already have an account? Sign In"}
      </p>
    </div>
  );
}
