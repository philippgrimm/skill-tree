import React from 'react';

export default function GitTree() {
    return (
        <div className="relative mt-20 h-96 w-full max-w-4xl">
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-80 w-80 rounded-full bg-gradient-to-b from-violet-500/30 to-indigo-500/30 blur-xl"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="git-tree-container relative h-80 w-full max-w-[640px]">
                    {/* Main branch */}
                    <div className="git-branch branch-grow absolute left-[50%] top-0 h-80 w-1.5 -translate-x-1/2 bg-neutral-700"></div>

                    {/* Main nodes */}
                    <div className="git-node main-node absolute left-[50%] top-0 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-glow" data-label="Start"></div>
                    <div className="git-node main-node absolute left-[50%] top-[100%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 shadow-glow" data-label="Mastery"></div>

                    {/* Connection points on main branch - these are the intersection points */}
                    <div className="git-node connector-node absolute left-[50%] top-[25%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 shadow-glow" data-label="Fundamentals"></div>
                    <div className="git-node connector-node absolute left-[50%] top-[50%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 shadow-glow" data-label="Intermediate"></div>
                    <div className="git-node connector-node absolute left-[50%] top-[75%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 shadow-glow" data-label="Advanced"></div>

                    {/* Connecting branches - left side */}
                    <div className="git-branch branch-grow absolute left-[50%] top-[25%] h-1.5 w-40 -translate-x-full origin-right bg-neutral-700"></div>
                    <div className="git-branch branch-grow absolute left-[50%] top-[50%] h-1.5 w-40 -translate-x-full origin-right bg-neutral-700"></div>
                    <div className="git-branch branch-grow absolute left-[50%] top-[75%] h-1.5 w-40 -translate-x-full origin-right bg-neutral-700"></div>

                    {/* Connecting branches - right side */}
                    <div className="git-branch branch-grow absolute left-[50%] top-[25%] h-1.5 w-40 translate-x-0 origin-left bg-neutral-700"></div>
                    <div className="git-branch branch-grow absolute left-[50%] top-[50%] h-1.5 w-40 translate-x-0 origin-left bg-neutral-700"></div>
                    <div className="git-branch branch-grow absolute left-[50%] top-[75%] h-1.5 w-40 translate-x-0 origin-left bg-neutral-700"></div>

                    {/* End points of horizontal branches */}
                    <div className="git-node node-appear absolute left-[10%] top-[25%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 shadow-glow" data-label="Theory"></div>
                    <div className="git-node node-appear absolute left-[10%] top-[50%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 shadow-glow" data-label="Analysis"></div>
                    <div className="git-node node-appear absolute left-[10%] top-[75%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 shadow-glow" data-label="Innovation"></div>

                    <div className="git-node node-appear absolute left-[90%] top-[25%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 shadow-glow" data-label="Concepts"></div>
                    <div className="git-node node-appear absolute left-[90%] top-[50%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 shadow-glow" data-label="Practice"></div>
                    <div className="git-node node-appear absolute left-[90%] top-[75%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 shadow-glow" data-label="Application"></div>

                    {/* Vertical connecting branches - left side */}
                    <div className="git-branch branch-grow-v absolute left-[10%] top-[25%] h-25 w-1.5 -translate-x-1/2 origin-top bg-neutral-700"></div>
                    <div className="git-branch branch-grow-v absolute left-[10%] top-[50%] h-25 w-1.5 -translate-x-1/2 origin-top bg-neutral-700"></div>

                    {/* Vertical connecting branches - right side */}
                    <div className="git-branch branch-grow-v absolute left-[90%] top-[25%] h-25 w-1.5 -translate-x-1/2 origin-top bg-neutral-700"></div>
                    <div className="git-branch branch-grow-v absolute left-[90%] top-[50%] h-25 w-1.5 -translate-x-1/2 origin-top bg-neutral-700"></div>

                    {/* Cross-branch connectors - left side */}
                    <div className="git-branch branch-grow absolute left-[10%] top-[37.5%] h-1.5 w-20 translate-x-0 origin-left -rotate-45 bg-neutral-700"></div>
                    <div className="git-branch branch-grow absolute left-[10%] top-[62.5%] h-1.5 w-20 translate-x-0 origin-left -rotate-45 bg-neutral-700"></div>

                    {/* Cross-branch connectors - right side */}
                    <div className="git-branch branch-grow absolute left-[90%] top-[37.5%] h-1.5 w-20 -translate-x-full origin-right rotate-45 bg-neutral-700"></div>
                    <div className="git-branch branch-grow absolute left-[90%] top-[62.5%] h-1.5 w-20 -translate-x-full origin-right rotate-45 bg-neutral-700"></div>

                    {/* Cross-branch connection nodes */}
                    <div className="git-node node-appear absolute left-[25%] top-[37.5%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400 shadow-glow" data-label="Research"></div>
                    <div className="git-node node-appear absolute left-[25%] top-[62.5%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400 shadow-glow" data-label="Evaluate"></div>

                    <div className="git-node node-appear absolute left-[75%] top-[37.5%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-400 shadow-glow" data-label="Tools"></div>
                    <div className="git-node node-appear absolute left-[75%] top-[62.5%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400 shadow-glow" data-label="Refine"></div>
                </div>
            </div>
            <style jsx>{`
                .git-node {
                    animation: glow 4s infinite;
                    animation-delay: calc(var(--index, 0) * 0.3s);
                    position: relative;
                    z-index: 10;
                }

                .connector-node {
                    animation: pulse-glow 3s infinite;
                    z-index: 15;
                }

                .git-node::after {
                    content: attr(data-label);
                    position: absolute;
                    white-space: nowrap;
                    font-size: 11px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.8);
                    bottom: -16px;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .git-node:hover::after {
                    opacity: 1;
                }

                .main-node {
                    z-index: 20;
                    animation: pulse-glow 4s infinite;
                }

                .node-appear {
                    animation: appear-glow 4s forwards;
                    opacity: 0;
                }

                .branch-grow {
                    animation: branch-grow 2s ease-out forwards;
                    transform-origin: left;
                    transform: scaleX(0);
                    z-index: 2;
                }

                .branch-grow-v {
                    animation: branch-grow-v 2s ease-out forwards;
                    transform-origin: top;
                    transform: scaleY(0);
                    z-index: 2;
                }

                /* Node animation timing */
                .git-node:nth-child(2) { --index: 0; }
                .git-node:nth-child(3) { --index: 1; }
                .git-node:nth-child(4) { --index: 2; }
                .git-node:nth-child(5) { --index: 3; }
                .git-node:nth-child(6) { --index: 4; }

                .git-node:nth-child(13) { --index: 5; }
                .git-node:nth-child(14) { --index: 6; }
                .git-node:nth-child(15) { --index: 7; }
                .git-node:nth-child(16) { --index: 8; }
                .git-node:nth-child(17) { --index: 9; }
                .git-node:nth-child(18) { --index: 10; }

                .git-node:nth-child(23) { --index: 11; }
                .git-node:nth-child(24) { --index: 12; }
                .git-node:nth-child(25) { --index: 13; }
                .git-node:nth-child(26) { --index: 14; }

                /* Branch animation timing */
                .git-branch:nth-child(1) { animation-delay: 0.1s; }

                /* Horizontal branches */
                .git-branch:nth-child(7) { animation-delay: 0.6s; }
                .git-branch:nth-child(8) { animation-delay: 1.0s; }
                .git-branch:nth-child(9) { animation-delay: 1.4s; }
                .git-branch:nth-child(10) { animation-delay: 0.8s; }
                .git-branch:nth-child(11) { animation-delay: 1.2s; }
                .git-branch:nth-child(12) { animation-delay: 1.6s; }

                /* Vertical branches */
                .git-branch:nth-child(19) { animation-delay: 1.2s; }
                .git-branch:nth-child(20) { animation-delay: 1.6s; }
                .git-branch:nth-child(21) { animation-delay: 1.4s; }
                .git-branch:nth-child(22) { animation-delay: 1.8s; }

                /* Cross branches */
                .git-branch:nth-child(23) { animation-delay: 1.8s; }
                .git-branch:nth-child(24) { animation-delay: 2.2s; }
                .git-branch:nth-child(25) { animation-delay: 2.0s; }
                .git-branch:nth-child(26) { animation-delay: 2.4s; }

                .shadow-glow {
                    box-shadow: 0 0 15px rgba(167, 139, 250, 0.5);
                }

                @keyframes glow {
                    0% {
                        opacity: 0.7;
                        box-shadow: 0 0 5px rgba(167, 139, 250, 0.3);
                    }
                    50% {
                        opacity: 1;
                        box-shadow: 0 0 15px rgba(167, 139, 250, 0.8);
                    }
                    100% {
                        opacity: 0.7;
                        box-shadow: 0 0 5px rgba(167, 139, 250, 0.3);
                    }
                }

                @keyframes pulse-glow {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.8;
                        box-shadow: 0 0 5px rgba(167, 139, 250, 0.5);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2);
                        opacity: 1;
                        box-shadow: 0 0 20px rgba(167, 139, 250, 1);
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 0.8;
                        box-shadow: 0 0 5px rgba(167, 139, 250, 0.5);
                    }
                }

                @keyframes appear-glow {
                    0% {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0);
                    }
                    60% {
                        opacity: 0;
                    }
                    80% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1.3);
                    }
                    100% {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }

                @keyframes branch-grow {
                    0% {
                        transform: scaleX(0);
                        background: linear-gradient(90deg, rgba(139, 92, 246, 0.8) 0%, rgba(79, 70, 229, 0.4) 100%);
                    }
                    100% {
                        transform: scaleX(1);
                        background: linear-gradient(90deg, rgba(79, 70, 229, 0.3) 0%, rgba(139, 92, 246, 0.4) 100%);
                    }
                }

                @keyframes branch-grow-v {
                    0% {
                        transform: scaleY(0);
                        background: linear-gradient(180deg, rgba(139, 92, 246, 0.8) 0%, rgba(79, 70, 229, 0.4) 100%);
                    }
                    100% {
                        transform: scaleY(1);
                        background: linear-gradient(180deg, rgba(79, 70, 229, 0.3) 0%, rgba(139, 92, 246, 0.4) 100%);
                    }
                }

                .git-branch {
                    position: absolute;
                    background: linear-gradient(90deg, rgba(79, 70, 229, 0.3) 0%, rgba(139, 92, 246, 0.4) 100%);
                }
            `}</style>
        </div>
    );
}
