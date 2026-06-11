import React, { useState, useEffect } from "react";
import {
  Brain,
  LayoutDashboard,
  Plus,
  History,
  User,
  Shield,
  Sparkles,
  LogOut,
  Moon,
  Sun,
  Menu,
  X,
  Star
} from "lucide-react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, collection, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "./firebase";
import { AISummary, UserProfile, AIMode } from "./types";

// Import Views
import { LandingPage } from "./components/LandingPage";
import { DashboardView } from "./components/DashboardView";
import { GenerateView } from "./components/GenerateView";
import { SummaryDetail } from "./components/SummaryDetail";
import { HistoryView } from "./components/HistoryView";
import { ProfileView } from "./components/ProfileView";
import { AdminPanel } from "./components/AdminPanel";

// Premium Pre-populated Client-side fallbacks & examples
import { INITIAL_EXAMPLE_SUMMARIES } from "./mockData";

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [summaries, setSummaries] = useState<AISummary[]>(INITIAL_EXAMPLE_SUMMARIES);
  
  // Navigation
  const [currentView, setCurrentView] = useState<"landing" | "dashboard" | "generate" | "history" | "profile" | "admin">("landing");
  const [selectedSummary, setSelectedSummary] = useState<AISummary | null>(null);
  
  // Loading & menus state
  const [loading, setLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 1. Firebase Authentication Observability
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setCurrentUser(fbUser);
        
        // Setup User record inside Firestore or load existing
        const userRef = doc(db, "users", fbUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUserProfile(data);
          } else {
            // New user inside our system - construct standard Profile Schema
            const newProfile: UserProfile = {
              userId: fbUser.uid,
              email: fbUser.email || "",
              displayName: fbUser.displayName || fbUser.email?.split("@")[0] || "Explorer",
              photoURL: fbUser.photoURL || "",
              role: "user", // Default standard role
              totalSummaries: 0,
              readingTimeSaved: 0.0,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          // Handle fail gracefully while offline/during setup
          console.warn("User profile fetch skipped/failed. Proceeding in client-only mode: ", err);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setSummaries(INITIAL_EXAMPLE_SUMMARIES); // revert back to high-quality mockup examples
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-time Summaries Database Listening
  useEffect(() => {
    if (!currentUser) return;

    const summariesRef = collection(db, "users", currentUser.uid, "summaries");
    const unsubscribe = onSnapshot(summariesRef, 
      (snapshot) => {
        const fetched: AISummary[] = [];
        snapshot.forEach((docSnap) => {
          fetched.push(docSnap.data() as AISummary);
        });
        
        // Sort summaries by timestamp
        fetched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        // If there are no custom user summaries inside DB, prepend mock examples
        if (fetched.length === 0) {
          setSummaries(INITIAL_EXAMPLE_SUMMARIES);
        } else {
          setSummaries(fetched);
        }
      },
      (error) => {
        console.warn("Firestore listener disconnected. Operating with local memory store.", error);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Auth synchronization handlers
  const handleSignInSuccess = (fbUser: any) => {
    setCurrentUser(fbUser);
    setCurrentView("dashboard");
  };

  const handleSignOutSuccess = () => {
    setCurrentUser(null);
    setUserProfile(null);
    setCurrentView("landing");
    setSelectedSummary(null);
  };

  // 3. AI Note Summary Generation Engine
  const handleGenerateSummary = async (
    text: string,
    language: "en" | "hi" | "bn",
    mode: AIMode,
    explainLikeIm5: boolean,
    fileName?: string
  ) => {
    setLoading(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language, mode, explainLikeIm5 }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.error || "System was unable to contact the server-side compiler.");
      }

      const summaryResult = await response.json();
      
      // Calculate original statistics
      const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
      const charCount = text.length;

      // Construct final unified AISummary entity
      const newSummary: AISummary = {
        summaryId: Math.random().toString(36).substring(2, 11),
        userId: currentUser?.uid || "mock-user-id",
        title: summaryResult.title || "AI Analyzed Draft Document",
        originalText: text,
        fileType: fileName ? (fileName.split(".").pop() as any) || "txt" : "manual",
        fileName,
        shortSummary: summaryResult.shortSummary || "A clean high-level summary.",
        detailedSummary: summaryResult.detailedSummary || "A detailed breakdown of document specifications.",
        language,
        category: summaryResult.category || "General",
        sentiment: summaryResult.sentiment || "Neutral",
        difficulty: summaryResult.difficulty || "medium",
        readingTime: summaryResult.readingTime || 2,
        explainLikeIm5: summaryResult.explainLikeIm5 || "Simplified analogy.",
        keyPoints: summaryResult.keyPoints || [],
        actionItems: summaryResult.actionItems || [],
        studyNotes: summaryResult.studyNotes || "Notes details.",
        questions: summaryResult.questions || [],
        flashcards: summaryResult.flashcards || [],
        mindMap: summaryResult.mindMap || { name: "Root node", children: [] },
        keywords: summaryResult.keywords || [],
        importantDatesNumbersFullList: summaryResult.importantDatesNumbersFullList || [],
        isBookmarked: false,
        createdAt: new Date().toISOString(),
        wordCount,
        charCount,
      };

      // 4. Persistence handling (Firestore DB vs Local Storage)
      if (currentUser) {
        // Authenticated users save directly to their Cloud Firestore Sandbox
        const docRef = doc(db, "users", currentUser.uid, "summaries", newSummary.summaryId);
        try {
          await setDoc(docRef, newSummary);

          // Update user aggregation metrics inside profile
          const userRef = doc(db, "users", currentUser.uid);
          const currentTotal = userProfile?.totalSummaries || 0;
          const currentReadingSaved = userProfile?.readingTimeSaved || 0.0;
          const updatedTotal = currentTotal + 1;
          const updatedReadingSaved = currentReadingSaved + newSummary.readingTime;

          await updateDoc(userRef, {
            totalSummaries: updatedTotal,
            readingTimeSaved: updatedReadingSaved,
          });

          if (userProfile) {
            setUserProfile({
              ...userProfile,
              totalSummaries: updatedTotal,
              readingTimeSaved: updatedReadingSaved,
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/summaries/${newSummary.summaryId}`);
        }
      } else {
        // Guest Users save in localized memory state (Temporary Sandbox)
        setSummaries((prev) => [newSummary, ...prev]);
        
        // Guide guest user regarding Firestore capability
        alert("Summary created successfully! Sign up or login inside the Profile tab to persist your document analyses permanently to the cloud.");
      }

      setSelectedSummary(newSummary);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong during generation. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Bookmark status
  const handleToggleBookmark = async (e: React.MouseEvent, summary: AISummary) => {
    e.stopPropagation(); // prevent card trigger select
    const newStatus = !summary.isBookmarked;

    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid, "summaries", summary.summaryId);
      try {
        await updateDoc(docRef, { isBookmarked: newStatus });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}/summaries/${summary.summaryId}`);
      }
    } else {
      setSummaries((prev) =>
        prev.map((item) =>
          item.summaryId === summary.summaryId ? { ...item, isBookmarked: newStatus } : item
        )
      );
    }

    if (selectedSummary && selectedSummary.summaryId === summary.summaryId) {
      setSelectedSummary((prev) => prev ? { ...prev, isBookmarked: newStatus } : null);
    }
  };

  // Delete Individual Summary
  const handleDeleteSummary = async (summaryId: string) => {
    if (currentUser) {
      const docRef = doc(db, "users", currentUser.uid, "summaries", summaryId);
      try {
        await deleteDoc(docRef);
        
        // Decrement user stats
        const userRef = doc(db, "users", currentUser.uid);
        const currentTotal = userProfile?.totalSummaries || 0;
        const updatedTotal = Math.max(0, currentTotal - 1);
        await updateDoc(userRef, { totalSummaries: updatedTotal });
        if (userProfile) {
          setUserProfile({ ...userProfile, totalSummaries: updatedTotal });
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/summaries/${summaryId}`);
      }
    } else {
      setSummaries((prev) => prev.filter((item) => item.summaryId !== summaryId));
    }

    setSelectedSummary(null);
    setCurrentView("dashboard");
  };

  const handleSelectSummaryCard = (summary: AISummary) => {
    setSelectedSummary(summary);
  };

  const currentRole = userProfile?.role || "user";

  return (
    <div className="min-h-screen bg-background flex">
      {/* 1. SIDEBAR (Desktop navigation drawer) */}
      <aside className="hidden lg:flex flex-col w-64 bg-surface-container/60 border-r border-outline-variant/15 p-6 space-y-8 backdrop-blur-md shrink-0">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-9 h-9 bg-primary/20 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wide text-on-surface">SmartNote AI</h1>
            <span className="text-[9px] uppercase tracking-wider font-bold font-mono text-on-surface-variant leading-none">
              v1.0.0 Stable
            </span>
          </div>
        </div>

        {/* Primary Views routes list */}
        <nav className="flex-1 space-y-1.5 font-sans">
          {[
            { id: "landing", label: "Overview", icon: Sparkles },
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "generate", label: "New Summary", icon: Plus },
            { id: "history", label: "History", icon: History },
            { id: "profile", label: "Profile", icon: User },
            ...(currentRole === "admin" ? [{ id: "admin", label: "Admin Console", icon: Shield }] : []),
          ].map((item) => {
            const ItemIcon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as any);
                  setSelectedSummary(null);
                }}
                className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/10"
                    : "text-on-surface-variant hover:bg-surface-variant/20 hover:text-on-surface"
                }`}
              >
                <ItemIcon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile button footer */}
        {currentUser && (
          <div className="border-t border-outline-variant/15 pt-5 space-y-4">
            <div className="flex items-center gap-3 px-1">
              <div className="w-9 h-9 rounded-full bg-secondary-container/10 border border-secondary/20 flex items-center justify-center font-bold text-sm text-secondary">
                {currentUser.displayName?.charAt(0).toUpperCase() || "S"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold truncate text-on-surface">
                  {currentUser.displayName || "SmartNote Explorer"}
                </p>
                <p className="text-[10px] text-on-surface-variant truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleSignOutSuccess}
              className="w-full py-2.5 bg-error-container/10 hover:bg-error-container/20 border border-error/15 text-error text-[10px] font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </aside>

      {/* 2. MAIN SYSTEM VIEW CONTAINER WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top AppBar Mobile header */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-outline-variant/10 bg-surface-container/40 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-secondary" />
            <span className="font-extrabold text-sm tracking-wider uppercase text-on-surface font-sans">
              SmartNote AI
            </span>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 hover:bg-surface-variant/30 rounded-lg text-on-surface cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile menu navigation drawer popup */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[53px] bg-background border-b border-outline-variant/15 z-40 p-6 space-y-6 shadow-2xl animate-fade-in no-print">
            <nav className="space-y-1.5">
              {[
                { id: "landing", label: "Overview", icon: Sparkles },
                { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                { id: "generate", label: "New Summary", icon: Plus },
                { id: "history", label: "History", icon: History },
                { id: "profile", label: "Profile", icon: User },
                ...(currentRole === "admin" ? [{ id: "admin", label: "Admin Console", icon: Shield }] : []),
              ].map((item) => {
                const ItemIcon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id as any);
                      setSelectedSummary(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-variant/20"
                    }`}
                  >
                    <ItemIcon className="w-4.5 h-4.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {currentUser && (
              <div className="border-t border-outline-variant/10 pt-5 flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant truncate pr-4">
                  Logged in as: <strong>{currentUser.email}</strong>
                </span>
                <button
                  onClick={() => {
                    handleSignOutSuccess();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3.5 py-1.5 bg-error-container/20 hover:bg-error-container/30 text-error text-[10px] font-bold uppercase rounded-lg border border-error/10 cursor-pointer"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}

        {/* Core dynamic body layout content container */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full overflow-y-auto">
          {selectedSummary ? (
            <SummaryDetail
              summary={selectedSummary}
              onBack={() => setSelectedSummary(null)}
              onToggleBookmark={handleToggleBookmark}
              onDelete={handleDeleteSummary}
            />
          ) : (
            <>
              {currentView === "landing" && (
                <LandingPage onGetStarted={() => setCurrentView("dashboard")} user={currentUser} />
              )}
              {currentView === "dashboard" && (
                <DashboardView
                  summaries={summaries}
                  onSelectSummary={handleSelectSummaryCard}
                  onNewSummary={() => setCurrentView("generate")}
                  onToggleBookmark={handleToggleBookmark}
                />
              )}
              {currentView === "generate" && (
                <GenerateView onGenerate={handleGenerateSummary} loading={loading} />
              )}
              {currentView === "history" && (
                <HistoryView
                  summaries={summaries}
                  onSelectSummary={handleSelectSummaryCard}
                  onDeleteSummary={handleDeleteSummary}
                  onToggleBookmark={handleToggleBookmark}
                />
              )}
              {currentView === "profile" && (
                <ProfileView
                  user={currentUser}
                  role={currentRole}
                  stats={
                    userProfile
                      ? { totalSummaries: userProfile.totalSummaries, readingTimeSaved: userProfile.readingTimeSaved }
                      : { totalSummaries: summaries.filter((item)=>item.userId !== "mock-user-id").length, readingTimeSaved: summaries.filter((item)=>item.userId !== "mock-user-id").reduce((acc,curr)=>acc+curr.readingTime,0) }
                  }
                  onSignInSuccess={handleSignInSuccess}
                  onSignOutSuccess={handleSignOutSuccess}
                />
              )}
              {currentView === "admin" && (
                <AdminPanel totalSummariesCreatedGlobal={summaries.length} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
