export interface ParsedAuthError {
  code: string;
  title: string;
  message: string;
  actionHint?: string;
  consoleLink?: string;
  isConfigurationIssue?: boolean;
}

export function parseFirebaseAuthError(error: unknown, projectId: string = "smart-robotics-e788b"): ParsedAuthError {
  const defaultError: ParsedAuthError = {
    code: "unknown-error",
    title: "Authentication Failed",
    message: "An unexpected error occurred while communicating with Firebase Authentication. Please try again."
  };

  if (!error) return defaultError;

  const rawCode = (error as { code?: string })?.code || "";
  const rawMessage = (error as { message?: string })?.message || String(error);

  const consoleAuthUrl = `https://console.firebase.google.com/project/${projectId}/authentication/providers`;
  const consoleSettingsUrl = `https://console.firebase.google.com/project/${projectId}/authentication/settings`;

  switch (rawCode) {
    case "auth/email-already-in-use":
      return {
        code: rawCode,
        title: "Account Already Exists",
        message: "This email address is already registered in this Firebase project.",
        actionHint: "Switch to the Login tab to sign in with your password, or use 'Forgot password?' if you forgot your credentials."
      };

    case "auth/invalid-email":
      return {
        code: rawCode,
        title: "Invalid Email Address",
        message: "The email address entered is not a valid email format.",
        actionHint: "Please check for typos (e.g. user@example.com)."
      };

    case "auth/operation-not-allowed":
      return {
        code: rawCode,
        title: "Sign-in Provider Not Enabled in Firebase",
        message: "This authentication method (Email/Password or Google) is currently disabled in your Firebase Console for project '" + projectId + "'.",
        actionHint: "To fix this, go to Firebase Console > Authentication > Sign-in method tab and enable 'Email/Password' or 'Google'.",
        consoleLink: consoleAuthUrl,
        isConfigurationIssue: true
      };

    case "auth/weak-password":
      return {
        code: rawCode,
        title: "Password Too Weak",
        message: "Firebase requires passwords to be at least 6 characters.",
        actionHint: "Use at least 8 characters with a mix of letters, numbers, and symbols for better security."
      };

    case "auth/user-disabled":
      return {
        code: rawCode,
        title: "Account Disabled",
        message: "This user account has been disabled by an administrator.",
        actionHint: "Contact your Firebase project administrator for assistance."
      };

    case "auth/user-not-found":
      return {
        code: rawCode,
        title: "Account Not Found",
        message: "No user account was found with this email address.",
        actionHint: "Switch to the Register tab to create an account first."
      };

    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/invalid-login-credentials":
      return {
        code: rawCode,
        title: "Incorrect Credentials",
        message: "The email or password entered does not match any registered account.",
        actionHint: "Double-check your credentials or click 'Forgot Password?' to receive a reset link."
      };

    case "auth/too-many-requests":
      return {
        code: rawCode,
        title: "Too Many Attempts",
        message: "Access to this account has been temporarily disabled due to many failed login attempts.",
        actionHint: "Please wait a few minutes before trying again or reset your password."
      };

    case "auth/popup-closed-by-user":
      return {
        code: rawCode,
        title: "Sign-In Cancelled",
        message: "The Google sign-in popup window was closed before finishing authentication.",
        actionHint: "Click 'Continue with Google' again and complete the sign-in prompt."
      };

    case "auth/popup-blocked":
      return {
        code: rawCode,
        title: "Popup Blocked by Browser",
        message: "Your web browser blocked the Firebase Google authentication popup.",
        actionHint: "Allow popups for this site in your browser address bar and try again."
      };

    case "auth/unauthorized-domain":
      return {
        code: rawCode,
        title: "Unauthorized Domain in Firebase",
        message: "This web application domain is not authorized in Firebase OAuth settings.",
        actionHint: `Add '${window.location.hostname}' to Authorized Domains under Firebase Console > Authentication > Settings.`,
        consoleLink: consoleSettingsUrl,
        isConfigurationIssue: true
      };

    case "auth/network-request-failed":
      return {
        code: rawCode,
        title: "Network Connection Failed",
        message: "Unable to reach Firebase servers. Please verify your internet connection.",
        actionHint: "Check if an ad-blocker or firewall is blocking googleapis.com."
      };

    case "auth/requires-recent-login":
      return {
        code: rawCode,
        title: "Re-authentication Required",
        message: "This sensitive security action requires you to have signed in recently.",
        actionHint: "Please log out and sign back in before modifying your password."
      };

    default:
      return {
        code: rawCode || "auth-error",
        title: "Authentication Error",
        message: rawMessage || "An unknown Firebase error occurred.",
        actionHint: "Please check your network and Firebase configuration."
      };
  }
}
