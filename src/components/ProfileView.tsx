import React, { useState } from "react";
import { User, Mail, ShieldAlert, LogOut, Loader2, Sparkles, KeyRound, Award, BookOpen, Clock, Heart, ClipboardCheck } from "lucide-react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, signOut } from "firebase/auth";

interface ProfileViewProps {
  user: any; // User object from Firebase
  role: "user" | "admin";
  stats: { totalSummaries: number; readingTimeSaved: number };
  onSignInSuccess: (user: any) => void;
  onSignOutSuccess: () => void;
}

export function ProfileView({
  user,
  role,
  stats,
  onSignInSuccess,
  onSignOutSuccess,
}: ProfileViewProps) {
  // Auth Form State
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const clearMessages = () => {
    setErrorMsg(null);
    setInfoMsg(null);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    clearMessages();
    try {
      const res = await signInWithPopup(auth, googleProvider);
      onSignInSuccess(res.user);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message?.includes("configurations") || err.message?.includes("authDomain")
          ? "Firebase error: Google Provider setup invalid. Please verify the Firebase setup UI."
          : err.message || "Failed to authorize with Google."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    clearMessages();

    try {
      if (activeTab === "login") {
        const res = await signInWithEmailAndPassword(auth, email, password);
        onSignInSuccess(res.user);
      } else {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, {
          displayName: displayName || email.split("@")[0],
        });
        onSignInSuccess(auth.currentUser);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "auth/operation-not-allowed") {
        setErrorMsg("Email/Password Auth is not enabled yet in your Firebase console. Go to Auth > Sign-in Method to enable.");
      } else {
        setErrorMsg(err.message || "Email authentication failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg("Please type your email address first so we can transmit a password reset email link.");
      return;
    }
    setLoading(true);
    clearMessages();
    try {
      await sendPasswordResetEmail(auth, email);
      setInfoMsg("A password reset link was sent to your inbox. Check your emails.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Password reset email failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    clearMessages();
    try {
      await signOut(auth);
      onSignOutSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to sign out.");
    } finally {
      setLoading(false);
    }
  };

  const copyUid = () => {
    if (user) {
      navigator.clipboard.writeText(user.uid);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const timeSavedText = (stats.readingTimeSaved / 6).toFixed(1);

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-fade-in p-1">
      {/* If LOGGED IN Profile screen */}
      {user ? (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-gradient-to-tr from-surface-container to-surface-container-high border border-outline-variant/15 rounded-3xl p-8 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-400/5 rounded-full blur-[60px]" />
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-secondary opacity-75 blur animate-pulse" />
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-full border-2 border-background relative object-cover bg-surface-container-high"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full border-2 border-background bg-surface-container-highest flex items-center justify-center text-secondary font-extrabold text-2xl relative">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-xl md:text-2xl font-black text-on-surface">
                  {user.displayName || "SmartNote Explorer"}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium flex items-center justify-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </p>
                {role === "admin" && (
                  <span className="inline-flex mt-2 items-center gap-1 px-3 py-1 bg-cyan-950/20 border border-cyan-500/30 text-cyan-400 font-extrabold text-[10px] uppercase font-mono rounded-full">
                    <ShieldAlert className="w-3 h-3 text-cyan-400" />
                    Administrator privileges active
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Productivity Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container/40 p-5 rounded-2xl border border-outline-variant/10 text-center space-y-1">
              <BookOpen className="w-6 h-6 text-secondary mx-auto mb-1.5" />
              <p className="text-2xl font-bold tracking-tight">{stats.totalSummaries}</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold font-mono">
                Notes Cataloged
              </p>
            </div>

            <div className="bg-surface-container/40 p-5 rounded-2xl border border-outline-variant/10 text-center space-y-1">
              <Clock className="w-6 h-6 text-primary mx-auto mb-1.5" />
              <p className="text-2xl font-bold tracking-tight">{timeSavedText} hrs</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold font-mono">
                Study Time Saved
              </p>
            </div>
          </div>

          {/* Metadata system properties box */}
          <div className="bg-surface-container/30 border border-outline-variant/10 p-5 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-secondary uppercase font-mono tracking-widest border-b border-outline-variant/5 pb-2">
              System Configuration
            </h4>

            <div className="space-y-3.5 text-xs text-on-surface-variant font-medium">
              <div className="flex justify-between items-center bg-surface-container-low/40 p-3 rounded-xl border border-outline-variant/5">
                <span>Unique User Token ID (UID):</span>
                <button
                  type="button"
                  onClick={copyUid}
                  className="font-mono text-[10px] bg-surface-container-high/60 px-3 py-1.5 rounded-lg border border-outline-variant/10 text-secondary hover:text-primary transition-all flex items-center gap-1 cursor-pointer"
                >
                  <ClipboardCheck className="w-3 h-3 shrink-0" />
                  <span>{isCopied ? "Copied!" : "Copy UID"}</span>
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span>Account Provider:</span>
                <span className="font-bold text-on-surface font-sans uppercase">
                  {user.providerData?.[0]?.providerId === "google.com" ? "Google login" : "Email & Password"}
                </span>
              </div>
            </div>
          </div>

          {/* Sign out */}
          <div className="flex justify-center">
            <button
              onClick={handleSignOut}
              className="px-8 py-3.5 bg-error-container/15 hover:bg-error-container/35 text-error font-extrabold text-sm uppercase tracking-wider border border-error/20 rounded-2xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Log out of SmartNote</span>
            </button>
          </div>
        </div>
      ) : (
        /* If LOGGED OUT Auth panel */
        <div className="bg-surface-container/50 backdrop-blur-md rounded-3xl border border-outline-variant/20 shadow-xl overflow-hidden">
          {/* Header tabs login vs signup */}
          <div className="grid grid-cols-2 text-center border-b border-outline-variant/10 bg-surface-container-low/50">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                clearMessages();
              }}
              className={`py-4 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "login"
                  ? "text-secondary border-b-2 border-secondary bg-surface-container/30"
                  : "text-on-surface-variant hover:bg-surface-variant/20"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("signup");
                clearMessages();
              }}
              className={`py-4 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                activeTab === "signup"
                  ? "text-secondary border-b-2 border-secondary bg-surface-container/30"
                  : "text-on-surface-variant hover:bg-surface-variant/20"
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-secondary/15 rounded-xl flex items-center justify-center text-secondary mx-auto mb-2">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold">Secure Your Custom Notes</h3>
              <p className="text-on-surface-variant text-xs max-w-xs mx-auto">
                Sign in to persist your parsed documents, bookmarks, history, and key flashcards.
              </p>
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="bg-error-container/15 border border-error/20 rounded-xl p-3 flex gap-2.5 items-start text-xs text-error">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-normal">{errorMsg}</p>
              </div>
            )}

            {infoMsg && (
              <div className="bg-secondary-container/10 border border-secondary/20 rounded-xl p-3 flex gap-2.5 items-start text-xs text-secondary">
                <ClipboardCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-normal">{infoMsg}</p>
              </div>
            )}

            {/* Core credentials form */}
            <form onSubmit={handleEmailAuthSubmit} className="space-y-4">
              {activeTab === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full bg-surface-container/40 border border-outline-variant/15 rounded-xl px-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                    placeholder="Enter Name"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container/40 border border-outline-variant/15 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold font-mono tracking-widest text-on-surface-variant uppercase">
                    Secrets Password
                  </label>
                  {activeTab === "login" && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] font-bold text-secondary hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-surface-container/40 border border-outline-variant/15 rounded-xl pl-11 pr-4 py-3 text-sm focus:border-secondary focus:outline-none transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 bg-primary text-on-primary rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Authorization...</span>
                  </>
                ) : (
                  <span>{activeTab === "login" ? "Login with credentials" : "Create Account"}</span>
                )}
              </button>
            </form>

            {/* Alternating Divider */}
            <div className="flex items-center justify-between py-2">
              <hr className="w-1/3 border-outline-variant/10" />
              <span className="text-[9px] uppercase font-bold text-on-surface-variant/80 tracking-widest">
                OR SIGN IN WITH
              </span>
              <hr className="w-1/3 border-outline-variant/10" />
            </div>

            {/* Google provider login */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-4 bg-surface-container-high/60 border border-outline-variant/20 rounded-xl font-bold text-sm tracking-wide text-on-surface hover:bg-surface-variant/20 flex items-center justify-center gap-3.5 cursor-pointer disabled:opacity-40"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.57 15.02 1 12 1 7.35 1 3.25 3.65 1.15 7.55l3.86 3C5.96 7.42 8.72 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.82-.07-1.6-.2-2.36H12v4.51h6.46C18.18 15.69 17 17.06 15 18.06l3.8 2.95c2.22-2.05 3.69-5.07 3.69-8.74z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.01 10.55c-.24-.72-.37-1.49-.37-2.3s.13-1.58.37-2.3l-3.86-3C.43 4.45 0 6.18 0 8.24s.43 3.79 1.15 5.29l3.86-2.98z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.8-2.95c-1.05.7-2.4 1.13-4.15 1.13-3.28 0-6.04-2.38-7.03-5.59l-3.86 2.99C3.25 20.35 7.35 23 12 23z"
                />
              </svg>
              <span>Authorize with Google Workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
