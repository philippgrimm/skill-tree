<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Leaf;
use Illuminate\Database\Seeder;

class SkillTreeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * The 'order' field is only relevant for leaves and represents the required sequence
     * in which they must be learned or completed. Lower order values must be completed
     * before higher ones can be accessed. Branches are ordered alphabetically.
     */
    public function run(): void
    {
        // Clear existing skill tree data only (not users)
        Leaf::query()->delete();
        Branch::query()->delete();

        // ==============================
        // Main Skill Categories - SIMPLIFIED STRUCTURE
        // ==============================

        // Root branches (main skill categories) - Reduced to 4 main categories
        // Order is set to 0 as it's no longer used for branches
        $technicalFundamentals = $this->createBranch('Technical Fundamentals', 'Core concepts every software engineer needs', null);
        $frontend = $this->createBranch('Frontend', 'User interface development skills', null);
        $backend = $this->createBranch('Backend', 'Server-side development skills', null);
        $professional = $this->createBranch('Professional Skills', 'Career and soft skills', null);

        // ==============================
        // 1. Technical Fundamentals Path - SIMPLIFIED
        // ==============================

        $programming = $this->createBranch('Programming Basics', 'Fundamental programming concepts', $technicalFundamentals->id);
        $this->createLeaf('Programming Logic', 'Understanding control flow, loops, and conditionals', $programming->id, 1);
        $this->createLeaf('Data Structures', 'Arrays, lists, maps, and other structures', $programming->id, 2);
        $this->createLeaf('Object-Oriented Programming', 'Classes, inheritance, and object composition', $programming->id, 3);

        $versionControl = $this->createBranch('Version Control', 'Tracking and managing code changes', $technicalFundamentals->id);
        $this->createLeaf('Git Basics', 'Init, add, commit, push, and pull', $versionControl->id, 1);
        $this->createLeaf('Branching & Merging', 'Creating and managing branches', $versionControl->id, 2);
        $this->createLeaf('Pull Requests', 'Submitting and reviewing code changes', $versionControl->id, 3);

        // ==============================
        // 2. Frontend Path - SIMPLIFIED
        // ==============================

        $htmlCss = $this->createBranch('HTML & CSS', 'Web page structure and styling', $frontend->id);
        $this->createLeaf('HTML Structure', 'Document structure and semantic elements', $htmlCss->id, 1);
        $this->createLeaf('CSS Basics', 'Selectors, properties, and basic styling', $htmlCss->id, 2);
        $this->createLeaf('Responsive Design', 'Mobile-friendly and adaptive layouts', $htmlCss->id, 3);

        $jsBasics = $this->createBranch('JavaScript', 'Browser scripting and modern JS', $frontend->id);
        $this->createLeaf('JavaScript Syntax', 'Variables, functions, and basic concepts', $jsBasics->id, 1);
        $this->createLeaf('DOM Manipulation', 'Interacting with page elements', $jsBasics->id, 2);
        $this->createLeaf('Fetch API', 'Making HTTP requests from the browser', $jsBasics->id, 3);
        $this->createLeaf('Modern JavaScript', 'ES6+, async/await, and modules', $jsBasics->id, 4);

        $uiFrameworks = $this->createBranch('Frontend Frameworks', 'Modern UI development', $frontend->id);
        $this->createLeaf('Component Architecture', 'Building with reusable components', $uiFrameworks->id, 1);
        $this->createLeaf('State Management', 'Managing application data flow', $uiFrameworks->id, 2);
        $this->createLeaf('Frontend Routing', 'Navigation in single-page applications', $uiFrameworks->id, 3);

        // ==============================
        // 3. Backend Path - SIMPLIFIED
        // ==============================

        $backendLang = $this->createBranch('Backend Fundamentals', 'Server-side programming essentials', $backend->id);
        $this->createLeaf('Server-side Languages', 'PHP, Node.js, Python, etc.', $backendLang->id, 1);
        $this->createLeaf('Request Lifecycle', 'How server requests are processed', $backendLang->id, 2);
        $this->createLeaf('Middleware', 'Request/response processing pipelines', $backendLang->id, 3);

        $apis = $this->createBranch('API Development', 'Building web services', $backend->id);
        $this->createLeaf('RESTful APIs', 'Designing REST endpoints and resources', $apis->id, 1);
        $this->createLeaf('API Authentication', 'Securing APIs with tokens and JWT', $apis->id, 2);
        $this->createLeaf('API Testing', 'Validating API functionality', $apis->id, 3);

        $databases = $this->createBranch('Databases', 'Data storage and retrieval', $backend->id);
        $this->createLeaf('Database Design', 'Modeling data relationships', $databases->id, 1);
        $this->createLeaf('SQL Fundamentals', 'Querying relational databases', $databases->id, 2);
        $this->createLeaf('ORM Concepts', 'Object-Relational Mapping techniques', $databases->id, 3);

        // ==============================
        // 4. Professional Skills - SIMPLIFIED
        // ==============================

        $teamwork = $this->createBranch('Collaboration Skills', 'Working effectively with others', $professional->id);
        $this->createLeaf('Code Reviews', 'Giving and receiving constructive feedback', $teamwork->id, 1);
        $this->createLeaf('Technical Communication', 'Clearly explaining technical concepts', $teamwork->id, 2);
        $this->createLeaf('Documentation', 'Creating effective documentation', $teamwork->id, 3);

        $career = $this->createBranch('Career Development', 'Professional growth', $professional->id);
        $this->createLeaf('Portfolio Building', 'Showcasing your skills effectively', $career->id, 1);
        $this->createLeaf('Technical Interviews', 'Preparing for coding assessments', $career->id, 2);
        $this->createLeaf('Continuous Learning', 'Staying current with technology', $career->id, 3);
    }

    /**
     * Create a branch record
     *
     * @param  string  $name  Branch name
     * @param  string  $description  Branch description
     * @param  int|null  $branchId  Parent branch ID (null for root branches)
     */
    private function createBranch(string $name, string $description, ?int $branchId): Branch
    {
        return Branch::create([
            'name' => $name,
            'description' => $description,
            'branch_id' => $branchId,
        ]);
    }

    /**
     * Create a leaf record
     *
     * @param  string  $name  Leaf name
     * @param  string  $content  Leaf content/description
     * @param  int  $branchId  Branch this leaf belongs to
     * @param  int  $order  Learning sequence order (must be completed in numerical order)
     */
    private function createLeaf(string $name, string $content, int $branchId, int $order): Leaf
    {
        return Leaf::create([
            'name' => $name,
            'content' => $content,
            'branch_id' => $branchId,
            'order' => $order,
        ]);
    }
}
