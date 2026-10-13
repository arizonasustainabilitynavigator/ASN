import React, { useState, useEffect, useMemo, useRef } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import QuizProgress from "@/components/quiz/QuizProgress";
import QuizResults from "@/components/quiz/QuizResults";
import CountyDropdown from "@/components/quiz/CountyDropdown";
import { useAuth, PENDING_QUIZ_KEY } from "@/lib/AuthContext";
import { api } from "@/api/client";
import {
  ORG_COUNTY_OPTIONS,
  ORG_TYPE_OPTIONS,
  ORG_CATEGORY_OPTIONS,
  EMPLOYEE_COUNT_OPTIONS,
  ORG_LOCATION_OPTIONS,
  ORG_FACILITY_TYPE_OPTIONS,
  ORG_OPERATIONS_OPTIONS,
  ORG_RESOURCES_USED_OPTIONS,
  ORG_RESOURCES_TO_REDUCE_OPTIONS,
  ORG_SUSTAINABILITY_TOPICS_OPTIONS,
  ORG_COMPLETED_PRACTICES_OPTIONS,
  ORG_COMPLETED_ASSESSMENTS_OPTIONS,
  ORG_EXPEREIENCE_LEVEL_OPTIONS,
  ORG_OBSTACLES_OPTIONS,
  ORG_SUPPORT_NEEDED_OPTIONS,
  ORG_INSENTIVES_DESIRED_OPTIONS,
  ORG_PLAN_FORMAT_OPTIONS,
  STEP_RECOMMENDATIONS,
} from "@/lib/quizRecommendations";

const TOTAL_STEPS = 10;
const MAX_MULTI_SELECT = 3;

// Default/empty answer state
const INITIAL_ANSWERS = {
  orgZipCode: "",
  orgCounty: "",
  orgType: "",
  orgTypeOther: "",
  orgCategory: "",
  employeeCount: "",
  orgLocation: "",
  orgFacilityType: "",
  orgOperations: [],
  orgResourcesUsed: [],
  orgResourcesToReduce: [],
  orgSustainabilityTopics: [],
  orgCompletedPractices: [],
  orgCompletedAssessments: [],
  orgExperienceLevel: [],
  orgObstacles: [],
  orgSupportNeeded: [],
  orgInsentivesDesired: [],
  orgPlanFormat: [],
};

// Multi-step sustainability quiz page
export default function SustainabilityQuiz() {
  // State
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);
  const { isAuthenticated, user } = useAuth();
  const savedRef = useRef(false);

  const update = (field, value) => setAnswers((prev) => ({ ...prev, [field]: value }));

  // Save the completed quiz when the results screen is reached
  useEffect(() => {
    if (step !== TOTAL_STEPS || savedRef.current) return;
    savedRef.current = true;
    if (isAuthenticated && user) {
      api.entities.QuizResponse.create({ userId: user.id, answers }).catch((e) => console.error(e));
    } else {
      localStorage.setItem(PENDING_QUIZ_KEY, JSON.stringify(answers));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // Toggles a value in/out of a multi-select field, capped at `max`
  const toggleMultiSelect = (field, value, max = MAX_MULTI_SELECT) => {
    setAnswers((prev) => {
      const current = prev[field];
      let next;
      if (current.includes(value)) {
        next = current.filter((v) => v !== value);
      } else if (current.length >= max) {
        return prev;
      } else {
        next = [...current, value];
      }
      return { ...prev, [field]: next };
    });
  };

  // Per-step validation
  const canContinue = () => {
    if (step === 0) return !!answers.orgCounty;

    if (step === 1) {
      return (
        !!answers.orgType &&
        (answers.orgType !== "Something else" || answers.orgTypeOther.trim()) &&
        !!answers.orgCategory
      );
    }

    if (step === 2) return !!answers.employeeCount;

    if (step === 3) return !!answers.orgLocation && !!answers.orgFacilityType;

    if (step === 4) return answers.orgOperations.length > 0;

    if (step === 5) {
      return answers.orgResourcesUsed.length > 0 && answers.orgResourcesToReduce.length > 0;
    }

    if (step === 6) return answers.orgSustainabilityTopics.length > 0;

    if (step === 7) {
      return (
        answers.orgCompletedPractices.length > 0 &&
        answers.orgCompletedAssessments.length > 0 &&
        answers.orgExperienceLevel.length > 0
      );
    }

    if (step === 8) return answers.orgObstacles.length > 0;

    if (step === 9) {
      return (
        answers.orgSupportNeeded.length > 0 &&
        answers.orgInsentivesDesired.length > 0 &&
        answers.orgPlanFormat.length > 0
      );
    }

    return true;
  };

  // Step navigation handlers
  const handleContinue = () => {
    if (!canContinue()) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleRestart = () => {
    setAnswers(INITIAL_ANSWERS);
    setStep(0);
    savedRef.current = false;
  };

  // Reusable question renderers
  const renderSingleSelect = (options, field, getValue = (o) => o.value, getLabel = (o) => o.label) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const value = getValue(option);
        return (
          <button
            key={value}
            type="button"
            onClick={() => update(field, value)}
            className={`px-5 py-3 text-sm tracking-[0.02em] transition-colors ${
              answers[field] === value
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground/70 hover:border-primary hover:text-primary"
            }`}
          >
            {getLabel(option)}
          </button>
        );
      })}
    </div>
  );

  const renderMultiSelect = (options, field, max = MAX_MULTI_SELECT) => (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = answers[field].includes(option.value);
        const atCap = !selected && answers[field].length >= max;
        return (
          <button
            key={option.value}
            type="button"
            disabled={atCap}
            onClick={() => toggleMultiSelect(field, option.value, max)}
            className={`px-5 py-3 text-sm tracking-[0.02em] transition-colors ${
              selected
                ? "bg-primary text-primary-foreground"
                : atCap
                ? "border border-border text-foreground/30 cursor-not-allowed"
                : "border border-border text-foreground/70 hover:border-primary hover:text-primary"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );

  // Render: question steps + results
  return (
    <div className="min-h-screen bg-background">
      <div className="copper-thread" />
      <Navbar />

      <div className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-2xl mx-auto px-6 md:px-12">
          {step < TOTAL_STEPS && <QuizProgress step={step} total={TOTAL_STEPS} />}

          {step === 0 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 1 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-10">
                Where are you located?
              </h1>

              <div className="mb-10 space-y-4">
                <input
                  type="text"
                  value={answers.orgZipCode}
                  onChange={(e) => update("orgZipCode", e.target.value)}
                  placeholder="Enter your zip code"
                  className="w-full bg-card border border-border px-4 py-3.5 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors"
                />

             <CountyDropdown
                zip={answers.orgZipCode}
                value={answers.orgCounty}
                onChange={(county) => update("orgCounty", county)}
              />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 2 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-6">
                Who are you? (Select the option that best describes your organization)
              </h1>
              <div className="mb-4">
                {renderSingleSelect(ORG_TYPE_OPTIONS, "orgType")}
                {answers.orgType === "Something else" && (
                  <input
                    type="text"
                    value={answers.orgTypeOther}
                    onChange={(e) => update("orgTypeOther", e.target.value)}
                    placeholder="Tell us more"
                    className="w-full bg-card border border-border px-4 py-3.5 text-foreground placeholder:text-foreground/70 focus:border-primary focus:outline-none transition-colors mt-4"
                  />
                )}
              </div>

              <h2 className="font-heading text-lg text-foreground mb-4 mt-10">
                What category best describes your organization?
              </h2>
              <div className="mb-10">{renderSingleSelect(ORG_CATEGORY_OPTIONS, "orgCategory")}</div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 3 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-10">
                How big is your organization?
              </h1>

              <div className="flex flex-wrap gap-2 mb-10">
                {EMPLOYEE_COUNT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => update("employeeCount", option)}
                    className={`px-4 py-2.5 text-sm tracking-[0.02em] transition-colors ${
                      answers.employeeCount === option
                        ? "bg-primary text-primary-foreground"
                        : "border border-border text-foreground/70 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 4 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-6">
                What best describes your location and facility?
              </h1>

              <div className="mb-10">{renderSingleSelect(ORG_LOCATION_OPTIONS, "orgLocation")}</div>

              <h2 className="font-heading text-lg text-foreground mb-4">
                Which of these best describes your facility?
              </h2>
              <div className="mb-10">{renderSingleSelect(ORG_FACILITY_TYPE_OPTIONS, "orgFacilityType")}</div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 5 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-6">
                What best describes your day-to-day operations?
              </h1>

              <div className="mb-2">{renderMultiSelect(ORG_OPERATIONS_OPTIONS, "orgOperations", Infinity)}</div>
              <p className="text-foreground/70 text-sm mb-10">Select all that apply.</p>
            </div>
          )}

          {step === 5 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 6 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-6">
                Which resources and expenses matter most?
              </h1>

              <h2 className="font-heading text-lg text-foreground mb-4">Which resources does your organization rely on?</h2>
              <div className="mb-2">{renderMultiSelect(ORG_RESOURCES_USED_OPTIONS, "orgResourcesUsed")}</div>
              <p className="text-foreground/70 text-sm mb-10">Select up to 3.</p>

              <h2 className="font-heading text-lg text-foreground mb-4">Which costs would you most like to reduce?</h2>
              <div className="mb-2">{renderMultiSelect(ORG_RESOURCES_TO_REDUCE_OPTIONS, "orgResourcesToReduce")}</div>
              <p className="text-foreground/70 text-sm mb-10">Select up to 3.</p>
            </div>
          )}

          {step === 6 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 7 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-6">
                What sustainability areas and topics matter most to you?
              </h1>

              <div className="mb-2">{renderMultiSelect(ORG_SUSTAINABILITY_TOPICS_OPTIONS, "orgSustainabilityTopics")}</div>
              <p className="text-foreground/70 text-sm mb-10">Select up to 3.</p>
            </div>
          )}

          {step === 7 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 8 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-6">
                What have you already done to make your organization more environmentally sustainable?
              </h1>

              <h2 className="font-heading text-lg text-foreground mb-4">Practices you've already put in place</h2>
              <div className="mb-2">{renderMultiSelect(ORG_COMPLETED_PRACTICES_OPTIONS, "orgCompletedPractices", Infinity)}</div>
              <p className="text-foreground/70 text-sm mb-10">Select all that apply.</p>

              <h2 className="font-heading text-lg text-foreground mb-4">Assessments you've already completed</h2>
              <div className="mb-2">{renderMultiSelect(ORG_COMPLETED_ASSESSMENTS_OPTIONS, "orgCompletedAssessments", Infinity)}</div>
              <p className="text-foreground/70 text-sm mb-10">Select all that apply.</p>

              <h2 className="font-heading text-lg text-foreground mb-4">Overall, how would you describe where you're at?</h2>
              <div className="mb-2">{renderMultiSelect(ORG_EXPEREIENCE_LEVEL_OPTIONS, "orgExperienceLevel", Infinity)}</div>
              <p className="text-foreground/70 text-sm mb-10">Select all that apply.</p>
            </div>
          )}

          {step === 8 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 9 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-6">
                What challenges prevent you from doing more?
              </h1>

              <div className="mb-2">{renderMultiSelect(ORG_OBSTACLES_OPTIONS, "orgObstacles")}</div>
              <p className="text-foreground/70 text-sm mb-10">Select up to 3.</p>
            </div>
          )}

          {step === 9 && (
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4 text-[hsl(var(--accent))]">
                Question 10 of {TOTAL_STEPS}
              </p>
              <h1 className="font-heading text-2xl md:text-4xl text-foreground leading-tight mb-6">
                What type of help and recommendations would be most valuable?
              </h1>

              <h2 className="font-heading text-lg text-foreground mb-4">What kind of support are you looking for?</h2>
              <div className="mb-2">{renderMultiSelect(ORG_SUPPORT_NEEDED_OPTIONS, "orgSupportNeeded")}</div>
              <p className="text-foreground/70 text-sm mb-10">Select up to 3.</p>

              <h2 className="font-heading text-lg text-foreground mb-4">Which incentives interest you most?</h2>
              <div className="mb-2">{renderMultiSelect(ORG_INSENTIVES_DESIRED_OPTIONS, "orgInsentivesDesired")}</div>
              <p className="text-foreground/70 text-sm mb-10">Select up to 3.</p>

              <h2 className="font-heading text-lg text-foreground mb-4">How would you like your action plan organized?</h2>
              <div className="mb-2">{renderMultiSelect(ORG_PLAN_FORMAT_OPTIONS, "orgPlanFormat")}</div>
              <p className="text-foreground/70 text-sm mb-10">Select up to 3.</p>
            </div>
          )}

          {step < TOTAL_STEPS && (
            <div className="flex items-center gap-4">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-3 border border-foreground text-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-foreground hover:text-background transition-colors"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={!canContinue()}
                className="inline-flex items-center gap-3 text-primary-foreground px-8 py-4 text-sm tracking-[0.1em] uppercase hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-[hsl(var(--accent))]"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === TOTAL_STEPS && <QuizResults answers={answers} onRestart={handleRestart} />}
        </div>
      </div>

      <Footer />
    </div>
  );
}
