"use client";

import { useEffect, useState } from "react";
import type { GameMode, PlayerProgress, RoundState, Screen, Settings } from "@/types/game";
import { categories, categoryTotals, questions } from "@/lib/questions";
import { selectQuestions } from "@/lib/questionSelector";
import { applyRoundResults, type RoundOutcome } from "@/lib/rounds";
import { isDailyBonusAvailable, localDateString } from "@/lib/progression";
import { clearProgress, defaultProgress, loadProgress, saveProgress } from "@/lib/storage";
import { TROPHIES } from "@/data/trophies";
import { useSound } from "@/hooks/useSound";
import HomeScreen from "./HomeScreen";
import CategoryScreen from "./CategoryScreen";
import QuestionScreen from "./QuestionScreen";
import ResultsScreen from "./ResultsScreen";
import TrophyShelf from "./TrophyShelf";
import StatsScreen from "./StatsScreen";
import SettingsScreen from "./SettingsScreen";
import Modal from "./Modal";

interface RoundConfig {
  mode: GameMode;
  category?: string;
}

export default function Game() {
  // Progress loads after mount so the server render never touches
  // localStorage (avoids hydration mismatches).
  const [progress, setProgress] = useState<PlayerProgress | null>(null);
  const [screen, setScreen] = useState<Screen>("home");
  const [round, setRound] = useState<RoundState | null>(null);
  const [outcome, setOutcome] = useState<RoundOutcome | null>(null);
  const [lastConfig, setLastConfig] = useState<RoundConfig>({ mode: "mixed" });
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);

  useEffect(() => {
    // localStorage can only be read after mount; the server render (and the
    // hydration pass) must both see `null` or hydration would mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress());
  }, []);

  const sounds = useSound(progress?.settings.soundEnabled ?? false);

  if (!progress) {
    return (
      <p className="py-24 text-center text-xl font-bold text-slate-400" role="status">
        🧠 Loading Trivia Quest…
      </p>
    );
  }

  const update = (next: PlayerProgress) => {
    setProgress(next);
    saveProgress(next);
  };

  const startRound = (config: RoundConfig) => {
    const picked = selectQuestions(questions, {
      mode: config.mode,
      category: config.category,
      recentIds: progress.recentQuestionIds,
    });
    if (picked.length === 0) {
      setEmptyMessage(
        "We couldn't find enough questions for this category yet. Try another category."
      );
      return;
    }
    sounds.tap();
    setLastConfig(config);
    setRound({
      mode: config.mode,
      category: config.category,
      questions: picked,
      currentQuestionIndex: 0,
      score: 0,
      correctCount: 0,
      currentStreak: 0,
      bestStreak: 0,
      answers: [],
      startedAt: Date.now(),
    });
    setScreen("playing");
  };

  const completeRound = (finished: RoundState) => {
    const result = applyRoundResults(progress, finished);
    update(result.progress);
    setOutcome(result);
    setRound(null);
    if (result.perfectBonusStar) sounds.perfectRound();
    else sounds.roundComplete();
    setScreen("results");
  };

  const unlockTrophy = (trophyId: string): boolean => {
    const trophy = TROPHIES.find((t) => t.id === trophyId);
    if (!trophy || progress.unlockedTrophies.includes(trophyId) || progress.stars < trophy.cost) {
      return false;
    }
    update({
      ...progress,
      stars: progress.stars - trophy.cost,
      unlockedTrophies: [...progress.unlockedTrophies, trophyId],
    });
    sounds.trophy();
    return true;
  };

  const updateSettings = (partial: Partial<Settings>) => {
    sounds.tap();
    update({ ...progress, settings: { ...progress.settings, ...partial } });
  };

  const resetProgress = () => {
    clearProgress();
    setProgress(defaultProgress());
    setOutcome(null);
    setScreen("home");
  };

  const navigate = (target: Screen) => {
    sounds.tap();
    setScreen(target);
  };

  const dailyBonusAvailable = isDailyBonusAvailable(progress.lastDailyBonusDate, localDateString());

  return (
    <div className={progress.settings.reducedMotion ? "reduced-motion" : undefined}>
      {screen === "home" && (
        <HomeScreen
          progress={progress}
          dailyBonusAvailable={dailyBonusAvailable}
          onQuickPlay={() => startRound({ mode: "mixed" })}
          onNavigate={navigate}
        />
      )}
      {screen === "categories" && (
        <CategoryScreen
          categories={categories}
          categoryTotals={categoryTotals}
          progress={progress}
          onPick={(category) => startRound({ mode: "category", category })}
          onBack={() => navigate("home")}
        />
      )}
      {screen === "playing" && round && (
        <QuestionScreen
          key={round.startedAt}
          initialRound={round}
          timerEnabled={progress.settings.timerEnabled}
          sounds={sounds}
          onComplete={completeRound}
          onQuit={() => {
            setRound(null);
            navigate("home");
          }}
        />
      )}
      {screen === "results" && outcome && (
        <ResultsScreen
          outcome={outcome}
          onPlayAgain={() => startRound(lastConfig)}
          onChooseCategory={() => navigate("categories")}
          onTrophies={() => navigate("trophies")}
          onHome={() => navigate("home")}
        />
      )}
      {screen === "trophies" && (
        <TrophyShelf progress={progress} onUnlock={unlockTrophy} onBack={() => navigate("home")} />
      )}
      {screen === "stats" && <StatsScreen progress={progress} onBack={() => navigate("home")} />}
      {screen === "settings" && (
        <SettingsScreen
          settings={progress.settings}
          onChange={updateSettings}
          onReset={resetProgress}
          onBack={() => navigate("home")}
        />
      )}

      <Modal open={emptyMessage !== null} title="Not enough questions" onClose={() => setEmptyMessage(null)}>
        <p className="mb-4 text-sm font-medium text-slate-600">{emptyMessage}</p>
        <button
          type="button"
          autoFocus
          onClick={() => setEmptyMessage(null)}
          className="w-full rounded-xl bg-sky-500 px-4 py-2.5 font-bold text-white transition hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-300"
        >
          OK
        </button>
      </Modal>
    </div>
  );
}
