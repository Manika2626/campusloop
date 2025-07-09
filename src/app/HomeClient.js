'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../app/lib/firebase";
import { useRouter } from "next/navigation";
import Chatbot from "../components/Chatbot";

export default function HomeClient() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const email = user.email || "";
      const allowedDomain = "@bitmesra.ac.in";

      if (email.endsWith(allowedDomain)) {
        router.push('/dashboard');
      } else {
        alert("Only @bitmesra.ac.in accounts are allowed.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <main>
      <div className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Welcome to<br/> Campus Loop</h1>
          <div className={styles.loginBox}>
            <p className={styles.desc1}>Sign in with your college email <br/>to get started</p>
            <button className={styles.mainBtn} onClick={handleGoogleLogin}>
              <Image src="/lock_5953216.png" alt="google" width={20} height={20} />
              Login with College email
            </button>
            <p className={styles.desc2}>Only your official college email is supported</p>
          </div>
        </div>
      </div>
      <Chatbot />
    </main>
  );
}
