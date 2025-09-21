import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getApp } from "firebase/app";

export async function updateUserEcoPoints(userEmail, pointsToAdd) {
  if (!userEmail) {
    console.error("User email is required");
    return;
  }

  const app = getApp();
  const db = getFirestore(app);

  try {
    // Query document where email field equals userEmail
    const q = query(collection(db, "eco-points"), where("email", "==", userEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error(`No document found for email ${userEmail}`);
      return;
    }

    // Assuming only one document per email
    const docSnap = querySnapshot.docs[0];
    const userRef = doc(db, "eco-points", docSnap.id);

    const currentPoints = docSnap.data().eco_points || 0;
    await updateDoc(userRef, {
      eco_points: currentPoints + pointsToAdd,
    });

    console.log(`Updated eco_points for user ${userEmail} to ${currentPoints + pointsToAdd}`);
  } catch (error) {
    console.error("Error updating eco points:", error);
  }
}
