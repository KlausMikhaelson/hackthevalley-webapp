"use client";

import { SignInButton } from "@clerk/nextjs";
import {
  TrendingUp as TrendingUpIcon,
  Savings as SavingsIcon,
  Analytics as AnalyticsIcon,
  AttachMoney as AttachMoneyIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
  Psychology as PsychologyIcon,
  LocalFireDepartment as FireIcon,
  SmartToy as SmartToyIcon
} from '@mui/icons-material';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/10 via-[var(--background)] to-[var(--accent-secondary)]/10 animate-pulse" />
      
      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--accent-primary)]/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-[var(--accent-secondary)]/20 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[var(--accent-primary)]/15 rounded-full blur-lg animate-pulse delay-500" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 text-center">
          {/* Hero Section */}
          <div className="mb-16">
            {/* Brand Logo */}
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-4 tracking-tight">
                <span className="text-[var(--foreground)]"> Retail Trauma</span>
              </h1>
              <div className="w-16 h-1 bg-gradient-primary rounded-full mx-auto mb-6"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-6 leading-tight">
              Heal Your Spending Wounds
            </h2>
            
            <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-12 max-w-3xl mx-auto leading-relaxed">
              Break free from impulsive spending patterns with AI-powered insights that help you 
              recognize, understand, and overcome your retail triggers for lasting financial wellness.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignInButton mode="modal">
                <button className="btn-gradient text-white font-semibold text-lg rounded-xl px-8 py-4 shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
                  <TrendingUpIcon sx={{ fontSize: 20 }} />
                  Begin Your Recovery
                </button>
              </SignInButton>
            </div>
          </div>

          {/* Meet Brokie Section */}
          <div className="relative">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)]/10 via-[var(--accent-secondary)]/10 to-[var(--accent-primary)]/10 rounded-3xl blur-2xl" />
            
            <div className="relative bg-[var(--card-bg)] rounded-3xl card-shadow-lg border border-[var(--border-color)] p-8 md:p-12 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent-primary)]/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[var(--accent-secondary)]/5 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
                    Say Hello to Brokie
                  </h2>
                  <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                    Your brutally honest AI companion who's not afraid to call out your questionable spending choices
                  </p>
                </div>

                {/* Main Brokie Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Mascot Display */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                    <div className="relative bg-[var(--background)] rounded-3xl p-8 border border-[var(--border-color)] text-center">
                      {/* Brokie Mascot Image */}
                      <div className="w-64 h-64 mx-auto mb-6 relative">
                        <img 
                          src="/mascot.png" 
                          alt="Brokie - Your Financial Guardian" 
                          className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      
                      {/* Speech Bubble */}
                      <div className="relative bg-[var(--card-bg)] rounded-2xl p-4 border border-[var(--border-color)] shadow-lg">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-[var(--card-bg)] border-l border-t border-[var(--border-color)] rotate-45"></div>
                        <p className="text-[var(--foreground)] font-medium italic">
                          "Are you serious? You've barely scratched the surface of your $10,000 tuition goal, and you want to blow nearly three times that amount on a cosplay costume and some glowy wall lights?"
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Brokie's Features */}
                  <div className="space-y-8">
                    <div className="group">
                      <div className="flex items-start gap-4 p-6 bg-[var(--background)] rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <FireIcon className="text-white" sx={{ fontSize: 24 }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Savage Roasts</h3>
                          <p className="text-[var(--text-secondary)]">
                            Brokie delivers hilariously harsh (but true) commentary on your unnecessary purchases. No sugarcoating, just brutal honesty.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-start gap-4 p-6 bg-[var(--background)] rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <PsychologyIcon className="text-white" sx={{ fontSize: 24 }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Smart Analysis</h3>
                          <p className="text-[var(--text-secondary)]">
                            Behind the sass is sophisticated AI that delivers judgement based on your personal goals and identifies your weakest financial moments.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <div className="flex items-start gap-4 p-6 bg-[var(--background)] rounded-2xl border border-[var(--border-color)] hover:border-[var(--accent-primary)]/30 transition-all duration-300 hover:transform hover:scale-105">
                        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <SavingsIcon className="text-white" sx={{ fontSize: 24 }} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">Tough Love</h3>
                          <p className="text-[var(--text-secondary)]">
                            Sometimes you need a friend who'll tell you the truth. Brokie helps you stay accountable to your financial goals.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
