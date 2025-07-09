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
      const storageRef = ref(storage, `announcements/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const fileURL = await getDownloadURL(storageRef);

      const fileType = file.type.includes("image") ? "image" : "pdf";

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

        <div className={styles.formGroup}>
          <label className={styles.label}>Announcement Title</label>
          <input
            className={styles.input}
            placeholder="Enter the title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Description</label>
          <textarea
            className={styles.textarea}
            placeholder="Write the description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Club or Teacher Name</label>
          <input
            className={styles.input}
            placeholder="Author Name"
            value={authorName}
            onChange={e => setAuthorName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Type</label>
          <select
            className={styles.select}
            value={type}
            onChange={e => setType(e.target.value)}
          >
            <option value="club">Club</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Upload File</label>
          <input
            className={styles.fileInput}
            type="file"
            onChange={e => setFile(e.target.files[0])}
          />
        </div>

        <button className={styles.mainBtn} onClick={handleUpload}>
          Add Announcement
        </button>
      </div>
    </div>
  );
}
