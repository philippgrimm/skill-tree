import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, Variants } from 'framer-motion';

// Main component for the skill tree visualization
export default function GitTree() {
    // Track current state
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Animation controls for orchestrating sequences
    const controls = useAnimation();

    // Initialize and run the animation sequence when component mounts
    useEffect(() => {
        const sequence = async () => {
            // Start with the main branch
            await controls.start('mainBranchVisible');
            // Then reveal main nodes
            await controls.start('mainNodesVisible');
            // Then show side branches
            await controls.start('branchesVisible');
            // Finally show all the skill nodes
            await controls.start('nodesVisible');

            setInitialized(true);
        };

        sequence();
    }, [controls]);

    // Branch animation variants
    const mainBranchVariant: Variants = {
        hidden: {
            scaleY: 0,
            opacity: 0
        },
        mainBranchVisible: {
            scaleY: 1,
            opacity: 1,
            transition: {
                duration: 1,
                ease: "easeInOut"
            }
        }
    };

    // Main node animation variants
    const mainNodeVariant: Variants = {
        hidden: {
            scale: 0,
            opacity: 0
        },
        mainNodesVisible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.6,
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        },
        hover: {
            scale: 1.2,
            boxShadow: "0 0 25px rgba(167,139,250,0.9)",
            transition: {
                duration: 0.2,
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    // Side branches animation variants
    const branchVariant: Variants = {
        hidden: {
            scaleX: 0,
            opacity: 0
        },
        branchesVisible: {
            scaleX: 1,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    // Skill node animation variants
    const skillNodeVariant: Variants = {
        hidden: {
            scale: 0,
            opacity: 0
        },
        nodesVisible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
                staggerChildren: 0.07,
                delayChildren: 0.1
            }
        },
        hover: {
            scale: 1.25,
            boxShadow: "0 0 25px rgba(167,139,250,0.9)",
            transition: {
                duration: 0.2
            }
        }
    };

    // Connector node animation variants with enhanced pulsing
    const connectorNodeVariant: Variants = {
        hidden: {
            scale: 0,
            opacity: 0
        },
        nodesVisible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
                delay: 0.5
            }
        },
        pulse: {
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
            boxShadow: [
                "0 0 10px rgba(167,139,250,0.4)",
                "0 0 15px rgba(167,139,250,0.7)",
                "0 0 10px rgba(167,139,250,0.4)"
            ],
            transition: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    };

    // Label animation variants for when hovering
    const labelVariant: Variants = {
        hidden: {
            opacity: 0,
            y: 5
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2
            }
        },
        exit: {
            opacity: 0,
            y: -5,
            transition: {
                duration: 0.1
            }
        }
    };

    // Background glow animation
    const glowVariant: Variants = {
        hidden: {
            opacity: 0,
            scale: 0.8
        },
        visible: {
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
            transition: {
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror"
            }
        }
    };

    return (
        <div className="relative mt-16 h-96 w-full mx-auto flex justify-center items-center" ref={containerRef}>
            {/* Background glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="h-80 w-80 rounded-full bg-gradient-to-b from-violet-500/20 to-indigo-500/20 blur-2xl"
                    variants={glowVariant}
                    initial="hidden"
                    animate="visible"
                />
            </div>

            {/* Main skill tree container */}
            <div className="relative h-80 w-full max-w-xs sm:max-w-sm md:max-w-md">
                <div className="relative h-full w-full">
                    {/* Main central branch */}
                    <motion.div
                        className="absolute left-1/2 top-0 h-80 w-1.5 -translate-x-1/2 bg-gradient-to-b from-violet-400/90 via-neutral-700/90 to-violet-500/90"
                        variants={mainBranchVariant}
                        initial="hidden"
                        animate={controls}
                        style={{ originY: 0, transformOrigin: "center top" }}
                    />

                    {/* Top main node (Start) */}
                    <motion.div
                        className="absolute left-1/2 top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_15px_rgba(167,139,250,0.5)] cursor-pointer"
                        variants={mainNodeVariant}
                        initial="hidden"
                        animate={controls}
                        whileHover="hover"
                        onHoverStart={() => setActiveNode("Start")}
                        onHoverEnd={() => setActiveNode(null)}
                    >
                        <AnimatePresence>
                            {activeNode === "Start" && (
                                <motion.div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-900/80 shadow-lg"
                                    variants={labelVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <span className="whitespace-nowrap text-sm font-medium text-white/90">Start</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Bottom main node (Mastery) */}
                    <motion.div
                        className="absolute left-1/2 top-full h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(167,139,250,0.5)] cursor-pointer"
                        variants={mainNodeVariant}
                        initial="hidden"
                        animate={controls}
                        whileHover="hover"
                        onHoverStart={() => setActiveNode("Mastery")}
                        onHoverEnd={() => setActiveNode(null)}
                    >
                        <AnimatePresence>
                            {activeNode === "Mastery" && (
                                <motion.div
                                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-900/80 shadow-lg"
                                    variants={labelVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <span className="whitespace-nowrap text-sm font-medium text-white/90">Mastery</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Connection points on main branch with pulsing animation */}
                    <motion.div
                        className="absolute left-1/2 top-1/4 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(167,139,250,0.5)] z-10 cursor-pointer"
                        variants={connectorNodeVariant}
                        initial="hidden"
                        animate={initialized ? "pulse" : "nodesVisible"}
                        whileHover="hover"
                        onHoverStart={() => setActiveNode("Fundamentals")}
                        onHoverEnd={() => setActiveNode(null)}
                    >
                        <AnimatePresence>
                            {activeNode === "Fundamentals" && (
                                <motion.div
                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-900/80 shadow-lg"
                                    variants={labelVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <span className="whitespace-nowrap text-xs font-medium text-white/90">Fundamentals</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(167,139,250,0.5)] z-10 cursor-pointer"
                        variants={connectorNodeVariant}
                        initial="hidden"
                        animate={initialized ? "pulse" : "nodesVisible"}
                        whileHover="hover"
                        onHoverStart={() => setActiveNode("Intermediate")}
                        onHoverEnd={() => setActiveNode(null)}
                    >
                        <AnimatePresence>
                            {activeNode === "Intermediate" && (
                                <motion.div
                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-900/80 shadow-lg"
                                    variants={labelVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <span className="whitespace-nowrap text-xs font-medium text-white/90">Intermediate</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        className="absolute left-1/2 top-3/4 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(167,139,250,0.5)] z-10 cursor-pointer"
                        variants={connectorNodeVariant}
                        initial="hidden"
                        animate={initialized ? "pulse" : "nodesVisible"}
                        whileHover="hover"
                        onHoverStart={() => setActiveNode("Advanced")}
                        onHoverEnd={() => setActiveNode(null)}
                    >
                        <AnimatePresence>
                            {activeNode === "Advanced" && (
                                <motion.div
                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-900/80 shadow-lg"
                                    variants={labelVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <span className="whitespace-nowrap text-xs font-medium text-white/90">Advanced</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Right side branches only */}
                    <motion.div
                        className="absolute left-1/2 top-1/4 h-1.5 w-[90px] translate-x-0 bg-gradient-to-r from-neutral-700 to-indigo-500/40"
                        variants={branchVariant}
                        initial="hidden"
                        animate={controls}
                        style={{ originX: 0, transformOrigin: "left center" }}
                    />

                    <motion.div
                        className="absolute left-1/2 top-1/2 h-1.5 w-[90px] translate-x-0 bg-gradient-to-r from-neutral-700 to-blue-500/40"
                        variants={branchVariant}
                        initial="hidden"
                        animate={controls}
                        style={{ originX: 0, transformOrigin: "left center" }}
                    />

                    <motion.div
                        className="absolute left-1/2 top-3/4 h-1.5 w-[90px] translate-x-0 bg-gradient-to-r from-neutral-700 to-violet-500/40"
                        variants={branchVariant}
                        initial="hidden"
                        animate={controls}
                        style={{ originX: 0, transformOrigin: "left center" }}
                    />

                    {/* End nodes - right side only */}
                    <motion.div
                        className="absolute left-[calc(50%+90px)] top-1/4 h-5 w-5 translate-x-0 -translate-y-1/2 rounded-full bg-violet-500 shadow-[0_0_15px_rgba(167,139,250,0.5)] z-10 cursor-pointer"
                        variants={skillNodeVariant}
                        initial="hidden"
                        animate={controls}
                        whileHover="hover"
                        onHoverStart={() => setActiveNode("Concepts")}
                        onHoverEnd={() => setActiveNode(null)}
                    >
                        <AnimatePresence>
                            {activeNode === "Concepts" && (
                                <motion.div
                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-900/80 shadow-lg"
                                    variants={labelVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <span className="whitespace-nowrap text-xs font-medium text-white/90">Concepts</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        className="absolute left-[calc(50%+90px)] top-1/2 h-5 w-5 translate-x-0 -translate-y-1/2 rounded-full bg-indigo-500 shadow-[0_0_15px_rgba(167,139,250,0.5)] z-10 cursor-pointer"
                        variants={skillNodeVariant}
                        initial="hidden"
                        animate={controls}
                        whileHover="hover"
                        onHoverStart={() => setActiveNode("Practice")}
                        onHoverEnd={() => setActiveNode(null)}
                    >
                        <AnimatePresence>
                            {activeNode === "Practice" && (
                                <motion.div
                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-900/80 shadow-lg"
                                    variants={labelVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <span className="whitespace-nowrap text-xs font-medium text-white/90">Practice</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        className="absolute left-[calc(50%+90px)] top-3/4 h-5 w-5 translate-x-0 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_15px_rgba(167,139,250,0.5)] z-10 cursor-pointer"
                        variants={skillNodeVariant}
                        initial="hidden"
                        animate={controls}
                        whileHover="hover"
                        onHoverStart={() => setActiveNode("Application")}
                        onHoverEnd={() => setActiveNode(null)}
                    >
                        <AnimatePresence>
                            {activeNode === "Application" && (
                                <motion.div
                                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-neutral-900/80 shadow-lg"
                                    variants={labelVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                >
                                    <span className="whitespace-nowrap text-xs font-medium text-white/90">Application</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
