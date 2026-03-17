import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";

const slides = [
  { id: 0, type: "cover" },
  { id: 1, type: "intro" },
  { id: 2, type: "definition" },
  { id: 3, type: "types" },
  { id: 4, type: "examples" },
  { id: 5, type: "sanctions" },
  { id: 6, type: "quiz" },
  { id: 7, type: "conclusion" },
  { id: 8, type: "sources" },
];

const quizQuestions = [
  {
    question: "Что такое юридическая ответственность?",
    options: [
      "Обязанность платить налоги",
      "Обязанность лица претерпевать меры государственного принуждения за совершённое правонарушение",
      "Право гражданина на защиту",
      "Добровольное соблюдение законов",
    ],
    correct: 1,
  },
  {
    question: "Какой вид ответственности предполагает лишение свободы?",
    options: [
      "Административная",
      "Гражданско-правовая",
      "Уголовная",
      "Дисциплинарная",
    ],
    correct: 2,
  },
  {
    question: "За нарушение правил дорожного движения грозит...",
    options: [
      "Уголовная ответственность",
      "Административная ответственность",
      "Гражданская ответственность",
      "Дисциплинарная ответственность",
    ],
    correct: 1,
  },
  {
    question: "С какого возраста наступает уголовная ответственность в РФ (по общему правилу)?",
    options: ["12 лет", "14 лет", "16 лет", "18 лет"],
    correct: 2,
  },
  {
    question: "Какой принцип означает, что за одно нарушение нельзя наказать дважды?",
    options: [
      "Принцип законности",
      "Принцип справедливости",
      "Принцип non bis in idem",
      "Принцип неотвратимости",
    ],
    correct: 2,
  },
];

export default function Index() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [quizStep, setQuizStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showInstruction, setShowInstruction] = useState(false);

  const goTo = (index: number) => {
    if (animating || index === currentSlide) return;
    setDirection(index > currentSlide ? "next" : "prev");
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setAnimating(false);
    }, 350);
  };

  const goNext = () => goTo(Math.min(currentSlide + 1, slides.length - 1));
  const goPrev = () => goTo(Math.max(currentSlide - 1, 0));

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === quizQuestions[quizStep].correct) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (quizStep + 1 >= quizQuestions.length) {
      setQuizFinished(true);
    } else {
      setQuizStep((s) => s + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setSelected(null);
    setScore(0);
    setQuizFinished(false);
    setAnswered(false);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentSlide, animating]);

  const animClass = animating
    ? direction === "next"
      ? "slide-exit-left"
      : "slide-exit-right"
    : direction === "next"
    ? "slide-enter-right"
    : "slide-enter-left";

  return (
    <div className="presentation-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .presentation-root {
          font-family: 'IBM Plex Sans', sans-serif;
          background: #0d1b2a;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          color: #e8edf2;
          overflow: hidden;
        }

        .top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 32px;
          background: rgba(10, 25, 47, 0.95);
          border-bottom: 1px solid rgba(99, 149, 215, 0.2);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .top-bar-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6395d7;
        }

        .slide-counter {
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          color: #4a6080;
          letter-spacing: 0.08em;
        }

        .instruction-btn {
          background: none;
          border: 1px solid rgba(99, 149, 215, 0.4);
          color: #6395d7;
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 12px;
          font-family: 'IBM Plex Sans', sans-serif;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.05em;
        }
        .instruction-btn:hover {
          background: rgba(99, 149, 215, 0.15);
          border-color: #6395d7;
        }

        .progress-bar {
          height: 3px;
          background: rgba(99, 149, 215, 0.15);
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b72c5, #6395d7);
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .slide-area {
          flex: 1;
          display: flex;
          overflow: hidden;
          position: relative;
        }

        .slide-wrapper {
          width: 100%;
          position: relative;
        }

        @keyframes enterRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes enterLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes exitLeft {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(-60px); }
        }
        @keyframes exitRight {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(60px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 1; transform: scale(1); }
        }

        .slide-enter-right { animation: enterRight 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .slide-enter-left { animation: enterLeft 0.38s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .slide-exit-left { animation: exitLeft 0.32s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .slide-exit-right { animation: exitRight 0.32s cubic-bezier(0.4, 0, 0.2, 1) forwards; }

        .fade-up { animation: fadeUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .fade-up-1 { animation: fadeUp 0.5s 0.1s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .fade-up-2 { animation: fadeUp 0.5s 0.2s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .fade-up-3 { animation: fadeUp 0.5s 0.3s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .fade-up-4 { animation: fadeUp 0.5s 0.4s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .fade-up-5 { animation: fadeUp 0.5s 0.5s cubic-bezier(0.4, 0, 0.2, 1) both; }
        .fade-up-6 { animation: fadeUp 0.5s 0.6s cubic-bezier(0.4, 0, 0.2, 1) both; }

        .slide-content {
          max-width: 960px;
          margin: 0 auto;
          padding: 60px 40px;
          min-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .slide-label {
          font-family: 'Montserrat', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #4a6080;
          margin-bottom: 16px;
        }

        .slide-title {
          font-family: 'Montserrat', sans-serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800;
          line-height: 1.15;
          color: #e8edf2;
          margin-bottom: 8px;
        }

        .slide-title span {
          color: #6395d7;
        }

        .slide-subtitle {
          font-size: 16px;
          color: #7a93b0;
          margin-bottom: 40px;
          font-weight: 300;
          line-height: 1.6;
        }

        .divider {
          width: 56px;
          height: 3px;
          background: linear-gradient(90deg, #3b72c5, #6395d7);
          margin-bottom: 40px;
          border-radius: 2px;
        }

        /* COVER */
        .cover-bg {
          position: relative;
          background: linear-gradient(135deg, #0a192f 0%, #0d1b2a 50%, #0f2035 100%);
        }
        .cover-bg::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(ellipse at 70% 30%, rgba(59, 114, 197, 0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .cover-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99, 149, 215, 0.12);
          border: 1px solid rgba(99, 149, 215, 0.3);
          color: #6395d7;
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 12px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 32px;
        }
        .cover-meta {
          margin-top: 48px;
          display: flex;
          gap: 40px;
          flex-wrap: wrap;
        }
        .cover-meta-item {
          border-left: 2px solid rgba(99, 149, 215, 0.3);
          padding-left: 16px;
        }
        .cover-meta-label {
          font-size: 11px;
          color: #4a6080;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }
        .cover-meta-value {
          font-size: 15px;
          color: #c8d6e8;
          font-weight: 500;
        }

        /* DEFINITION */
        .definition-box {
          background: rgba(59, 114, 197, 0.08);
          border: 1px solid rgba(99, 149, 215, 0.25);
          border-left: 4px solid #3b72c5;
          border-radius: 6px;
          padding: 28px 32px;
          margin-bottom: 32px;
        }
        .definition-text {
          font-size: 18px;
          line-height: 1.7;
          color: #c8d6e8;
          font-weight: 300;
        }
        .definition-text strong {
          color: #6395d7;
          font-weight: 600;
        }
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        .feature-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(99, 149, 215, 0.15);
          border-radius: 6px;
          padding: 20px;
        }
        .feature-icon {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .feature-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #a8c0dc;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .feature-text {
          font-size: 13px;
          color: #5a7490;
          line-height: 1.5;
        }

        /* TYPES */
        .type-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(99, 149, 215, 0.15);
          border-radius: 8px;
          padding: 22px 24px;
          display: flex;
          gap: 18px;
          align-items: flex-start;
          transition: all 0.25s ease;
        }
        .type-card:hover {
          border-color: rgba(99, 149, 215, 0.4);
          background: rgba(59, 114, 197, 0.06);
          transform: translateY(-2px);
        }
        .type-number {
          font-family: 'Montserrat', sans-serif;
          font-size: 24px;
          font-weight: 800;
          color: rgba(99, 149, 215, 0.3);
          line-height: 1;
          min-width: 36px;
        }
        .type-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 15px;
          font-weight: 700;
          color: #c8d6e8;
          margin-bottom: 4px;
        }
        .type-desc {
          font-size: 13px;
          color: #5a7490;
          line-height: 1.6;
        }
        .type-tag {
          display: inline-block;
          background: rgba(99, 149, 215, 0.12);
          border: 1px solid rgba(99, 149, 215, 0.25);
          color: #6395d7;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 3px;
          margin-top: 8px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          letter-spacing: 0.06em;
        }

        /* EXAMPLES */
        .example-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(99, 149, 215, 0.15);
          border-radius: 8px;
          padding: 24px;
          position: relative;
          overflow: hidden;
        }
        .example-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg, #3b72c5, transparent);
        }
        .example-type {
          font-size: 11px;
          font-family: 'Montserrat', sans-serif;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6395d7;
          margin-bottom: 8px;
        }
        .example-scenario {
          font-size: 15px;
          font-weight: 500;
          color: #c8d6e8;
          margin-bottom: 6px;
        }
        .example-result {
          font-size: 13px;
          color: #5a7490;
          line-height: 1.5;
        }
        .example-result strong {
          color: #a8c0dc;
        }

        /* SANCTIONS */
        .sanction-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          border-radius: 6px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(99, 149, 215, 0.1);
          transition: all 0.25s ease;
        }
        .sanction-row:hover {
          border-color: rgba(99, 149, 215, 0.3);
          background: rgba(59, 114, 197, 0.05);
        }
        .sanction-emoji { font-size: 20px; }
        .sanction-name {
          font-family: 'Montserrat', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #a8c0dc;
          flex: 1;
        }
        .sanction-level {
          font-size: 12px;
          color: #4a6080;
          background: rgba(99,149,215,0.08);
          padding: 3px 10px;
          border-radius: 3px;
          white-space: nowrap;
        }

        /* QUIZ */
        .quiz-question {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #e8edf2;
          line-height: 1.4;
          margin-bottom: 28px;
        }
        .quiz-option {
          width: 100%;
          text-align: left;
          padding: 16px 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(99, 149, 215, 0.2);
          border-radius: 6px;
          color: #c8d6e8;
          font-size: 15px;
          font-family: 'IBM Plex Sans', sans-serif;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .quiz-option:hover:not(:disabled) {
          border-color: #6395d7;
          background: rgba(59, 114, 197, 0.1);
        }
        .quiz-option:disabled { cursor: default; }
        .quiz-option.correct {
          border-color: #3d9e6b;
          background: rgba(61, 158, 107, 0.12);
          color: #7dd9b0;
        }
        .quiz-option.wrong {
          border-color: #c94a4a;
          background: rgba(201, 74, 74, 0.1);
          color: #e88a8a;
        }
        .option-letter {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1px solid rgba(99,149,215,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #6395d7;
          flex-shrink: 0;
        }
        .quiz-progress-bar {
          height: 4px;
          background: rgba(99, 149, 215, 0.15);
          border-radius: 2px;
          margin-bottom: 24px;
          overflow: hidden;
        }
        .quiz-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b72c5, #6395d7);
          border-radius: 2px;
          transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .quiz-nav-btn {
          margin-top: 20px;
          padding: 12px 28px;
          background: linear-gradient(135deg, #3b72c5, #5285d5);
          border: none;
          border-radius: 5px;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          display: block;
        }
        .quiz-nav-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(59, 114, 197, 0.4);
        }
        .quiz-result {
          text-align: center;
          animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .quiz-score-big {
          font-family: 'Montserrat', sans-serif;
          font-size: 72px;
          font-weight: 800;
          line-height: 1;
          background: linear-gradient(135deg, #3b72c5, #6395d7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
        }
        .quiz-result-text {
          font-size: 20px;
          color: #a8c0dc;
          margin-bottom: 8px;
        }
        .quiz-result-sub {
          font-size: 14px;
          color: #4a6080;
          margin-bottom: 32px;
        }

        /* CONCLUSION */
        .conclusion-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 18px 0;
          border-bottom: 1px solid rgba(99,149,215,0.1);
        }
        .conclusion-item:last-child { border-bottom: none; }
        .conclusion-num {
          font-family: 'Montserrat', sans-serif;
          font-size: 28px;
          font-weight: 800;
          color: rgba(99,149,215,0.2);
          min-width: 40px;
        }
        .conclusion-text {
          font-size: 15px;
          color: #a8c0dc;
          line-height: 1.7;
          padding-top: 4px;
        }

        /* SOURCES */
        .source-item {
          display: flex;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(99,149,215,0.08);
          align-items: flex-start;
        }
        .source-dot {
          width: 6px;
          height: 6px;
          background: #3b72c5;
          border-radius: 50%;
          margin-top: 8px;
          flex-shrink: 0;
        }
        .source-text {
          font-size: 14px;
          color: #5a7490;
          line-height: 1.6;
        }
        .source-text span {
          color: #7a98b8;
        }

        /* NAV */
        .nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          background: rgba(10, 25, 47, 0.95);
          border-top: 1px solid rgba(99, 149, 215, 0.12);
          backdrop-filter: blur(12px);
        }
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(99,149,215,0.2);
          border-radius: 5px;
          color: #7a93b0;
          font-family: 'Montserrat', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nav-btn:hover:not(:disabled) {
          border-color: #6395d7;
          color: #6395d7;
          background: rgba(99,149,215,0.08);
        }
        .nav-btn:disabled { opacity: 0.3; cursor: default; }
        .nav-dots {
          display: flex;
          gap: 8px;
        }
        .nav-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(99,149,215,0.2);
          cursor: pointer;
          transition: all 0.25s ease;
          border: none;
        }
        .nav-dot.active {
          background: #6395d7;
          transform: scale(1.3);
        }
        .nav-dot:hover { background: rgba(99,149,215,0.5); }

        /* INSTRUCTION MODAL */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: fadeUp 0.25s ease forwards;
        }
        .modal-box {
          background: #0d1b2a;
          border: 1px solid rgba(99,149,215,0.3);
          border-radius: 10px;
          padding: 40px;
          max-width: 560px;
          width: 100%;
          animation: scaleIn 0.25s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        .modal-title {
          font-family: 'Montserrat', sans-serif;
          font-size: 20px;
          font-weight: 800;
          color: #e8edf2;
          margin-bottom: 24px;
        }
        .modal-item {
          display: flex;
          gap: 14px;
          margin-bottom: 16px;
          align-items: flex-start;
        }
        .modal-icon {
          color: #6395d7;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .modal-text {
          font-size: 14px;
          color: #7a93b0;
          line-height: 1.6;
        }
        .modal-text strong {
          color: #a8c0dc;
        }
        .modal-close {
          margin-top: 28px;
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #3b72c5, #5285d5);
          border: none;
          border-radius: 5px;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modal-close:hover {
          box-shadow: 0 8px 24px rgba(59,114,197,0.4);
          transform: translateY(-1px);
        }

        .cols-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .cols-1 { display: flex; flex-direction: column; gap: 14px; }

        @media (max-width: 600px) {
          .slide-content { padding: 40px 20px; }
          .cover-meta { gap: 20px; }
          .cols-2 { grid-template-columns: 1fr; }
          .top-bar { padding: 12px 16px; }
          .nav-bar { padding: 12px 16px; }
          .modal-box { padding: 24px; }
        }
      `}</style>

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="top-bar-title">Юридическая ответственность</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="instruction-btn" onClick={() => setShowInstruction(true)}>
            Инструкция
          </button>
          <div className="slide-counter">{currentSlide + 1} / {slides.length}</div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }} />
      </div>

      {/* SLIDE AREA */}
      <div className="slide-area">
        <div className={`slide-wrapper ${animClass}`} key={currentSlide}>
          {currentSlide === 0 && <SlideCover />}
          {currentSlide === 1 && <SlideIntro />}
          {currentSlide === 2 && <SlideDefinition />}
          {currentSlide === 3 && <SlideTypes />}
          {currentSlide === 4 && <SlideExamples />}
          {currentSlide === 5 && <SlideSanctions />}
          {currentSlide === 6 && (
            <SlideQuiz
              quizStep={quizStep}
              selected={selected}
              answered={answered}
              score={score}
              quizFinished={quizFinished}
              onAnswer={handleAnswer}
              onNext={nextQuestion}
              onReset={resetQuiz}
            />
          )}
          {currentSlide === 7 && <SlideConclusion />}
          {currentSlide === 8 && <SlideSources />}
        </div>
      </div>

      {/* NAV BAR */}
      <div className="nav-bar">
        <button className="nav-btn" onClick={goPrev} disabled={currentSlide === 0}>
          <Icon name="ChevronLeft" size={16} /> Назад
        </button>
        <div className="nav-dots">
          {slides.map((_, i) => (
            <button key={i} className={`nav-dot ${i === currentSlide ? "active" : ""}`} onClick={() => goTo(i)} />
          ))}
        </div>
        <button className="nav-btn" onClick={goNext} disabled={currentSlide === slides.length - 1}>
          Вперёд <Icon name="ChevronRight" size={16} />
        </button>
      </div>

      {/* INSTRUCTION MODAL */}
      {showInstruction && (
        <div className="modal-overlay" onClick={() => setShowInstruction(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">📋 Инструкция к проекту</div>
            {[
              { icon: "ChevronRight", text: <><strong>Навигация по слайдам</strong> — кнопки «Назад» / «Вперёд» внизу или клавиши ← → на клавиатуре</> },
              { icon: "Circle", text: <><strong>Точки-индикаторы</strong> снизу — нажмите на любую, чтобы перейти к нужному разделу</> },
              { icon: "HelpCircle", text: <><strong>Викторина</strong> — находится на слайде 7. Выберите вариант ответа и нажмите «Далее»</> },
              { icon: "BarChart2", text: <><strong>Прогресс-бар</strong> вверху показывает, сколько разделов просмотрено</> },
              { icon: "Download", text: <><strong>Файл PowerPoint</strong> — смотри в папке проекта: файл <code>presentation.pptx</code> (инструкция ниже)</> },
            ].map((item, i) => (
              <div key={i} className="modal-item">
                <div className="modal-icon"><Icon name={item.icon as "ChevronRight"} fallback="CircleAlert" size={16} /></div>
                <div className="modal-text">{item.text}</div>
              </div>
            ))}
            <div style={{ marginTop: 20, padding: "16px", background: "rgba(99,149,215,0.07)", borderRadius: 6, border: "1px solid rgba(99,149,215,0.2)" }}>
              <div style={{ fontSize: 12, color: "#4a6080", marginBottom: 6, fontFamily: "Montserrat", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Файл PowerPoint</div>
              <div style={{ fontSize: 13, color: "#7a93b0", lineHeight: 1.6 }}>
                Чтобы скачать файл .pptx, воспользуйся кнопкой <strong style={{ color: "#a8c0dc" }}>Скачать → Скачать код</strong> в интерфейсе платформы. Файл <code>presentation_instructions.md</code> содержит подробную инструкцию по сборке презентации в PowerPoint.
              </div>
            </div>
            <button className="modal-close" onClick={() => setShowInstruction(false)}>Понятно, закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
}

function SlideCover() {
  return (
    <div className="slide-content cover-bg">
      <div className="cover-badge fade-up">
        <span>⚖️</span> Проектная работа · 9 класс · 2025–2026 уч. год
      </div>
      <div className="slide-title fade-up-1">
        Юридическая<br /><span>ответственность</span>
      </div>
      <div className="slide-subtitle fade-up-2" style={{ fontSize: 18, maxWidth: 520 }}>
        Понятие, виды и последствия для граждан Российской Федерации
      </div>
      <div className="divider fade-up-3" />
      <div className="cover-meta fade-up-4">
        <div className="cover-meta-item">
          <div className="cover-meta-label">Ученик</div>
          <div className="cover-meta-value">Иванов Алексей, 9 «А»</div>
        </div>
        <div className="cover-meta-item">
          <div className="cover-meta-label">Руководитель</div>
          <div className="cover-meta-value">Петрова Н.В.</div>
        </div>
        <div className="cover-meta-item">
          <div className="cover-meta-label">Предмет</div>
          <div className="cover-meta-value">Обществознание</div>
        </div>
      </div>
    </div>
  );
}

function SlideIntro() {
  return (
    <div className="slide-content">
      <div className="slide-label fade-up">Раздел 1 — Введение</div>
      <div className="slide-title fade-up-1">Цель и <span>задачи</span> работы</div>
      <div className="divider fade-up-2" />
      <div className="fade-up-2" style={{ marginBottom: 32 }}>
        <div style={{ background: "rgba(59,114,197,0.08)", border: "1px solid rgba(99,149,215,0.2)", borderLeft: "4px solid #3b72c5", borderRadius: 6, padding: "20px 24px", marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontFamily: "Montserrat", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6395d7", marginBottom: 8 }}>Цель работы</div>
          <div style={{ fontSize: 16, color: "#c8d6e8", lineHeight: 1.7, fontWeight: 300 }}>
            Изучить понятие юридической ответственности, её виды и роль в правовом государстве, а также показать, как эти нормы применяются в реальной жизни.
          </div>
        </div>
      </div>
      <div style={{ fontSize: 13, fontFamily: "Montserrat", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a6080", marginBottom: 16 }} className="fade-up-3">Задачи</div>
      <div className="cols-1 fade-up-3">
        {[
          { n: "01", t: "Дать определение юридической ответственности и её признаки" },
          { n: "02", t: "Изучить классификацию видов юридической ответственности" },
          { n: "03", t: "Привести реальные примеры из судебной и административной практики" },
          { n: "04", t: "Объяснить виды санкций и их значение для правопорядка" },
          { n: "05", t: "Сделать выводы о роли юридической ответственности в обществе" },
        ].map((item) => (
          <div key={item.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ fontFamily: "Montserrat", fontSize: 20, fontWeight: 800, color: "rgba(99,149,215,0.25)", minWidth: 36 }}>{item.n}</div>
            <div style={{ fontSize: 14, color: "#7a93b0", lineHeight: 1.6, paddingTop: 4 }}>{item.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideDefinition() {
  return (
    <div className="slide-content">
      <div className="slide-label fade-up">Раздел 2 — Основная часть</div>
      <div className="slide-title fade-up-1">Что такое юридическая <span>ответственность?</span></div>
      <div className="divider fade-up-2" />
      <div className="definition-box fade-up-2">
        <div className="definition-text">
          <strong>Юридическая ответственность</strong> — это обязанность лица, совершившего правонарушение, претерпевать предусмотренные законом <strong>неблагоприятные последствия</strong> в виде мер государственного принуждения.
        </div>
      </div>
      <div style={{ fontSize: 13, fontFamily: "Montserrat", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a6080", marginBottom: 16 }} className="fade-up-3">Ключевые признаки</div>
      <div className="feature-grid fade-up-3">
        {[
          { icon: "📜", title: "Законность", text: "Применяется только на основании закона, строго в установленном порядке" },
          { icon: "⚖️", title: "Справедливость", text: "Наказание соразмерно тяжести совершённого правонарушения" },
          { icon: "🔒", title: "Неотвратимость", text: "Каждое правонарушение должно влечь ответственность" },
          { icon: "🎯", title: "Индивидуальность", text: "За одно и то же нарушение нельзя наказать дважды" },
        ].map((f) => (
          <div key={f.title} className="feature-item">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-text">{f.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideTypes() {
  return (
    <div className="slide-content">
      <div className="slide-label fade-up">Раздел 3 — Классификация</div>
      <div className="slide-title fade-up-1">Виды юридической <span>ответственности</span></div>
      <div className="divider fade-up-2" />
      <div className="cols-1 fade-up-2">
        {[
          { n: "01", name: "Уголовная", desc: "За преступления (убийство, кража, мошенничество). Самый суровый вид — лишение свободы.", tag: "УК РФ" },
          { n: "02", name: "Административная", desc: "За нарушение правил ДД, санитарных норм и т.д. Чаще всего — штраф.", tag: "КоАП РФ" },
          { n: "03", name: "Гражданско-правовая", desc: "За нарушение договоров, причинение вреда имуществу. Компенсация ущерба.", tag: "ГК РФ" },
          { n: "04", name: "Дисциплинарная", desc: "За нарушение трудовой дисциплины. Выговор, увольнение.", tag: "ТК РФ" },
          { n: "05", name: "Материальная", desc: "Обязанность работника возместить ущерб работодателю и наоборот.", tag: "ТК РФ" },
        ].map((t) => (
          <div key={t.n} className="type-card">
            <div className="type-number">{t.n}</div>
            <div>
              <div className="type-name">{t.name}</div>
              <div className="type-desc">{t.desc}</div>
              <div className="type-tag">{t.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideExamples() {
  return (
    <div className="slide-content">
      <div className="slide-label fade-up">Раздел 4 — Практика</div>
      <div className="slide-title fade-up-1">Примеры из <span>жизни</span></div>
      <div className="divider fade-up-2" />
      <div className="cols-2 fade-up-2">
        {[
          { type: "Уголовная", scenario: "Кража в магазине", result: <>Наказание: <strong>до 2 лет лишения свободы</strong> (ст. 158 УК РФ) или штраф до 80 000 ₽</> },
          { type: "Административная", scenario: "Превышение скорости на 40 км/ч", result: <>Наказание: <strong>штраф 1 500 ₽</strong> по КоАП РФ ст. 12.9</> },
          { type: "Гражданско-правовая", scenario: "Залил соседей в квартире", result: <>Обязанность <strong>возместить ущерб</strong> — ремонт, испорченное имущество</> },
          { type: "Дисциплинарная", scenario: "Опоздание на работу без уважительной причины", result: <>Работодатель вправе объявить <strong>выговор или замечание</strong></> },
          { type: "Уголовная", scenario: "Подросток 16 лет угнал автомобиль", result: <>Уголовная ответственность с 16 лет: <strong>до 5 лет</strong> ограничения свободы</> },
          { type: "Административная", scenario: "Выбросил мусор в неположенном месте", result: <>Штраф для граждан: <strong>от 1 000 до 2 000 ₽</strong> (ст. 8.2 КоАП)</> },
        ].map((e, i) => (
          <div key={i} className="example-card">
            <div className="example-type">{e.type}</div>
            <div className="example-scenario">{e.scenario}</div>
            <div className="example-result">{e.result}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideSanctions() {
  return (
    <div className="slide-content">
      <div className="slide-label fade-up">Раздел 5 — Санкции</div>
      <div className="slide-title fade-up-1">Последствия и <span>санкции</span></div>
      <div className="divider fade-up-2" />
      <div className="slide-subtitle fade-up-2">Виды мер государственного принуждения от мягких к строгим</div>
      <div className="cols-1 fade-up-3">
        {[
          { emoji: "📝", name: "Предупреждение", level: "Минимальная мера" },
          { emoji: "💸", name: "Штраф", level: "Административная / Уголовная" },
          { emoji: "📋", name: "Выговор / Замечание", level: "Дисциплинарная" },
          { emoji: "📌", name: "Лишение специального права", level: "Напр., водительского удостоверения" },
          { emoji: "🔨", name: "Конфискация имущества", level: "Уголовная / Административная" },
          { emoji: "🏠", name: "Ограничение свободы", level: "Уголовная (условно или реально)" },
          { emoji: "⛓", name: "Лишение свободы", level: "Самая строгая мера, уголовная" },
        ].map((s) => (
          <div key={s.name} className="sanction-row">
            <div className="sanction-emoji">{s.emoji}</div>
            <div className="sanction-name">{s.name}</div>
            <div className="sanction-level">{s.level}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface QuizProps {
  quizStep: number;
  selected: number | null;
  answered: boolean;
  score: number;
  quizFinished: boolean;
  onAnswer: (i: number) => void;
  onNext: () => void;
  onReset: () => void;
}

function SlideQuiz({ quizStep, selected, answered, score, quizFinished, onAnswer, onNext, onReset }: QuizProps) {
  const q = quizQuestions[quizStep];
  const letters = ["А", "Б", "В", "Г"];

  return (
    <div className="slide-content">
      <div className="slide-label fade-up">Раздел 6 — Викторина</div>
      <div className="slide-title fade-up-1">Проверь свои <span>знания</span></div>
      <div className="divider fade-up-2" />

      {quizFinished ? (
        <div className="quiz-result fade-up-2">
          <div className="quiz-score-big">{score}/{quizQuestions.length}</div>
          <div className="quiz-result-text">
            {score === quizQuestions.length ? "Отлично! Ты настоящий знаток права!" :
             score >= 3 ? "Хорошо! Материал усвоен в целом." :
             "Стоит ещё раз изучить тему."}
          </div>
          <div className="quiz-result-sub">Правильных ответов: {score} из {quizQuestions.length}</div>
          <button className="quiz-nav-btn" style={{ margin: "0 auto" }} onClick={onReset}>
            Пройти ещё раз
          </button>
        </div>
      ) : (
        <div className="fade-up-2">
          <div className="quiz-progress-bar">
            <div className="quiz-progress-fill" style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }} />
          </div>
          <div style={{ fontSize: 12, fontFamily: "Montserrat", color: "#4a6080", marginBottom: 20, letterSpacing: "0.06em" }}>
            Вопрос {quizStep + 1} из {quizQuestions.length}
          </div>
          <div className="quiz-question">{q.question}</div>
          <div className="cols-1">
            {q.options.map((opt: string, i: number) => {
              let cls = "quiz-option";
              if (answered) {
                if (i === q.correct) cls += " correct";
                else if (i === selected) cls += " wrong";
              }
              return (
                <button key={i} className={cls} onClick={() => onAnswer(i)} disabled={answered}>
                  <div className="option-letter">{letters[i]}</div>
                  {opt}
                </button>
              );
            })}
          </div>
          {answered && (
            <button className="quiz-nav-btn" onClick={onNext}>
              {quizStep + 1 < quizQuestions.length ? "Следующий вопрос →" : "Посмотреть результат"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SlideConclusion() {
  return (
    <div className="slide-content">
      <div className="slide-label fade-up">Раздел 7 — Заключение</div>
      <div className="slide-title fade-up-1">Выводы по <span>работе</span></div>
      <div className="divider fade-up-2" />
      <div className="fade-up-2">
        {[
          "Юридическая ответственность — важнейший инструмент правового государства, без которого невозможно поддерживать порядок в обществе.",
          "Разные виды ответственности (уголовная, административная, гражданская, дисциплинарная) охватывают все сферы жизни человека.",
          "Незнание закона не освобождает от ответственности — каждый гражданин обязан знать основы права.",
          "Принципы законности, справедливости и неотвратимости делают систему ответственности справедливой и эффективной.",
          "Осознание последствий правонарушений помогает принимать правильные решения и жить в правовом обществе.",
        ].map((text, i) => (
          <div key={i} className="conclusion-item">
            <div className="conclusion-num">0{i + 1}</div>
            <div className="conclusion-text">{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideSources() {
  return (
    <div className="slide-content">
      <div className="slide-label fade-up">Раздел 8 — Источники</div>
      <div className="slide-title fade-up-1">Список использованной <span>литературы</span></div>
      <div className="divider fade-up-2" />
      <div style={{ marginBottom: 12, fontSize: 11, fontFamily: "Montserrat", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a6080" }} className="fade-up-2">Нормативные акты</div>
      {[
        "Конституция Российской Федерации (принята 12.12.1993 г.)",
        "Уголовный кодекс Российской Федерации от 13.06.1996 № 63-ФЗ",
        "Кодекс об административных правонарушениях РФ от 30.12.2001 № 195-ФЗ",
        "Гражданский кодекс Российской Федерации (части I–IV)",
        "Трудовой кодекс Российской Федерации от 30.12.2001 № 197-ФЗ",
      ].map((s, i) => (
        <div key={i} className={`source-item fade-up-${i + 2}`}>
          <div className="source-dot" />
          <div className="source-text"><span>{s}</span></div>
        </div>
      ))}
      <div style={{ marginTop: 20, marginBottom: 12, fontSize: 11, fontFamily: "Montserrat", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a6080" }} className="fade-up-3">Учебная литература и интернет-источники</div>
      {[
        "Боголюбов Л.Н. и др. Обществознание. 9 класс. — М.: Просвещение, 2023.",
        "Певцова Е.А. Право: основы правовой культуры. 10–11 кл. — М.: Русское слово, 2022.",
        "Официальный сайт КонсультантПлюс — www.consultant.ru",
        "Портал правовой информации — www.pravo.gov.ru",
        "Сайт Верховного суда Российской Федерации — www.vsrf.ru",
      ].map((s, i) => (
        <div key={i} className={`source-item fade-up-${i + 3}`}>
          <div className="source-dot" style={{ background: "#6395d7" }} />
          <div className="source-text"><span>{s}</span></div>
        </div>
      ))}
    </div>
  );
}