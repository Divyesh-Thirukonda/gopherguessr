// universal button so we can stop puting motion.button everywhere
import * as motion from "framer-motion/client";

export default function MotionButton({ className, onClick, children, type }) {
  return (
    <motion.button
      className={`${className} mx-auto inline-flex w-min items-center justify-center whitespace-nowrap rounded-full bg-rose-600 px-4 py-2 font-medium text-white hover:bg-rose-700`}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
      onClick={onClick}
      type={type}
    >
      {children}
    </motion.button>
  );
}
