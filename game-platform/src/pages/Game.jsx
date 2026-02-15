import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { generateDailyPuzzle } from "../game/dailyPuzzle";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { updateStreak, getStreak } from "../game/streak";
import { markTodayPlayed } from "../game/activity";
import { generateHint, useHint, hintsRemaining } from "../game/hints";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "../components/Timer";
import { saveProgress } from "../storage/db";
import { getProgress } from "../storage/db";
import { calculateScore } from "../game/scoring";
import GameModeSelector from "../components/GameModeSelector";
import { saveActivity } from "../storage/activityDB";
import confetti from "canvas-confetti";
import SHA256 from "crypto-js/sha256";
import { markTodayCompleted } from "../game/dailyUnlock";
import DailyAccess from "../components/DailyAccess";
import { getTimeUntilMidnight } from "../game/unlockTimer";
import { isCompleted } from "../game/dailyUnlock";

export default function Game() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };
  const [correctStreak, setCorrectStreak] = useState(0);
  const [lastPoints, setLastPoints] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const [mode, setMode] = useState("daily");

  const userName = auth.currentUser?.displayName || "Guest";
  const [streak, setStreak] = useState(getStreak());

  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const today = new Date().toISOString().slice(0, 10);
  const todayDone = isCompleted(today);

  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [champion, setChampion] = useState(null);

  const difficulty = Math.floor(score / 5) + 1;
  const puzzle = useMemo(() => {
    // 🔥 make challenge mode harder
    const effectiveDifficulty =
      mode === "challenge" ? difficulty + 2 : difficulty;

    return generateDailyPuzzle(
      selectedDate,
      questionIndex,
      effectiveDifficulty
    );
  }, [questionIndex, difficulty, mode, selectedDate]);

  const [timeLeft, setTimeLeft] = useState(30);
  const [unlockTime, setUnlockTime] = useState(getTimeUntilMidnight());

  const [gameStarted, setGameStarted] = useState(false);

  const [gameOver, setGameOver] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintText, setHintText] = useState("");
  const [remainingHints, setRemainingHints] = useState(hintsRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setUnlockTime(getTimeUntilMidnight());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const saveScore = async () => {
    const date = new Date().toISOString().slice(0, 10);

    const hash = SHA256(date + "logic-looper-secret").toString();

    const timeTaken =
      mode === "blitz"
        ? 60 - timeLeft
        : mode === "challenge"
        ? 45 - timeLeft
        : 30 - timeLeft;

    await fetch("http://localhost:5000/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: userName,
        score,
        difficulty,
        timeTaken,
        date,
        hash,
      }),
    });
  };

  useEffect(() => {
    async function load() {
      const data = await getProgress();
      if (data?.score) setScore(data.score);
    }
    load();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/champion")
      .then((res) => res.json())
      .then((data) => setChampion(data));
  }, []);

  useEffect(() => {
    if (!gameStarted) return; // ✅ STEP 2.2 (START CONTROL)
    if (mode === "practice") return;

    if (timeLeft <= 0 && !gameOver) {
      setGameOver(true);
      setGameStarted(false);

      saveScore();
      window.dispatchEvent(new Event("scoreUpdated"));

      markTodayPlayed();
      const newStreak = updateStreak();
      setStreak(newStreak);

      saveActivity({
        date: new Date().toISOString().slice(0, 10),
        solved: true,
        score,
        timeTaken: mode === "blitz" ? 60 : mode === "challenge" ? 45 : 30,
        difficulty,
        synced: false,
      });
      markTodayCompleted();

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, mode, gameStarted]);

  const submit = () => {
    if (gameOver) return;

    const isCorrect =
      String(input).trim().toLowerCase() ===
      String(puzzle.answer).trim().toLowerCase();

    if (isCorrect) {
      const points = calculateScore({
        difficulty,
        timeLeft,
        hintsUsed,
        streak: correctStreak,
        correct: true,
      });

      const newScore = score + points;

      setScore(newScore);
      setLastPoints(points);
      setCorrectStreak((s) => s + 1);

      if (champion && newScore > champion.score) {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
        });
      }
    } else {
      setCorrectStreak(0);
    }

    setHintsUsed(0);
    setHintText("");
    setInput("");

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);
  };

  const restart = () => {
    setScore(0);
    setGameOver(false);
    setQuestionIndex(0);

    if (mode === "blitz") setTimeLeft(60);
    else if (mode === "challenge") setTimeLeft(45);
    else if (mode === "daily") setTimeLeft(30);
    else setTimeLeft(9999); // practice mode
  };

  const requestHint = () => {
    if (remainingHints <= 0) return;

    const nextLevel = hintLevel + 1;
    const hint = generateHint(puzzle, nextLevel);

    setHintLevel(nextLevel);
    setHintText(hint);

    useHint();
    setRemainingHints(hintsRemaining());
  };

  const startGame = () => {
    setGameStarted(true);

    if (mode === "blitz") setTimeLeft(60);
    else if (mode === "challenge") setTimeLeft(45);
    else if (mode === "daily") setTimeLeft(30);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setTimeLeft(0);
    setScore(0);
    setQuestionIndex(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center animated-gradient text-white px-4 py-10"
    >
      <button
        onClick={logout}
        className="absolute top-6 right-6 bg-red-500/80 hover:bg-red-600 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg transition"
      >
        Logout 🚪
      </button>

      <div className="text-center mb-6">
        <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-lg">
          🧠 Logic Looper
        </h1>
        <p className="text-gray-300 mt-2">Welcome, {userName} 👋</p>
      </div>

      <GameModeSelector mode={mode} setMode={setMode} />

      {champion && (
        <div className="mt-4 mb-6 bg-yellow-400/10 border border-yellow-400/40 text-yellow-200 px-6 py-3 rounded-xl text-center backdrop-blur-md shadow-md">
          <div className="font-semibold">🥇 Champion: {champion.username}</div>
          <div className="text-sm opacity-90">
            Score: {champion.score} pts — Beat the champion today!
          </div>
        </div>
      )}

      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6">
        {/* STATS BAR */}
        <div className="flex flex-wrap justify-between items-center gap-3 text-sm mb-4">
          <div className="bg-white/10 px-4 py-2 rounded-lg">
            🔥 {streak} Day Streak
          </div>

          {mode !== "practice" && (
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              {!gameStarted && !gameOver ? (
                <button
                  onClick={startGame}
                  className="bg-green-500 hover:bg-green-600 px-4 py-1 rounded-md font-semibold text-sm"
                >
                  ▶ Start
                </button>
              ) : (
                <Timer
                  timeLeft={timeLeft}
                  setTimeLeft={setTimeLeft}
                  gameOver={gameOver}
                />
              )}
            </div>
          )}

          <div className="bg-white/10 px-4 py-2 rounded-lg">🏆 {score}</div>

          <div className="bg-white/10 px-4 py-2 rounded-lg">
            📈 Lv {difficulty}
          </div>
        </div>

        {todayDone && (
          <div className="mt-4 mb-8 bg-indigo-500/10 border border-indigo-400 text-indigo-200 px-4 py-2 rounded-lg backdrop-blur-md">
            ⏳ Next puzzle unlocks in{" "}
            <span className="font-bold">
              {unlockTime.hours}h {unlockTime.minutes}m
            </span>
          </div>
        )}

        {/* Champion Progress */}
        {champion && (
          <div className="mb-4">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-2 bg-yellow-400 transition-all"
                style={{
                  width: `${Math.min((score / champion.score) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}

        {lastPoints > 0 && (
          <div className="text-center text-green-400 mb-3 animate-bounce">
            +{lastPoints} pts
          </div>
        )}

        {/* GAME AREA */}
        {!gameOver ? (
          <AnimatePresence mode="wait">
            <div className="relative flex justify-center">
              {/* ✨ Glow Aura */}
              {/* <div className="absolute w-80 h-80 bg-emerald-500 opacity-5 blur-3xl rounded-full animate-[pulse_6s_ease-in-out_infinite]" /> */}

              <motion.div
                key={questionIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="text-center bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-96 relative"
              >
                <p className="text-3xl font-bold mb-6">{puzzle.question}</p>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full p-3 rounded-lg text-black text-center text-lg mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
                  placeholder="Enter answer..."
                />

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={requestHint}
                  disabled={remainingHints <= 0}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 py-2 rounded-lg mb-3"
                >
                  💡 Hint ({remainingHints} left)
                </motion.button>

                {hintText && (
                  <div className="bg-white/10 p-3 rounded-lg text-sm mb-3 border border-white/20">
                    {hintText}
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={submit}
                  className="w-full bg-indigo-500 hover:bg-indigo-600 py-3 rounded-lg shadow-lg font-semibold"
                >
                  Submit Answer
                </motion.button>
              </motion.div>
            </div>
          </AnimatePresence>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-300 mb-3">
              ⛔ Time's Up!
            </h2>
            <p className="mb-4 text-lg">Final Score: {score}</p>

            <button
              onClick={restart}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg shadow-lg font-semibold"
            >
              Play Again 🔄
            </button>
          </div>
        )}
      </div>

      {/* NAVIGATION */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => navigate("/leaderboard")}
          className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          🏆 Leaderboard
        </button>

        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          👤 Profile
        </button>

        <button
          onClick={resetGame}
          className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-lg shadow-lg"
        >
          🔄 Reset
        </button>
      </div>
    </motion.div>
  );
}
