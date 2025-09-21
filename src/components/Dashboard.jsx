import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // your Firebase config path
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import "./../styles/Dashboard.css";
import LoadingSpinner from "./LoadingSpinner";

function Dashboard() {
    const [userName, setUserName] = useState("");
    const [ecoPoints, setEcoPoints] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const docRef = doc(db, "eco-points", user.uid);
                const docSnap = await getDoc(docRef);
                const data = docSnap.data();
                setUserName(data.name || user.displayName || user.email || "User");
                setEcoPoints(data.eco_points ?? 0);

                setLoading(false);
            } else {
                // Not logged in, optionally redirect to login page
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="dashboard-container">
            <h1>Welcome, {userName}</h1>
            <h2>Your Eco Points: {ecoPoints}</h2>
        </div>
    );
}

export default Dashboard;
