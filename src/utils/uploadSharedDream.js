// utils/uploadSharedDream.js
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export const uploadSharedDream = async ({ ruya, yorum, gorsel }) => {
  const uid = auth.currentUser?.uid || null;

  try {
    await addDoc(collection(db, "paylasilanRuyalar"), {
      uid,
      ruya,
      yorum,
      gorsel,
      begeniler: 0,
      yorumlar: [],
      tarih: serverTimestamp(),
    });
    return { success: true };
  } catch (err) {
    console.error("Paylaşım hatası:", err);
    return { success: false, error: err.message };
  }
};
