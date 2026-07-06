import React, { useState } from "react";
import { X, LogIn, Chrome, AlertCircle, Sparkles } from "lucide-react";
import { auth, GoogleAuthProvider, signInWithPopup } from "../lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  isArabic: boolean;
  onSuccess: (uid: string, name: string, email: string) => void;
}

export default function AuthModal({ isOpen, onClose, isArabic, onSuccess }: AuthModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSandboxFallback, setShowSandboxFallback] = useState(false);
  const [sandboxName, setSandboxName] = useState("");
  const [sandboxEmail, setSandboxEmail] = useState("");

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!auth) {
        throw new Error("Firebase auth not initialized");
      }
      const provider = new GoogleAuthProvider();
      // Add custom parameter to force prompt (optional)
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onSuccess(user.uid, user.displayName || "Student User", user.email || "student@gmail.com");
      onClose();
    } catch (e: any) {
      console.warn("Google Sign-In Error:", e);
      // Popup blocks or iframe constraints are very common in Google AI Studio previews
      if (e.code === "auth/popup-blocked" || e.code === "auth/iframe-userAgent-blocked" || e.message?.includes("popup")) {
        setError(
          isArabic
            ? "تم حظر نافذة تسجيل الدخول المنبثقة بواسطة المتصفح (شائع جداً داخل الإطارات). تم تفعيل وضع الدخول البديل أدناه."
            : "Login popup was blocked by the browser (very common inside iframes). Enabled quick sandbox sign-in below."
        );
        setShowSandboxFallback(true);
      } else {
        setError(
          isArabic
            ? `فشل تسجيل الدخول: ${e.message || "خطأ غير معروف"}. يمكنك استخدام خيار الدخول السريع أدناه.`
            : `Login failed: ${e.message || "Unknown error"}. You can use the quick sandbox sign-in below.`
        );
        setShowSandboxFallback(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSandboxLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxName || !sandboxEmail) {
      setError(isArabic ? "يرجى ملء جميع الحقول" : "Please fill in all fields");
      return;
    }
    setError(null);
    // Create a deterministic UID from the email to allow persistency
    const cleanEmail = sandboxEmail.trim().toLowerCase();
    const sandboxUid = `sandbox_user_${btoa(cleanEmail).replace(/=/g, "")}`;
    onSuccess(sandboxUid, sandboxName.trim(), cleanEmail);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/65 backdrop-blur-sm animate-fade-in" id="auth-modal-overlay">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold font-display text-neutral-900 text-lg">
              {isArabic ? "تسجيل دخول الطلاب" : "Student Login"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
              <LogIn className="w-6 h-6" />
            </div>
            <h4 className="text-base font-semibold text-neutral-900 font-display">
              {isArabic ? "مرحباً بك في Pathway Languages" : "Welcome to Pathway Languages"}
            </h4>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              {isArabic
                ? "سجل دخولك لحفظ مستواك ومتابعة تقدمك في الدروس والمفردات ومزامنتها تلقائياً."
                : "Sign in to save your learning level, complete quizzes, collect vocabulary, and track progress."}
            </p>
          </div>

          {error && (
            <div className="flex gap-2.5 bg-amber-50 border border-amber-200 p-3.5 rounded-xl text-xs text-amber-800 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Primary Action: Google Login */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-lg shadow-neutral-200/50 hover:shadow-neutral-300 disabled:opacity-50"
              id="google-login-btn"
            >
              <Chrome className="w-5 h-5 text-white" />
              <span>
                {loading
                  ? (isArabic ? "جاري الاتصال..." : "Connecting...")
                  : (isArabic ? "الدخول بواسطة Google فقط" : "Sign in with Google Only")}
              </span>
            </button>
            
            <p className="text-[10px] text-center text-neutral-400">
              {isArabic 
                ? "تسجيل دخول آمن مشفّر بالكامل عبر خوادم Google" 
                : "Fully secured and encrypted login via Google"}
            </p>
          </div>

          {/* Sandbox Fallback Section */}
          {(showSandboxFallback || !auth) && (
            <div className="pt-4 border-t border-dashed border-neutral-200 space-y-4">
              <div className="text-center">
                <span className="inline-block text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {isArabic ? "وضع الدخول السريع (للإطارات)" : "Sandbox Quick Entry (For iFrames)"}
                </span>
                <p className="text-[11px] text-neutral-500 mt-1.5">
                  {isArabic
                    ? "إذا تعذر فتح نافذة Google المنبثقة، أدخل اسمك وبريدك الإلكتروني هنا وسنقوم بربط تقدمك تلقائياً."
                    : "If the Google popup cannot open in this environment, enter your name and email below."}
                </p>
              </div>

              <form onSubmit={handleSandboxLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isArabic ? "الاسم الكامل" : "Full Name"}
                  </label>
                  <input
                    type="text"
                    required
                    value={sandboxName}
                    onChange={(e) => setSandboxName(e.target.value)}
                    placeholder={isArabic ? "أحمد العتيبي" : "e.g. John Doe"}
                    className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isArabic ? "البريد الإلكتروني" : "Email Address"}
                  </label>
                  <input
                    type="email"
                    required
                    value={sandboxEmail}
                    onChange={(e) => setSandboxEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2 border border-neutral-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2.5 rounded-xl text-xs transition-all border border-indigo-200"
                >
                  {isArabic ? "تسجيل دخول سريع" : "Quick Sandbox Sign-In"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
