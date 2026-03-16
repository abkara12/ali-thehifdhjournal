// /app/api/sendWeeklyReports/route.ts
import admin from "firebase-admin";

// ----------------- Initialize Admin SDK -----------------
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  throw new Error("Firebase environment variables are not set.");
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();

// ----------------- API Route -----------------
export async function GET() {
  try {
    const usersSnapshot = await db.collection("users").get();
    const reports: any[] = [];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();

      const logsSnapshot = await db
        .collection("users")
        .doc(userDoc.id)
        .collection("logs")
        .get();

      // Filter logs for last 7 days (works with Timestamp or string)
      const recentLogs = logsSnapshot.docs.filter((logDoc) => {
        const logData = logDoc.data();
        let logDate: Date;

        if (logData.date?.toDate) {
          // Firestore Timestamp
          logDate = logData.date.toDate();
        } else {
          // Assume string
          logDate = new Date(logData.date);
        }

        return logDate >= sevenDaysAgo;
      });

      if (recentLogs.length > 0) {
        const reportText = `Assalaamu Alaikum\n\nWeekly Hifdh Report\nStudent: ${userData.name}\n\n📅 ${new Date().toLocaleDateString()}\n`;
        reports.push({
          student: userData.name,
          parentPhone: userData.parentPhone,
          report: reportText,
        });
      }
    }

    return new Response(JSON.stringify({ reports }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}