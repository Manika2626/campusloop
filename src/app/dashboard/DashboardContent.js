
'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import { auth, db } from "@/app/lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";
import Chatbot from "@/components/Chatbot";

export default function DashboardContent() {
  const [announcements, setAnnouncements] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [selectedType, setSelectedType] = useState("club");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchAnnouncements = async () => {
    try {
      const q = query(collection(db, "announcements"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setAnnouncements(data);

      const clubData = data.filter(a => a.type === "club");
      setCurrentData(clubData);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/');
      } else {
        setUser(user);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) return <p>Loading...</p>;

  const club = announcements.filter(a => a.type === "club");
  const teacher = announcements.filter(a => a.type === "teacher");

  const handleFilter = (type) => {
    setSelectedType(type);
    setCurrentData(type === "teacher" ? teacher : club);
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.logo}>🌐 Campus Loop</div>
        <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div className={styles.DashboardPage}>
        <div className={styles.container}>
          <h2 className={styles.headingSmall}>Welcome, {user.displayName}</h2>
          <p className={styles.email}>Logged in as: {user.email}</p>

          <div className={styles.holder}>
            <button
              onClick={() => handleFilter("teacher")}
              className={`${styles.btn} ${selectedType === "teacher" ? styles.active : ""}`}
            >
              Teacher
            </button>
            <button
              onClick={() => handleFilter("club")}
              className={`${styles.btn} ${selectedType === "club" ? styles.active : ""}`}
            >
              Club
            </button>
          </div>

          <div className={styles.postArea}>
            {currentData.map((a, i) => (
              <div key={i} className={styles.post}>
                <p><strong>{a.authorName}</strong></p>
                <p className={styles.desc}>{a.description}</p>
                <h3>{a.title}</h3>
                {a.fileType === "image" ? (
                  <img src={a.fileURL} alt="announcement" width="300" className={styles.image} />
                ) : (
                  <a href={a.fileURL} target="_blank" rel="noopener noreferrer">📄 View PDF</a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        Developed by: Manika Singh
      </footer>

      <Chatbot />
    </>
  );
}
