'use client';

import { useState } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./page.module.css";

export default function UploadPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [type, setType] = useState("club");
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    try {
      // Upload to Firebase Storage
      const storageRef = ref(storage, `announcements/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      const fileType = file.type.includes("image") ? "image" : "pdf";

      // Save metadata to Firestore
      await addDoc(collection(db, "announcements"), {
        title,
        description,
        type,
        authorName,
        fileURL,
        fileType,
        timestamp: Date.now()
      });

      alert("Announcement uploaded successfully!");
      setTitle("");
      setDescription("");
      setAuthorName("");
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
      <h1 className={styles.heading}>Upload Announcement</h1>
      <div >
        <input className={styles.announcementInput} placeholder="Announcement Title" value={title} onChange={e => setTitle(e.target.value)} /><br />
      </div>
      <div>
        <textarea className={styles.announcementText} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} /><br />
      </div>
      <div>
        <input className={styles.announcementInput} placeholder="Club or Teacher Name" value={authorName} onChange={e => setAuthorName(e.target.value)} /><br />
      </div>
      <div>
        <select className={styles.announcementInput} value={type} onChange={e => setType(e.target.value)}>
            <option value="club">Club</option>
            <option value="teacher">Teacher</option>
        </select><br />
      </div>
      <div>
        <input className={styles.announcementInput} type="file" onChange={e => setFile(e.target.files[0])} /><br />
      </div>
      <div>
        <button className={styles.mainBtn} onClick={handleUpload}>Add Announcement</button>
      </div>
    </div>
    </div>
  );
}



