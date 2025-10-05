"use client";

import { SignInButton } from "@clerk/nextjs";
import { Button } from "@mui/material";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to Your Financial Assistant
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 mb-8">
          Track your expenses, set goals, and achieve financial freedom with AI-powered insights.
        </p>
        <div className="flex gap-4 justify-center">
          <SignInButton mode="modal">
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#4F46E5",
                "&:hover": {
                  backgroundColor: "#4338CA",
                },
                textTransform: "none",
                fontSize: "1.125rem",
                padding: "12px 32px",
              }}
            >
              Get Started
            </Button>
          </SignInButton>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Smart Categorization
            </h3>
            <p className="text-gray-600">
              Automatically categorize your expenses with AI-powered intelligence.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Goal Tracking
            </h3>
            <p className="text-gray-600">
              Set and monitor your financial goals with real-time progress updates.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Insightful Analytics
            </h3>
            <p className="text-gray-600">
              Get personalized insights and recommendations for better financial health.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
