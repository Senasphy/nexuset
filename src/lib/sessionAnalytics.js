import { addDoc, collection, getDocs, limit as queryLimit, orderBy, query, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export async function saveUserSession(uid, sessionData) {
  if (!db || !uid) return null
  const rawTotalQuestions = Number(sessionData.totalQuestions) || 0
  const totalQuestions = Math.max(0, rawTotalQuestions)
  const rawCorrectAnswers = Number(sessionData.correctAnswers) || 0
  const correctAnswers = clamp(rawCorrectAnswers, 0, totalQuestions)
  const wrongAnswers = Math.max(0, totalQuestions - correctAnswers)
  const accuracy = totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const timeSpentSeconds = Math.max(0, Math.round(Number(sessionData.timeSpentSeconds) || 0))
  const timeSpentMinutes = Number((timeSpentSeconds / 60).toFixed(2))

  // Ignore accidental micro-sessions.
  if (timeSpentSeconds < 30) return null

  const sessionsRef = collection(db, "users", uid, "sessions")
  const payload = {
    category: sessionData.category || "unknown",
    difficulty: sessionData.difficulty || "easy",
    plannedQuestions: Number(sessionData.plannedQuestions) || 0,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    accuracy: clamp(accuracy, 0, 100),
    timeSpentSeconds,
    timeSpentMinutes,
    startedAt: sessionData.startedAt || new Date().toISOString(),
    endedAt: sessionData.endedAt || new Date().toISOString(),
    createdAt: serverTimestamp(),
  }

  const docRef = await addDoc(sessionsRef, payload)
  return docRef.id
}

export async function fetchUserSessions(uid, maxRecords = 250) {
  if (!db || !uid) return []
  const sessionsRef = collection(db, "users", uid, "sessions")
  const sessionsQuery = query(sessionsRef, orderBy("createdAt", "desc"), queryLimit(maxRecords))
  const snapshot = await getDocs(sessionsQuery)

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      ...data,
      createdAtMs: data.createdAt?.toMillis?.() ?? null,
    }
  })
}
