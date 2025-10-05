import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Pagination, Navigation } from "swiper/modules";
import emailjs from "@emailjs/browser";
import Confetti from "react-confetti";

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./App.css";

// --- IMPORT NHẠC VÀ HÌNH ẢNH ---
import song from "./assets/song.mp3";
import avt from "./assets/3.png";
import img1 from "./assets/1.jpeg";
import img2 from "./assets/2.jpeg";
import img3 from "./assets/4.jpeg";
import img4 from "./assets/5.jpeg";
import img5 from "./assets/6.jpeg";
import img6 from "./assets/7.jpeg";
import img7 from "./assets/888.jpeg";

// --- IMPORT ẢNH CHO COUPON ---
import couponImg1 from "./assets/l1.PNG";
import couponImg2 from "./assets/l2.PNG";
import couponImg3 from "./assets/l3.PNG";
import couponImg4 from "./assets/l4.PNG";

import {
  FaHeart,
  FaGift,
  FaBirthdayCake,
  FaChevronDown,
  FaCheckCircle,
  FaTimesCircle,
  FaPaperPlane,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";

// --- DỮ LIỆU ---
const memories = [
  { img: img2, caption: "Mình nắm tay nè" },
  { img: img3, caption: "Giống ai cơ" },
  { img: img4, caption: "Mình nhìn nhau đắm say" },
  { img: img6, caption: "Bông hoa đầu tiên của bé" },
  { img: img5, caption: "Anh chuẩn bị quà cho bé" },
  { img: img1, caption: "Che chở cho bé iu" },
  { img: img7, caption: "Sẽ còn nữa trong tương lai nè" },
];

const coupons = [
  {
    id: 1,
    img: couponImg1, // Thay thế icon bằng img
    title: "Vui vẻ",
    desc: "Bé chỉ cần vui vẻ mọi thứ sẽ ổn, vì có anh rồi mà.",
  },
  {
    id: 2,
    img: couponImg2, // Thay thế icon bằng img
    title: "Giận hờn",
    desc: "Nhớ đợi anh xíu nha, anh hong bỏ bé đâu mà",
  },
  {
    id: 3,
    img: couponImg3,
    title: "Buồn bã",
    desc: "Đối với anh bé xinh lắm nên đừng nghĩ nhiều nha!",
  },
  {
    id: 4,
    img: couponImg4, // Thay thế icon bằng img
    title: "Nóng nảy",
    desc: "Đôi lúc anh cũng sợ, cũng buồn, nhưng anh sẽ cố gắng vì bé",
  },
];

const quizQuestions = [
  {
    question: "Ngày đầu tiên mình gặp nhau là ngày mấy?",
    options: ["04/08", "20/8", "29/07", "25/07"],
    answer: "29/07",
  },
  {
    question: "Nơi thứ 3 mình đi là đi đâu?",
    options: ["Rạp phim", "Đi ăn", "Quán nước", "Đi dạo"],
    answer: "Đi ăn",
  },
  {
    question: "Món ăn gì mình chưa từng ăn với nhau?",
    options: ["Bắp rang", "Chân gà", "Lẩu bò", "Mì trộn"],
    answer: "Lẩu bò",
  },
  {
    question: "Bộ phim thứ 2 mình xem với nhau là gì?",
    options: ["Conan", "Dính lẹo", "Weapons", "Lưỡi hái tử thần"],
    answer: "Lưỡi hái tử thần",
  },
];

// --- CÁC VARIANTS CHO ANIMATION ---
const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1,
    },
  },
};
const bounceVariants = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 10 },
  },
};
const wordAnimation = {
  hover: {
    scale: 1.15,
    color: "#ff1493",
    transition: { type: "spring", damping: 10, stiffness: 300 },
  },
  tap: { scale: 0.9 },
};
const sentenceVariant = {
  initial: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};
const letterVariant = {
  initial: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 150, damping: 10 },
  },
};
const svgHandwritingVariants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2.5, ease: "easeInOut", delay: 0.5 },
  },
};

// --- COMPONENTS ---

const AnimatedLetters = React.memo(({ text, className }) => (
  <motion.h1
    className={className}
    variants={sentenceVariant}
    initial="initial"
    whileInView="visible"
    viewport={{ once: true }}
  >
    {Array.from(text).map((char, index) => (
      <motion.span
        key={`${char}-${index}`}
        variants={letterVariant}
        style={{ display: "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </motion.h1>
));

const HandwritingText = React.memo(() => (
  <motion.svg
    className="handwriting-svg"
    viewBox="0 0 800 200"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
  >
    <motion.path
      d="M 60 120 C 70 50, 110 50, 120 120 C 130 190, 170 190, 180 120 L 210 120 C 220 50, 260 50, 270 120 C 280 190, 320 190, 330 120 M 390 120 C 390 50, 450 50, 450 120 M 490 120 C 500 50, 540 50, 550 120 L 580 120 C 590 50, 630 50, 640 120 C 650 190, 690 190, 700 120"
      fill="transparent"
      strokeWidth="8"
      strokeLinecap="round"
      variants={svgHandwritingVariants}
    />
  </motion.svg>
));

const FallingObjects = React.memo(() => {
  const objects = useMemo(() => {
    const items = [];
    const createItem = (type, index, content = null) => ({
      id: `${type}-${index}`,
      type,
      content,
      style: {
        left: `${Math.random() * 100}vw`,
        fontSize: `${Math.random() * (type === "word" ? 1.2 : 1) + 0.8}rem`,
        animationDuration: `${Math.random() * 5 + 10}s`,
        animationDelay: `${Math.random() * 15}s`,
        animationName:
          Math.random() > 0.5 ? "naturalFall" : "naturalFallAlternate",
      },
    });
    for (let i = 0; i < 20; i++) items.push(createItem("heart", i, "❤️"));
    for (let i = 0; i < 10; i++) items.push(createItem("word", i, "Fhux"));
    for (let i = 0; i < 15; i++) items.push(createItem("petal", i));
    return items;
  }, []);
  return (
    <div className="falling-container" aria-hidden="true">
      {objects.map((obj) => (
        <div
          key={obj.id}
          className={`falling-item ${obj.type}-item`}
          style={obj.style}
        >
          {obj.content}
        </div>
      ))}
    </div>
  );
});

const GlassCard = ({ children, onClick, ...props }) => {
  const [ripples, setRipples] = useState([]);

  const createRipple = (event) => {
    if (
      event.target.closest(
        "button, a, .swiper-button-next, .swiper-button-prev"
      )
    ) {
      return;
    }
    const card = event.currentTarget;
    const { left, top } = card.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((current) => current.filter((r) => r.id !== newRipple.id));
    }, 1000);
  };

  return (
    <motion.div className="glass-card" onClick={createRipple} {...props}>
      {children}
      <AnimatePresence>
        {ripples.map((r) => (
          <span key={r.id} className="ripple" style={{ left: r.x, top: r.y }} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

const Coupon = ({ data, onFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleClick = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
    onFlip({ x: e.clientX, y: e.clientY });
  };
  return (
    <motion.div
      className="coupon"
      onClick={handleClick}
      variants={bounceVariants}
      whileHover={{ y: -10, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <motion.div
        className="coupon-flipper"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="coupon-front">
          {/* Thay thế div icon bằng thẻ img */}
          <img src={data.img} alt={data.title} className="coupon-image" />
          <p>{data.title}</p>
        </div>
        <div className="coupon-back">
          <h3>{data.desc}</h3>
        </div>
      </motion.div>
    </motion.div>
  );
};

const MusicToggle = React.memo(({ isPlaying, onToggle }) => {
  return (
    <motion.button
      className="music-toggle"
      onClick={onToggle}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      whileHover={{ scale: 1.15, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div animate={{ rotate: isPlaying ? 360 : 0 }}>
        {isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
      </motion.div>
    </motion.button>
  );
});

const Quiz = ({ questions, onCorrectAnswer }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const isCorrect = selectedOption === questions[currentQuestion]?.answer;

  const handleOptionClick = (option, e) => {
    e.stopPropagation();
    setSelectedOption(option);
    if (option === questions[currentQuestion].answer) {
      onCorrectAnswer({ x: e.clientX, y: e.clientY });
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
      setSelectedOption(null);
    }
  };
  const q = questions[currentQuestion];

  return (
    <motion.div
      className="quiz-question"
      key={currentQuestion}
      variants={bounceVariants}
    >
      <p className="question-text">{q.question}</p>
      <div className="options-grid">
        {q.options.map((opt, index) => (
          <motion.button
            key={index}
            className={`option-button ${
              selectedOption &&
              (opt === q.answer
                ? "correct"
                : opt === selectedOption
                ? "wrong"
                : "")
            }`}
            onClick={(e) => handleOptionClick(opt, e)}
            disabled={!!selectedOption}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {opt}
            {selectedOption &&
              opt === selectedOption &&
              (isCorrect ? (
                <FaCheckCircle className="icon-feedback" />
              ) : (
                <FaTimesCircle className="icon-feedback" />
              ))}
          </motion.button>
        ))}
      </div>
      {selectedOption && currentQuestion < questions.length - 1 && (
        <motion.button
          onClick={handleNext}
          className="action-button next-button"
        >
          Câu tiếp theo
        </motion.button>
      )}
    </motion.div>
  );
};

const ParticleSystem = React.forwardRef((props, ref) => {
  const [particles, setParticles] = useState([]);
  React.useImperativeHandle(ref, () => ({
    addBurst({ x, y }) {
      const newParticles = Array.from({ length: 20 }).map(() => ({
        id: Math.random(),
        x,
        y,
        endX: (Math.random() - 0.5) * 300,
        endY: (Math.random() - 0.5) * 300,
        color: `hsl(${Math.random() * 360}, 100%, 75%)`,
        duration: Math.random() * 1 + 0.5,
      }));
      setParticles((current) => [...current, ...newParticles]);
    },
  }));
  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="particle"
          style={{ backgroundColor: p.color, top: p.y, left: p.x }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{ x: p.endX, y: p.endY, scale: 0, opacity: 0 }}
          transition={{ duration: p.duration, ease: "easeOut" }}
          onAnimationComplete={() => {
            setParticles((current) =>
              current.filter((particle) => particle.id !== p.id)
            );
          }}
        />
      ))}
    </AnimatePresence>
  );
});

// --- MAIN APP ---
function App() {
  const finalFormRef = useRef();
  const audioRef = useRef(null);
  const particleRef = useRef();
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendError(null);
    emailjs
      .sendForm(
        "service_7r2emvd",
        "template_3jzvvcs",
        finalFormRef.current,
        "Qfb1uz01ewCrHiZNu"
      )
      .then(
        () => {
          setIsSent(true);
          setIsSending(false);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 8000);
        },
        () => {
          setSendError("Oops! Có lỗi xảy ra, thử lại nhé .");
          setIsSending(false);
        }
      );
  };

  const toggleMusic = useCallback(() => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((error) => console.log("Audio play failed:", error));
      }
      setIsPlayingMusic((prev) => !prev);
    }
  }, [isPlayingMusic]);

  const triggerParticleBurst = useCallback((coords) => {
    particleRef.current?.addBurst(coords);
  }, []);

  return (
    <motion.div
      className={`full-page-wrapper ${isPlayingMusic ? "music-playing" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.1}
        />
      )}
      <FallingObjects />
      <ParticleSystem ref={particleRef} />
      <audio autoPlay={true} ref={audioRef} src={song} loop />
      <MusicToggle isPlaying={isPlayingMusic} onToggle={toggleMusic} />

      <main className="app-container">
        <section className="slide welcome-slide">
          <GlassCard variants={cardVariants} initial="hidden" animate="visible">
            <motion.div
              className="avatar"
              variants={bounceVariants}
              whileTap={{ scale: 0.9 }}
              whileDrag={{
                scale: 1.1,
                boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
              }}
              drag
              dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
              dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
            >
              <img src={avt} alt="Her Avatar" />
            </motion.div>
            <AnimatedLetters text="My Dearest," className="title" />
            <motion.h2 className="title-secondary" variants={bounceVariants}>
              Chúc mừng sinh nhật!
            </motion.h2>
            <motion.p className="subtitle" variants={bounceVariants}>
              Đây là món quà nhỏ 🎁 anh{" "}
              <motion.span {...wordAnimation} className="highlight-word">
                đặc biệt
              </motion.span>{" "}
              tự tay chuẩn bị cho{" "}
              <motion.span {...wordAnimation} className="highlight-word">
                bé 🫶
              </motion.span>
              . Tuy giá trị vật chất không lớn, nhưng anh hy vọng nó sẽ mang lại
              thật nhiều{" "}
              <motion.span {...wordAnimation} className="highlight-word">
                niềm vui
              </motion.span>{" "}
              cho 😊 trong ngày đặc biệt này.
            </motion.p>
            <motion.div className="icon-group" variants={bounceVariants}>
              <FaHeart />
              <FaGift />
              <FaBirthdayCake />
            </motion.div>
            <FaChevronDown className="scroll-indicator" />
          </GlassCard>
        </section>

        <section className="slide">
          <GlassCard
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={bounceVariants} className="title-secondary">
              Kỷ Niệm Chúng Ta
            </motion.h2>
            <motion.div variants={bounceVariants} className="memory-carousel">
              <Swiper
                effect={"cards"}
                grabCursor={true}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[EffectCards, Pagination, Navigation]}
                className="mySwiper"
              >
                {memories.map((mem, index) => (
                  <SwiperSlide key={index}>
                    <div className="swiper-image-container">
                      <img src={mem.img} alt={`Kỷ niệm ${index + 1}`} />
                    </div>
                    <div className="caption-container">
                      <p className="caption">{mem.caption}</p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </GlassCard>
        </section>

        <section className="slide">
          <GlassCard
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={bounceVariants} className="title-secondary">
              Phiếu cảm xúc
            </motion.h2>
            <motion.p className="subtitle" variants={bounceVariants}>
              Chọn một phiếu quà thích nhé!
            </motion.p>
            <div className="coupon-grid">
              {coupons.map((coupon) => (
                <Coupon
                  key={coupon.id}
                  data={coupon}
                  onFlip={triggerParticleBurst}
                />
              ))}
            </div>
          </GlassCard>
        </section>

        <section className="slide">
          <GlassCard
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={bounceVariants} className="title-secondary">
              Thử thách trí nhớ
            </motion.h2>
            <Quiz
              questions={quizQuestions}
              onCorrectAnswer={triggerParticleBurst}
            />
          </GlassCard>
        </section>

        <section className="slide">
          <GlassCard
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="final-content-wrapper"
              variants={bounceVariants}
            >
              <div className="heart-final">💖</div>
              <HandwritingText />
              <p className="subtitle">
                Đó có thể là tất cả của món quà này, cảm ơn vì đã đến với anh.
              </p>
              <form
                ref={finalFormRef}
                onSubmit={handleSendMessage}
                className="message-form"
              >
                <textarea
                  name="message"
                  placeholder="Gửi lời nhắn yêu thương đến anh..."
                  required
                  disabled={isSending || isSent}
                />
                <button
                  type="submit"
                  disabled={isSending || isSent}
                  className="action-button"
                >
                  {isSending ? (
                    "Đang gửi..."
                  ) : isSent ? (
                    "Đã gửi! ❤️"
                  ) : (
                    <>
                      Gửi Lời Nhắn <FaPaperPlane />
                    </>
                  )}
                </button>
                {sendError && <p className="error-message">{sendError}</p>}
              </form>
            </motion.div>
          </GlassCard>
        </section>
      </main>
    </motion.div>
  );
}

export default App;