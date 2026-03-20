/**
 * Types and Logic for Word Recycling (Leitner System & Tiered Progression)
 */

import { db } from './firebaseConfig';
import { doc, getDoc, setDoc } from "firebase/firestore";

export const STORAGE_KEY = 'vocab_app_history';

// Leitner Box Intervals in Milliseconds
const ONE_DAY = 24 * 60 * 60 * 1000;
export const BOX_INTERVALS = {
    1: 0,
    2: 1 * ONE_DAY,
    3: 3 * ONE_DAY,
    4: 7 * ONE_DAY,
    5: 30 * ONE_DAY
};

export const TIERS = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const getInitialHistory = () => ({
    totalGamesPlayed: 0,
    isPremium: false, // Default to free
    wordStats: {} // { [wordId]: { box: 1, nextReview: timestamp, lastSeen: timestamp } }
});

export const fetchHistory = async (userId) => {
    if (!userId) return getInitialHistory();
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...getInitialHistory(),
                ...data.history,
                isPremium: data.isPremium || false // Top-level or nested? Prompt implies user entry update. Stick to history object for uniformity in app, but sync helps.
            };
        }
        return getInitialHistory();
    } catch (e) {
        console.error("Failed to load history from Firestore", e);
        return getInitialHistory();
    }
};

export const saveHistory = async (userId, history) => {
    if (!userId) return;
    try {
        const docRef = doc(db, "users", userId);
        // Prompt: "Update user's database entry to have isPremium: boolean field"
        // We save 'history' object nested, but also 'isPremium' possibly top level? 
        // Let's save both for safety.
        await setDoc(docRef, {
            history,
            isPremium: history.isPremium
        }, { merge: true });
    } catch (e) {
        console.error("Failed to save history to Firestore", e);
    }
};

/**
 * Check if a Tier is unlocked based on mastery of previous Object
 */
export const isTierUnlocked = (tier, allWords, history) => {
    if (tier === 'A1') return true;
    const tierIndex = TIERS.indexOf(tier);
    if (tierIndex <= 0) return true; // Should not happen if A1 handled

    const prevTier = TIERS[tierIndex - 1];

    // Check Premium Lock
    if (!history.isPremium && (tier === 'B1' || tier === 'B2' || tier === 'C1')) {
        return false;
    }

    // Check Previous Tier Mastery (90% in Box 5)
    // Filter words in defaultWordBank that belong to prevTier
    const prevTierWords = allWords.filter(w => w.tier === prevTier);
    if (prevTierWords.length === 0) return true; // Safety

    let masteredCount = 0;
    prevTierWords.forEach(w => {
        const stat = history.wordStats[w.id];
        // Mastery = Box 5
        if (stat && stat.box === 5) {
            masteredCount++;
        }
    });

    const masteryPercentage = masteredCount / prevTierWords.length;
    return masteryPercentage >= 0.9;
};

/**
 * Selects words for the game based on Leitner System and Tier Locking.
 */
export const selectWordsForGame = (allWords, history) => {
    const { wordStats } = history;
    const now = Date.now();

    // 1. Identify Unlocked Tiers
    const unlockedTiers = TIERS.filter(t => isTierUnlocked(t, allWords, history));

    // 2. Filter Candidate Words (Unlocked Tiers ONLY)
    let candidates = allWords.filter(w => unlockedTiers.includes(w.tier));

    // 3. Leitner Priority
    // Priority A: Due for review (nextReview <= now)
    // Priority B: New words (no stats)
    // Priority C: Not due (future review) - avoiding these if possible

    const dueWords = [];
    const newWords = [];
    const futureWords = [];

    candidates.forEach(w => {
        const stat = wordStats[w.id];
        if (!stat) {
            newWords.push(w);
        } else {
            if (stat.nextReview <= now) {
                dueWords.push(w);
            } else {
                futureWords.push(w);
            }
        }
    });

    // Strategy: Priorities Due -> New -> Future (if needed to fill 10)
    // Sort Due words? Maybe by Box ascending (focus on weaker words)? Or random.
    // Let's randomize within categories.
    const shuffle = arr => arr.sort(() => 0.5 - Math.random());

    let selection = [...shuffle(dueWords)];

    if (selection.length < 10) {
        selection = [...selection, ...shuffle(newWords)];
    }

    if (selection.length < 10) {
        // Need to pull from future words?
        // Sort future words by 'nearest due date'
        const sortedFuture = futureWords.sort((a, b) => {
            return (wordStats[a.id].nextReview) - (wordStats[b.id].nextReview);
        });
        selection = [...selection, ...sortedFuture];
    }

    // Cap at 10
    return selection.slice(0, 10);
};

/**
 * Updates history after a game using Leitner System
 */
export const updateHistory = (history, sessionResults, allWordsPlayed) => {
    // sessionResults: { [wordId]: 'matched' | 'missed' }
    const { totalGamesPlayed, wordStats, isPremium } = history;
    const newStats = { ...wordStats };

    const now = Date.now();

    allWordsPlayed.forEach(word => {
        const result = sessionResults[word.id]; // 'matched' | 'missed'

        const currentStat = newStats[word.id] || {
            box: 1,
            nextReview: 0,
            lastSeen: 0,
            consecutiveMisses: 0
        };

        const updatedStat = { ...currentStat };
        updatedStat.lastSeen = now;

        if (result === 'matched') {
            // Leitner Promotion
            // If correct, move to next box (cap at 5)
            // If it was Box 1 -> Box 2.
            const currentBox = updatedStat.box || 1;
            const newBox = Math.min(5, currentBox + 1);
            updatedStat.box = newBox;

            // Set next review date
            updatedStat.nextReview = now + BOX_INTERVALS[newBox];
            updatedStat.consecutiveMisses = 0;

        } else {
            // Leitner Demotion
            // If wrong, reset to Box 1
            updatedStat.box = 1;
            updatedStat.nextReview = now + BOX_INTERVALS[1]; // Immediate/Next day
            updatedStat.consecutiveMisses = (updatedStat.consecutiveMisses || 0) + 1;
        }

        newStats[word.id] = updatedStat;
    });

    return {
        ...history,
        totalGamesPlayed: totalGamesPlayed + 1,
        wordStats: newStats
    };
};
