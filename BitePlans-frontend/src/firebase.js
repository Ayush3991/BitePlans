import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA8B-wfCE211VtdTLhn77bkJbuNYV3SA94",
  authDomain: "dev-7e74a.firebaseapp.com",
  projectId: "dev-7e74a",
  appId: "1:636096552670:web:046399c48065101fe66c4f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ Google provider
const googleProvider = new GoogleAuthProvider();

// ✅ Microsoft provider (Azure AD / Outlook)
const microsoftProvider = new OAuthProvider('microsoft.com');

export { auth, googleProvider, microsoftProvider };
