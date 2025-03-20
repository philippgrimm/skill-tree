import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-[#FCFCFC] text-[#1b1b18] dark:bg-[#0a0a0a]">
                {/* Header */}
                <header className="fixed top-0 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-black/80">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
                        <div className="flex items-center gap-8">
                            <div className="text-xl font-semibold">Skill Tree</div>
                            <nav className="hidden lg:flex">
                                <ul className="flex gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                                    <li><a href="#features" className="hover:text-black dark:hover:text-white">Features</a></li>
                                    <li><a href="#method" className="hover:text-black dark:hover:text-white">Method</a></li>
                                    <li><a href="#about" className="hover:text-black dark:hover:text-white">About</a></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={route('tree')}
                                    className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                >
                                    Go to Skill Tree
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-medium text-neutral-600 hover:text-black dark:text-neutral-300 dark:hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero section */}
                <section className="mt-24 px-6 pb-20 pt-12 lg:mt-28 lg:px-8 lg:pb-32 lg:pt-20">
                    <div className="mx-auto max-w-7xl">
                        <div className="flex flex-col items-center text-center">
                            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
                                Master your skills with a structured approach
                            </h1>
                            <p className="mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300">
                                Track your learning journey, set goals, and visualize your progress with our intuitive skill tree system.
                            </p>
                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                >
                                    Get started for free
                                </Link>
                                <a
                                    href="#features"
                                    className="rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:hover:border-neutral-700"
                                >
                                    Learn more
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features section */}
                <section id="features" className="border-t border-neutral-200 bg-neutral-50 px-6 py-20 dark:border-neutral-800 dark:bg-neutral-900 lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                                Tools for every step of your journey
                            </h2>
                            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
                                Our skill tree system is designed to make learning structured, measurable, and enjoyable.
                            </p>
                        </div>

                        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* Feature 1 */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-black">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium">Visual Progress</h3>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                                    See your skills as an interactive tree, making it easy to track progress and identify growth areas.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-black">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V15M19 11V5C19 3.89543 18.1046 3 17 3H15M9 7H15M9 11H11M9 15H9.01M13 15L15.5 12.5M17.5 14.5L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium">Structured Learning</h3>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                                    Follow clear learning paths with prerequisites and skill dependencies mapped out.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-black">
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 10L20 10M20 10L18 8M20 10L18 12M8 14H3M3 14L5 12M3 14L5 16M12 3V21M12 3L9 5M12 3L15 5M12 21L9 19M12 21L15 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium">Goal Setting</h3>
                                <p className="mt-2 text-neutral-600 dark:text-neutral-300">
                                    Set measurable learning goals and track your progress toward achieving them.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Method section */}
                <section id="method" className="px-6 py-20 lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                            <div>
                                <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                                    The science behind skill acquisition
                                </h2>
                                <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
                                    Our approach is based on proven learning methodologies that break complex skills into manageable components.
                                </p>

                                <div className="mt-8 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white">
                                            <span>1</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Break down complex skills</h3>
                                            <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                                                Identify the core components that make up your target skill.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white">
                                            <span>2</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Set progressive milestones</h3>
                                            <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                                                Create a pathway of progressive skill development with clear milestones.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-black dark:bg-neutral-800 dark:text-white">
                                            <span>3</span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium">Measure and adapt</h3>
                                            <p className="mt-1 text-neutral-600 dark:text-neutral-300">
                                                Track your progress and adjust your learning approach as needed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="aspect-square rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                                {/* Placeholder for an illustration or image */}
                                <div className="flex h-full items-center justify-center text-neutral-400">
                                    [Skill methodology illustration]
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA section */}
                <section className="border-t border-neutral-200 bg-neutral-50 px-6 py-20 dark:border-neutral-800 dark:bg-neutral-900 lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-7xl">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                                Ready to master new skills?
                            </h2>
                            <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-300">
                                Start your learning journey today with our structured skill tree approach.
                            </p>
                            <div className="mt-8">
                                <Link
                                    href={route('register')}
                                    className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                                >
                                    Get started for free
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer id="about" className="border-t border-neutral-200 px-6 py-12 dark:border-neutral-800 lg:px-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 lg:grid-cols-3">
                            <div>
                                <div className="text-lg font-semibold">Skill Tree</div>
                                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                    Your personal learning management system.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-3">
                                <div>
                                    <h3 className="font-medium">Product</h3>
                                    <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                                        <li><a href="#features" className="hover:text-black dark:hover:text-white">Features</a></li>
                                        <li><a href="#method" className="hover:text-black dark:hover:text-white">Method</a></li>
                                        <li><a href="#" className="hover:text-black dark:hover:text-white">Pricing</a></li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium">Company</h3>
                                    <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                                        <li><a href="#" className="hover:text-black dark:hover:text-white">About</a></li>
                                        <li><a href="#" className="hover:text-black dark:hover:text-white">Blog</a></li>
                                        <li><a href="#" className="hover:text-black dark:hover:text-white">Careers</a></li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-medium">Resources</h3>
                                    <ul className="mt-3 space-y-2 text-sm text-neutral-500 dark:text-neutral-400">
                                        <li><a href="#" className="hover:text-black dark:hover:text-white">Documentation</a></li>
                                        <li><a href="#" className="hover:text-black dark:hover:text-white">Help Center</a></li>
                                        <li><a href="#" className="hover:text-black dark:hover:text-white">Privacy</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col items-center justify-between border-t border-neutral-200 pt-8 dark:border-neutral-800 sm:flex-row">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                © {new Date().getFullYear()} Skill Tree. All rights reserved.
                            </p>
                            <div className="mt-4 flex space-x-6 sm:mt-0">
                                <a href="#" className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white">
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
        </>
    );
}
