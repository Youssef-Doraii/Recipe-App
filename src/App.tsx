import { useState } from "react";
import {
  useSupabaseClient,
  useUser,
  SupabaseClient,
} from "@supabase/auth-helpers-react";

function App() {
  const supabase: SupabaseClient = useSupabaseClient();
  const user = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmail = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) console.error("❌ Sign-in error:", error.message);
    else console.log("✅ Signed in successfully!");
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("❌ Sign-out error:", error.message);
    else console.log("👋 Signed out!");
  };

  if (!user) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={signInWithEmail}>Sign In</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <p>
        ✅ Logged in as: <strong>{user.email}</strong>
      </p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

export default App;
