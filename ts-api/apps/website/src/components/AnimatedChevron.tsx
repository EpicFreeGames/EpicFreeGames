import { motion } from "framer-motion";
import { ChevronDown } from "tabler-icons-react";

type Props = {
  open: boolean;
  className?: string;
  size?: number;
};

export const AnimatedChevron = ({ open, className, size }: Props) => (
  <motion.div
    key="chevron"
    aria-hidden="true"
    className={className}
    initial={{ transform: "rotate(0deg)" }}
    animate={open ? { transform: "rotate(180deg)" } : { transform: "rotate(0deg)" }}
    transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
  >
    <ChevronDown size={size} />
  </motion.div>
);
