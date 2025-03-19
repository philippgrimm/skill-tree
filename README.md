# Skill Tree Learning Platform

A modern, interactive learning platform that helps users track their progress through a hierarchical skill tree structure. Built with Laravel, React, and TypeScript.

## 🌟 Features

### Core Functionality

- **Interactive Skill Tree**: Visual representation of learning paths with branches and leaves

    - Hierarchical visualization of skills and their relationships
    - Dynamic rendering of nested structures
    - Smooth animations for expanding/collapsing branches
    - Visual connectors showing relationships between nodes

- **Progress Tracking**: Track completion of individual skills and overall progress

    - Real-time progress updates
    - Persistent storage for both authenticated and guest users
    - Progress synchronization across devices for authenticated users
    - Local storage fallback for guest users

- **Hierarchical Structure**: Organize skills in a tree-like structure with branches and sub-branches

    - Unlimited nesting depth
    - Parent-child relationships between branches
    - Leaf nodes representing individual skills
    - Automatic layout calculation

- **Ordered Learning**: Enforce sequential learning by requiring prerequisite skills to be completed first

    - Order-based completion validation
    - Visual indicators for available/unavailable skills
    - Clear feedback when prerequisites are missing
    - Automatic prerequisite checking

- **Progress Persistence**: Save progress both for authenticated and non-authenticated users

    - Database storage for authenticated users
    - LocalStorage for guest users
    - Automatic progress merging on login
    - Conflict resolution for concurrent updates

- **Visual Feedback**: Celebrate achievements with confetti animations

    - Triggered on branch completion
    - Customizable animation parameters
    - Performance-optimized rendering
    - Accessibility considerations

- **Responsive Design**: Works seamlessly across all device sizes

    - Mobile-first approach
    - Adaptive layout for different screen sizes
    - Touch-friendly interactions
    - Optimized performance on mobile devices

- **Dark Mode Support**: Built-in dark mode for comfortable viewing in any lighting condition
    - System preference detection
    - Manual toggle option
    - Persistent theme selection
    - Smooth theme transitions

### User Experience

- **Branch Expansion**: Collapsible branches for better navigation

    - Smooth animation transitions
    - State persistence across sessions
    - Keyboard navigation support
    - Visual indicators for expandable content

- **Progress Indicators**: Visual progress bars and completion status

    - Real-time progress updates
    - Percentage-based completion tracking
    - Color-coded status indicators
    - Animated progress bars

- **Interactive Nodes**: Clickable leaves to mark completion

    - Visual feedback on interaction
    - Disabled state for unavailable skills
    - Tooltip information
    - Keyboard accessibility

- **Visual Hierarchy**: Clear distinction between branches and leaves

    - Consistent visual styling
    - Clear parent-child relationships
    - Indentation-based hierarchy
    - Visual connectors between nodes

- **Progress Reset**: Option to reset progress when needed
    - Confirmation dialog
    - Selective reset options
    - Backup before reset
    - Undo capability

## 🛠️ Technical Stack

### Frontend

- **React**: For building the user interface

    - Functional components with hooks
    - Context API for state management
    - Custom hooks for reusable logic
    - Performance optimizations

- **TypeScript**: For type-safe code

    - Strict type checking
    - Interface definitions
    - Type guards
    - Generic components

- **Tailwind CSS**: For styling

    - Utility-first approach
    - Custom theme configuration
    - Responsive design utilities
    - Dark mode support

- **Inertia.js**: For seamless integration with Laravel

    - Server-side rendering
    - Client-side navigation
    - Form handling
    - Error handling

- **React Confetti**: For celebration animations
    - Customizable particle effects
    - Performance optimization
    - Accessibility considerations
    - Mobile-friendly rendering

### Backend

- **Laravel**: PHP framework for the backend

    - MVC architecture
    - RESTful API design
    - Middleware implementation
    - Service layer pattern

- **MySQL/PostgreSQL**: Database for storing user progress and skill tree structure

    - Optimized schema design
    - Indexed queries
    - Transaction handling
    - Data integrity constraints

- **API Endpoints**: RESTful endpoints for progress management
    - JWT authentication
    - Rate limiting
    - Input validation
    - Error handling

## 📁 Project Structure

```
skill-tree/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── API/
│   │   │   │   └── LeafProgressController.php
│   │   │   └── LeafProgressController.php
│   │   └── Middleware/
│   │       ├── Authenticate.php
│   │       └── VerifyCsrfToken.php
│   ├── Models/
│   │   ├── Branch.php
│   │   ├── Leaf.php
│   │   └── UserLeafProgress.php
│   └── Services/
│       └── ProgressService.php
├── resources/
│   └── js/
│       ├── pages/
│       │   └── Tree.tsx
│       ├── components/
│   │   ├── Branch.tsx
│   │   └── Leaf.tsx
│   ├── hooks/
│   │   ├── useProgress.ts
│   │   └── useTreeState.ts
│   └── types/
│       └── index.ts
├── database/
│   ├── migrations/
│   │   ├── create_branches_table.php
│   │   ├── create_leaves_table.php
│   │   └── create_user_leaf_progress_table.php
│   └── seeders/
│       └── SkillTreeSeeder.php
└── tests/
    ├── Feature/
    │   └── LeafProgressTest.php
    └── Unit/
        └── ProgressServiceTest.php
```

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/skill-tree.git
cd skill-tree
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install Node.js dependencies:

```bash
npm install
```

4. Set up environment variables:

```bash
cp .env.example .env
php artisan key:generate
```

5. Configure your database in `.env`:

```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=skill_tree
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. Run migrations:

```bash
php artisan migrate
```

7. Seed the database with sample data:

```bash
php artisan db:seed
```

8. Start the development server:

```bash
php artisan serve
npm run dev
```

## 📚 API Documentation

### Endpoints

#### GET /api/leaf-progress

Returns the current user's progress on all leaves.

**Headers:**

```
Authorization: Bearer {token}
Accept: application/json
```

**Response:**

```json
{
    "completed_leaves": [1, 2, 3],
    "total_leaves": 10,
    "completion_percentage": 30
}
```

#### POST /api/leaf-progress/{leaf}/toggle

Toggles the completion status of a leaf.

**Headers:**

```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

**Request Body:**

```json
{
    "validate_order": true,
    "timestamp": "2024-03-20T12:00:00Z"
}
```

**Response:**

```json
{
    "leaf_id": 1,
    "completed": true,
    "completed_leaves": [1, 2, 3],
    "branch_progress": {
        "branch_id": 1,
        "completion_percentage": 75
    }
}
```

#### POST /api/leaf-progress/reset

Resets all progress for the current user.

**Headers:**

```
Authorization: Bearer {token}
Accept: application/json
```

**Response:**

```json
{
    "message": "Progress reset successfully",
    "completed_leaves": [],
    "reset_timestamp": "2024-03-20T12:00:00Z"
}
```

## 🎨 UI Components

### Tree Component

The main component that renders the skill tree structure.

**Props:**

```typescript
interface TreeProps {
    branches: Branch[];
    completedLeaves: number[];
    isAuthenticated: boolean;
    onProgressUpdate?: (progress: number) => void;
    onBranchComplete?: (branchId: number) => void;
}
```

**State Management:**

```typescript
interface TreeState {
    expandedBranches: Record<number, boolean>;
    completed: Record<number, boolean>;
    showConfetti: boolean;
    confettiKey: number;
}
```

### Branch Component

Renders a branch in the skill tree.

**Props:**

```typescript
interface BranchProps {
    branch: Branch;
    isExpanded: boolean;
    progress: number;
    onToggle: (branchId: number) => void;
    onLeafComplete: (leafId: number) => void;
}
```

**Features:**

- Expandable/collapsible with smooth animations
- Progress tracking with visual indicators
- Visual connectors showing relationships
- Child branches support with proper indentation
- Keyboard navigation support
- Accessibility attributes

### Leaf Component

Renders a leaf (skill) in the tree.

**Props:**

```typescript
interface LeafProps {
    leaf: Leaf;
    isCompleted: boolean;
    canBeCompleted: boolean;
    onToggle: (leafId: number) => void;
}
```

**Features:**

- Completion status with visual feedback
- Prerequisite validation
- Interactive completion toggle
- Tooltip information
- Keyboard accessibility
- Loading states
- Error handling

## 🔒 Security

### Authentication & Authorization

- JWT-based authentication
- Role-based access control
- Session management
- Token refresh mechanism

### Data Protection

- CSRF protection enabled
- XSS prevention
- SQL injection protection
- Input sanitization

### API Security

- Rate limiting
- Request validation
- Error handling
- Logging and monitoring

### Progress Tracking Security

- User-specific data isolation
- Data integrity checks
- Concurrent update handling
- Backup mechanisms

## 🧪 Testing

### Unit Tests

```bash
php artisan test --filter=Unit
```

### Feature Tests

```bash
php artisan test --filter=Feature
```

### Frontend Tests

```bash
npm run test
```

### Test Coverage

```bash
php artisan test --coverage
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PSR-12 coding standards
- Write tests for new features
- Update documentation
- Keep commits atomic and descriptive
- Use conventional commits

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Laravel](https://laravel.com/) - The PHP framework for web artisans
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Inertia.js](https://inertiajs.com/) - Build classic server-driven web apps
- [React Confetti](https://www.npmjs.com/package/react-confetti) - Create confetti effects in React

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.
