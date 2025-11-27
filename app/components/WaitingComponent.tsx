"use client"

import { useState, useEffect, useRef } from "react";

type Scenario = {
  title: string;
  description: string;
};

export default function WaitingPage({ teamId }: { teamId: string }) {
  const [timeLeft, setTimeLeft] = useState<number>(120); // initial fallback
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [error, setError] = useState<string>("");
  const [isRevealed, setIsRevealed] = useState(false); // clearer name than canReveal

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Step 1: Check initial registration time status
  useEffect(() => {
    const checkRegistrationTime = async () => {
      try {
        const res = await fetch(`/api/teams/${teamId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to check time");

        if (data.canReveal) {
          setIsRevealed(true);
          setTimeLeft(0);
        } else {
          setTimeLeft(data.remainingSeconds ?? 120);
        }
      } catch (err) {
        console.error("Time check failed:", err);
        setTimeLeft(120); // fallback
      }
    };

    checkRegistrationTime();
  }, [teamId]);

  // Step 2: Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || isRevealed) {
      setIsRevealed(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRevealed(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isRevealed]);

  // Step 3: Poll for scenario when time is up
  useEffect(() => {
    if (!isRevealed || scenario) return;

    const fetchScenario = async () => {
      try {
        const res = await fetch(`/api/teams/${teamId}/scenario`);
        const data = await res.json();

        if (res.ok && data.scenario) {
          setScenario(data.scenario);
          if (pollIntervalRef.current) {
            clearTimeout(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
        } else {
          // Not ready yet → poll again in 5 seconds
          pollIntervalRef.current = setTimeout(fetchScenario, 5000);
        }
      } catch (err) {
        console.error("Scenario fetch error:", err);
        setError("Connection lost. Retrying...");
        pollIntervalRef.current = setTimeout(fetchScenario, 5000);
      }
    };

    fetchScenario();

    // Cleanup polling on unmount
    return () => {
      if (pollIntervalRef.current) {
        clearTimeout(pollIntervalRef.current);
      }
    };
  }, [isRevealed, scenario, teamId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Error State
  if (error && !scenario) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl p-8 max-w-md text-center border border-gray-800">
          <div className="text-6xl mb-4">Warning</div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Connection Issue
          </h1>
          <p className="text-gray-400">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            Retrying automatically...
          </p>
        </div>
      </div>
    );
  }

  // Scenario Revealed
  if (scenario) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-lg shadow-xl p-8 max-w-2xl border border-gray-800">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">Target</div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Your Scenario
            </h1>
            <p className="text-gray-400">Good luck with your challenge!</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border-2 border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              {scenario.title}
            </h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {scenario.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Waiting State
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl p-8 max-w-md text-center border border-gray-800">
        <div className="mb-6">
          <div className="text-6xl mb-4 animate-bounce">Hourglass</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Registration Successful!
          </h1>
          <p className="text-gray-400">
            Your scenario will be revealed shortly...
          </p>
        </div>

        <div className="my-8">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="transform -rotate-90 w-32 h-32">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#1f2937"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#ffffff"
                strokeWidth="8"
                fill="none"
                strokeDasharray={351.86}
                strokeDashoffset={351.86 * (timeLeft / 120)}
                className="transition-all duration-1000 stroke-linecap-round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-150"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse delay-300"></div>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Please do not close or refresh this page
        </p>
      </div>
    </div>
  );
}
