import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import GitTree from '@/components/GitTree';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-black text-white">
                {/* Header */}
                <header className="fixed top-0 z-50 w-full border-b border-neutral-800 bg-black/80 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                        <div className="flex items-center gap-8">
                            <div className="text-xl font-semibold text-white">Skill Tree</div>
                            <nav className="hidden lg:flex">
                                <ul className="flex gap-6 text-sm font-medium text-neutral-400">
                                    <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                                    <li><a href="#method" className="transition-colors hover:text-white">Method</a></li>
                                    <li><a href="#about" className="transition-colors hover:text-white">About</a></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('tree')}
                                    className="group relative rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                                >
                                    <span className="relative z-10">Go to Skill Tree</span>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-neutral-400 transition-colors hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="group relative rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                                    >
                                        <span className="relative z-10">Sign up</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero section */}
                <section className="mt-16 flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-12 lg:px-8 lg:pb-32 lg:pt-20">
                    <div className="relative mx-auto max-w-7xl">
                        {/* Background elements */}
                        <div className="absolute -top-[40rem] left-1/2 -z-10 -translate-x-1/2">
                            <div className="h-[80rem] w-[80rem] rounded-full bg-gradient-to-b from-violet-500/20 to-transparent opacity-20 blur-3xl"></div>
                        </div>
                        <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
                            <div className="absolute -right-1/4 top-1/4 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"></div>
                            <div className="absolute -left-1/4 bottom-1/4 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-6 inline-flex rounded-full border border-violet-800/50 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
                                Learning reimagined
                            </div>
                            <h1 className="max-w-4xl bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl">
                                Your complete platform for skill acquisition
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg text-neutral-400">
                                Track your learning journey, set goals, and visualize your progress with our intuitive skill tree system.
                            </p>
                            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href={route('register')}
                                    className="relative overflow-hidden rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-all hover:bg-neutral-200"
                                >
                                    Get started for free
                                </Link>
                                <a
                                    href="#features"
                                    className="rounded-full border border-neutral-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-neutral-700 hover:bg-neutral-900"
                                >
                                    Learn more
                                </a>
                            </div>

                            {/* Interactive visual element */}
                            <div className='mt-4 w-full'>
                                <GitTree />
                            </div>


                            {/* Logos */}
                            <div className="mt-16 grid grid-cols-3 gap-8 opacity-70 lg:grid-cols-3">
                                <div className="flex items-center justify-center text-lg font-semibold tracking-tight text-neutral-400">runway</div>
                                <div className="flex items-center justify-center text-lg font-semibold tracking-tight text-neutral-400">leonardo.ai</div>
                                <div className="flex items-center justify-center text-lg font-semibold tracking-tight text-neutral-400">zapier</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features section */}
                <section id="features" className="border-t border-neutral-800 px-6 py-20 lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                                Powerful tools for every step of your learning journey
                            </h2>
                            <p className="mt-4 text-lg text-neutral-400">
                                Our skill tree system is designed to make learning structured, measurable, and enjoyable.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 md:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="group rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 transition-all hover:border-neutral-700 hover:bg-neutral-900">
                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Visual Progress</h3>
                                <p className="mt-2 text-neutral-400">
                                    See your skills as an interactive tree, making it easy to track progress and identify growth areas.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="group rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 transition-all hover:border-neutral-700 hover:bg-neutral-900">
                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V15M19 11V5C19 3.89543 18.1046 3 17 3H15M9 7H15M9 11H11M9 15H9.01M13 15L15.5 12.5M17.5 14.5L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Structured Learning</h3>
                                <p className="mt-2 text-neutral-400">
                                    Follow clear learning paths with prerequisites and skill dependencies mapped out.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="group rounded-xl border border-neutral-800 bg-neutral-900/50 p-8 transition-all hover:border-neutral-700 hover:bg-neutral-900">
                                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 10L20 10M20 10L18 8M20 10L18 12M8 14H3M3 14L5 12M3 14L5 16M12 3V21M12 3L9 5M12 3L15 5M12 21L9 19M12 21L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white">Goal Setting</h3>
                                <p className="mt-2 text-neutral-400">
                                    Set measurable learning goals and track your progress toward achieving them.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Method section */}
                <section id="method" className="relative border-t border-neutral-800 px-6 py-20 lg:px-8 lg:py-32">
                    <div className="relative mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                                    The science behind skill acquisition
                                </h2>
                                <p className="mt-4 text-lg text-neutral-400">
                                    Our approach is based on proven learning methodologies that break complex skills into manageable components.
                                </p>

                                <div className="mt-8 space-y-6">
                                    <div className="group flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20">
                                            <span>1</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Break down complex skills</h3>
                                            <p className="mt-1 text-neutral-400">
                                                Identify the core components that make up your target skill.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                                            <span>2</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Set progressive milestones</h3>
                                            <p className="mt-1 text-neutral-400">
                                                Create a pathway of progressive skill development with clear milestones.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group flex items-start gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                                            <span>3</span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Measure and adapt</h3>
                                            <p className="mt-1 text-neutral-400">
                                                Track your progress and adjust your learning approach as needed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-square rounded-xl border border-neutral-800 bg-neutral-900/50 p-8">
                                {/* Code example */}
                                <div className="flex h-full flex-col">
                                    <div className="mb-4 flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-neutral-700"></div>
                                        <div className="h-3 w-3 rounded-full bg-neutral-700"></div>
                                        <div className="h-3 w-3 rounded-full bg-neutral-700"></div>
                                    </div>
                                    <div className="flex-1 rounded-lg bg-black/60 p-4 font-mono text-sm">
                                        <p className="text-neutral-500">// Example skill acquisition flow</p>
                                        <p className="text-blue-400">function <span className="text-violet-400">trackProgress</span>(skill) {'{'}</p>
                                        <p className="ml-4 text-neutral-300">const <span className="text-indigo-400">subSkills</span> = breakDown(skill);</p>
                                        <p className="ml-4 text-neutral-300">const <span className="text-indigo-400">milestones</span> = setMilestones(subSkills);</p>
                                        <p className="ml-4 text-neutral-300">return measureProgress(milestones);</p>
                                        <p className="text-blue-400">{'}'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA section */}
                <section className="relative border-t border-neutral-800 px-6 py-20 lg:px-8 lg:py-32">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-500/20 to-indigo-500/10 blur-3xl"></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white lg:text-4xl">
                                Ready to master new skills?
                            </h2>
                            <p className="mt-4 text-lg text-neutral-400">
                                Start your learning journey today with our structured skill tree approach.
                            </p>
                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-neutral-200"
                                >
                                    Start deploying
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="rounded-full border border-neutral-800 px-6 py-3 text-sm font-medium text-white transition-colors hover:border-neutral-700 hover:bg-neutral-900"
                                >
                                    Get a demo
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer id="about" className="border-t border-neutral-800 px-6 py-12 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 lg:grid-cols-4">
                            <div>
                                <div className="text-lg font-bold text-white">Skill Tree</div>
                                <p className="mt-2 text-sm text-neutral-500">
                                    Your personal learning management system.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">Product</h3>
                                <ul className="mt-3 space-y-2 text-sm text-neutral-500">
                                    <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                                    <li><a href="#method" className="transition-colors hover:text-white">Method</a></li>
                                    <li><a href="#" className="transition-colors hover:text-white">Pricing</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">Company</h3>
                                <ul className="mt-3 space-y-2 text-sm text-neutral-500">
                                    <li><a href="#" className="transition-colors hover:text-white">About</a></li>
                                    <li><a href="#" className="transition-colors hover:text-white">Blog</a></li>
                                    <li><a href="#" className="transition-colors hover:text-white">Careers</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-semibold text-white">Resources</h3>
                                <ul className="mt-3 space-y-2 text-sm text-neutral-500">
                                    <li><a href="#" className="transition-colors hover:text-white">Documentation</a></li>
                                    <li><a href="#" className="transition-colors hover:text-white">Help Center</a></li>
                                    <li><a href="#" className="transition-colors hover:text-white">Privacy</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col items-center justify-between border-t border-neutral-800 pt-8 sm:flex-row">
                            <p className="text-xs text-neutral-500">
                                © {new Date().getFullYear()} Skill Tree. All rights reserved.
                            </p>
                            <div className="mt-4 flex space-x-6 sm:mt-0">
                                <a href="#" className="text-neutral-500 transition-colors hover:text-white">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-neutral-500 transition-colors hover:text-white">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
            <style jsx global>{`
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
                .git-branch:nth-child(13) { animation-delay: 1.2s; }
                .git-branch:nth-child(14) { animation-delay: 1.6s; }
                .git-branch:nth-child(15) { animation-delay: 1.4s; }
                .git-branch:nth-child(16) { animation-delay: 1.8s; }

                /* Cross branches */
                .git-branch:nth-child(17) { animation-delay: 1.8s; }
                .git-branch:nth-child(18) { animation-delay: 2.2s; }
                .git-branch:nth-child(19) { animation-delay: 2.0s; }
                .git-branch:nth-child(20) { animation-delay: 2.4s; }

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
        </>
    );
}
