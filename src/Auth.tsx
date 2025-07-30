import { useState } from "react";
import { useSupabaseClient, useSession } from "@supabase/auth-helpers-react";

export default function Auth() {
  const supabase = useSupabaseClient();
  const session = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState<"signIn" | "signUp">("signIn");

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
      <div className="p-4">
        <p>Logged in as: {session.user.email}</p>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2>{authType === "signIn" ? "Sign In" : "Sign Up"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 block"
      />
      <button
        onClick={handleAuth}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2"
      >
        {loading ? "Loading..." : authType === "signIn" ? "Sign In" : "Sign Up"}
      </button>
      <p
        className="text-sm mt-4 cursor-pointer text-blue-600 underline"
        onClick={() => setAuthType(authType === "signIn" ? "signUp" : "signIn")}
      >
        {authType === "signIn"
          ? "Don’t have an account? Sign Up"
          : "Already have an account? Sign In"}
      </p>
    </div>
  );
}
