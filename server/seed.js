import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from './models/Article.js';
import User from './models/User.js';
import Tag from './models/Tag.js';
import Comment from './models/Comment.js';

dotenv.config({ path: '../.env' });

const users = [
  { username: 'sarahdev', name: 'Sarah Chen', email: 'sarah@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=sarah', bio: 'Full-stack developer passionate about React and Node.js. Building the web one component at a time.', github: 'sarahdev', twitter: 'sarahdev', website: 'https://sarahchen.dev' },
  { username: 'alexrivers', name: 'Alex Rivers', email: 'alex@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=alex', bio: 'Backend engineer specializing in distributed systems and APIs. Coffee enthusiast.', github: 'alexrivers', twitter: 'alexrivers' },
  { username: 'csswizard', name: 'Michael Foster', email: 'michael@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=michael', bio: 'CSS wizard making the web beautiful one style at a time. Design systems advocate.', github: 'csswizard', website: 'https://csswizard.dev' },
  { username: 'vimlover', name: 'David Kim', email: 'david@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=david', bio: 'Neovim enthusiast and terminal enthusiast. I spend more time configuring my editor than actually coding.', github: 'vimlover', twitter: 'vimlover' },
  { username: 'backendbob', name: 'Robert Taylor', email: 'robert@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=robert', bio: 'Database architect and backend specialist. Making data flow since 2015.', github: 'backendbob', website: 'https://roberttaylor.dev' },
  { username: 'jsmaster', name: 'Emily Watson', email: 'emily@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=emily', bio: 'JavaScript enthusiast. I love building interactive web experiences.', github: 'jsmaster', twitter: 'jsmaster' },
  { username: 'devopsdana', name: 'Dana Martinez', email: 'dana@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=dana', bio: 'DevOps engineer automating all the things. Kubernetes and Docker expert.', github: 'devopsdana', twitter: 'devopsdana', website: 'https://devopsdana.dev' },
  { username: 'latebloomer', name: 'Jennifer Adams', email: 'jennifer@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=jennifer', bio: 'Career changer from marketing to software development. Documenting my journey.', github: 'latebloomer', twitter: 'latebloomer' },
  { username: 'apidesigner', name: 'Chris Johnson', email: 'chris@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=chris', bio: 'API designer and REST/GraphQL enthusiast. Building interfaces that developers love.', github: 'apidesigner', website: 'https://apidesigner.dev' },
  { username: 'realtimerick', name: 'Richard Brown', email: 'richard@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=richard', bio: 'Full-stack developer with a passion for TypeScript. Type safety is my religion.', github: 'realtimerick', twitter: 'realtimerick' },
  { username: 'stylesara', name: 'Sara Wilson', email: 'sara@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=sara', bio: 'Frontend developer obsessed with clean UI and smooth animations.', github: 'stylesara', twitter: 'stylesara' },
  { username: 'testertom', name: 'Thomas Lee', email: 'thomas@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=thomas', bio: 'QA engineer and test automation specialist. If it isn\'t tested, it\'s broken.', github: 'testertom', twitter: 'testertom' },
  { username: 'rustacean', name: 'Patricia Moore', email: 'patricia@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=patricia', bio: 'Learning Rust after 10 years of JavaScript. Memory safety is worth the struggle.', github: 'rustacean', twitter: 'rustacean' },
  { username: 'cleancoder', name: 'James Garcia', email: 'james@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=james', bio: 'Clean code advocate and refactoring expert. Making legacy code great again.', github: 'cleancoder', website: 'https://cleancoder.dev' },
  { username: 'deploypro', name: 'Amanda White', email: 'amanda@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=amanda', bio: 'Platform engineer specializing in cloud deployments. Vercel and AWS expert.', github: 'deploypro', twitter: 'deploypro' },
  { username: 'jsninja', name: 'Kevin Harris', email: 'kevin@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=kevin', bio: 'JavaScript ninja pushing the boundaries of what\'s possible in the browser.', github: 'jsninja', twitter: 'jsninja' },
  { username: 'cliconstructor', name: 'Lisa Anderson', email: 'lisa@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=lisa', bio: 'Building CLI tools that developers actually want to use. Commander.js enthusiast.', github: 'cliconstructor', twitter: 'cliconstructor' },
  { username: 'statemaster', name: 'Mark Thompson', email: 'mark@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=mark', bio: 'State management expert. Redux, Zustand, Jotai - I\'ve used them all.', github: 'statemaster', twitter: 'statemaster' },
  { username: 'automationann', name: 'Anna Robinson', email: 'anna@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=anna', bio: 'Automation enthusiast. If I have to do it twice, I\'ll script it.', github: 'automationann', twitter: 'automationann' },
  { username: 'ossfan', name: 'Brian Clark', email: 'brian@example.com', password: 'password123', avatar: 'https://i.pravatar.cc/150?u=brian', bio: 'Open source contributor and maintainer. Giving back to the community.', github: 'ossfan', twitter: 'ossfan', website: 'https://ossfan.dev' },
];

const articleContents = [
  {
    title: 'How I Built a Full-Stack App in 48 Hours',
    description: 'A breakdown of my experience building a React + Node.js application during a hackathon, including lessons learned and code snippets.',
    slug: 'how-i-built-fullstack-app-48-hours',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    content: '# How I Built a Full-Stack App in 48 Hours\n\nIt was 6 PM on a Friday when my team and I decided to participate in our first hackathon.\n\n## The Idea\n\nWe wanted to create a real-time collaborative whiteboard.\n\n## Tech Stack\n\n- React with TypeScript\n- Node.js with Express\n- Socket.io for real-time\n- MongoDB\n\n## Code Example\n\n```javascript\nconst io = new Server(3000, { cors: { origin: "*" } });\nio.on("connection", (socket) => { socket.join("room"); });\n```\n\n## Lessons Learned\n\n1. Start simple\n2. Sleep is important\n3. Presentation matters',
    tags: ['react', 'nodejs', 'javascript', 'hackathon', 'mongodb', 'express'],
    readingTime: 8,
    likes: 24,
    commentsCount: 15,
    views: 1200
  },
  {
    title: 'Understanding React Server Components',
    description: 'A deep dive into React Server Components, how they differ from traditional SSR.',
    slug: 'understanding-react-server-components',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    content: '# Understanding React Server Components\n\nReact Server Components represent a paradigm shift.\n\n## What Are Server Components?\n\nServer Components render exclusively on the server.\n\n```jsx\nasync function BlogPost({ id }) {\n  const post = await db.posts.find(id);\n  return <article><h1>{post.title}</h1></article>;\n}\n```\n\n## Key Differences\n\n- Server Components: Never re-render on client\n- Client Components: Can use hooks and browser APIs',
    tags: ['react', 'nextjs', 'javascript', 'server-components', 'tutorial', 'webdev'],
    readingTime: 15,
    likes: 45,
    commentsCount: 32,
    views: 2500
  },
  {
    title: 'The Complete Guide to Modern CSS Layouts',
    description: 'Master CSS Grid, Flexbox, and subgrid with practical examples.',
    slug: 'complete-guide-modern-css-layouts',
    coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop',
    content: '# The Complete Guide to Modern CSS Layouts\n\n## Flexbox\n\nFlexbox excels at one-dimensional layouts.\n\n```css\n.navbar { display: flex; justify-content: space-between; }\n```\n\n## CSS Grid\n\nGrid is perfect for two-dimensional layouts.\n\n```css\n.dashboard { display: grid; grid-template-columns: 250px 1fr; }\n```\n\n## When to Use What\n\n- Flexbox: Navigation, centering\n- Grid: Page layouts, card grids',
    tags: ['css', 'cssgrid', 'flexbox', 'webdesign', 'frontend', 'tutorial', 'responsive'],
    readingTime: 20,
    likes: 67,
    commentsCount: 28,
    views: 3100
  },
  {
    title: 'Why I Switched from VS Code to Neovim',
    description: "After 5 years of VS Code, I made the switch to Neovim. Here's what I learned.",
    slug: 'switched-from-vscode-to-neovim',
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop',
    content: '# Why I Switched from VS Code to Neovim\n\nAfter half a decade of VS Code, I decided to try modal editing.\n\n## My Setup\n\n```lua\nrequire("plugins")\nrequire("lspconfig").tsserver.setup({})\n```\n\n## The Learning Curve\n\nThe first week was painful. But after a month, something clicked.\n\n## Was It Worth It?\n\nPros: Speed, keyboard-centric workflow\nCons: Initial time investment',
    tags: ['vim', 'neovim', 'productivity', 'tools', 'programming', 'workflow'],
    readingTime: 12,
    likes: 89,
    commentsCount: 156,
    views: 5200
  },
  {
    title: 'Building a REST API with TypeScript and Express',
    description: 'Learn how to build a production-ready REST API with TypeScript and Express.',
    slug: 'building-rest-api-typescript-express',
    content: '# Building a REST API with TypeScript and Express\n\n## Project Setup\n\n```bash\nnpm install express typescript zod\n```\n\n## Define Types\n\n```typescript\ninterface User {\n  id: string;\n  name: string;\n  email: string;\n}\n```\n\n## Validation with Zod\n\n```typescript\nconst createUserSchema = z.object({\n  name: z.string().min(2),\n  email: z.string().email(),\n});\n```',
    tags: ['typescript', 'nodejs', 'express', 'rest-api', 'api', 'backend', 'zod'],
    readingTime: 18,
    likes: 38,
    commentsCount: 22,
    views: 1800
  },
  {
    title: '10 JavaScript Array Methods You Should Master',
    description: 'Level up your JavaScript skills with these essential array methods.',
    slug: '10-javascript-array-methods',
    content: '# 10 JavaScript Array Methods\n\n## 1. map() - Transform\n\n```javascript\nconst doubled = [1, 2, 3].map(n => n * 2);\n```\n\n## 2. filter() - Keep What You Need\n\n```javascript\nconst evens = [1, 2, 3].filter(n => n % 2 === 0);\n```\n\n## 3. reduce() - Aggregate\n\n```javascript\nconst sum = [1, 2, 3].reduce((acc, n) => acc + n, 0);\n```\n\n## 4. find() - Get First Match\n\n## 5. some() / every() - Check Conditions',
    tags: ['javascript', 'es6', 'arrays', 'programming', 'tutorial', 'beginners', 'functional-programming'],
    readingTime: 10,
    likes: 112,
    commentsCount: 45,
    views: 4500
  },
  {
    title: 'Docker for Frontend Developers',
    description: 'A practical introduction to Docker for frontend developers.',
    slug: 'docker-for-frontend-developers',
    content: '# Docker for Frontend Developers\n\n## What is Docker?\n\nDocker packages your application with everything it needs.\n\n## A Simple Dockerfile\n\n```dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]\n```\n\n## Docker Compose\n\n```yaml\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n```\n\n## Why Frontend Devs Should Care\n\n1. Consistency across environments\n2. Easier deployments',
    tags: ['docker', 'docker-compose', 'react', 'devops', 'deployment', 'containers', 'frontend'],
    readingTime: 14,
    likes: 56,
    commentsCount: 19,
    views: 2100
  },
  {
    title: 'My Journey Learning to Code at 35',
    description: "It's never too late to start coding. Here's my story.",
    slug: 'learning-to-code-at-35',
    content: '# My Journey Learning to Code at 35\n\nAt 35, I left my job in marketing to become a software engineer.\n\n## The Beginning\n\nI spent 10 years in marketing but always felt something was missing.\n\n## The Struggle\n\n- Imposter syndrome was real\n- Learning JS at 35 was harder than expected\n- Money was tight for 2 years\n\n## What Worked\n\n1. FreeCodeCamp\n2. Building projects\n3. Finding community\n\n## Where I Am Now\n\nTwo years later, I am a mid-level developer making more than ever.',
    tags: ['career', 'beginners', 'motivation', 'life', 'career-change', 'self-taught'],
    readingTime: 7,
    likes: 234,
    commentsCount: 89,
    views: 8900
  },
  {
    title: 'Understanding GraphQL in 2024',
    description: 'GraphQL vs REST, when to use GraphQL, and how to implement it.',
    slug: 'understanding-graphql-2024',
    content: '# Understanding GraphQL in 2024\n\n## GraphQL vs REST\n\n**REST:** Multiple endpoints, over-fetching common\n**GraphQL:** Single endpoint, ask for exactly what you need\n\n## Basic Schema\n\n```graphql\ntype User {\n  id: ID!\n  name: String!\n  posts: [Post!]!\n}\n\ntype Query {\n  user(id: ID!): User\n}\n```\n\n## When to Use GraphQL\n\n- Complex data relationships\n- Mobile apps\n- Rapid frontend iteration',
    tags: ['graphql', 'api', 'nodejs', 'backend', 'apollo', 'rest-api'],
    readingTime: 16,
    likes: 41,
    commentsCount: 17,
    views: 1650
  },
  {
    title: 'Building Real-Time Features with WebSockets',
    description: 'Learn how to implement real-time chat and notifications.',
    slug: 'building-realtime-features-websockets',
    content: '# Building Real-Time Features with WebSockets\n\n## Why WebSockets?\n\n- Real-time updates without polling\n- Lower latency\n- Persistent connections\n\n## Server Implementation\n\n```javascript\nconst io = new Server(3000, { cors: { origin: "*" } });\nio.on("connection", (socket) => {\n  socket.on("join-room", (roomId) => socket.join(roomId));\n  socket.on("send-message", (msg) => io.to(msg.roomId).emit(msg));\n});\n```\n\n## Client Implementation\n\n```javascript\nconst socket = io("http://localhost:3000");\nsocket.emit("join-room", "room-123");\n```',
    tags: ['nodejs', 'websockets', 'javascript', 'realtime', 'socketio', 'fullstack'],
    readingTime: 22,
    likes: 73,
    commentsCount: 34,
    views: 2800
  },
  {
    title: 'CSS Variables: The Complete Guide',
    description: 'Everything you need to know about CSS custom properties.',
    slug: 'css-variables-complete-guide',
    content: '# CSS Variables: The Complete Guide\n\n## Basic Usage\n\n```css\n:root {\n  --primary-color: #3498db;\n  --spacing: 1rem;\n}\n\n.button {\n  background: var(--primary-color);\n  padding: var(--spacing);\n}\n```\n\n## Theming\n\n```css\n[data-theme="dark"] {\n  --bg-color: #1a1a1a;\n}\n```\n\n## JavaScript Access\n\n```javascript\nconst primary = getComputedStyle(document.documentElement)\n  .getPropertyValue("--primary-color");\n```',
    tags: ['css', 'css-variables', 'theming', 'webdesign', 'frontend', 'dark-mode'],
    readingTime: 11,
    likes: 58,
    commentsCount: 21,
    views: 1950
  },
  {
    title: 'Testing React Components: A Practical Guide',
    description: 'Learn testing best practices with Jest and React Testing Library.',
    slug: 'testing-react-components-guide',
    content: '# Testing React Components\n\n## Setup\n\n```bash\nnpm install -D jest @testing-library/react\n```\n\n## Basic Component Test\n\n```jsx\ntest("Login form submits", async () => {\n  render(<Login />);\n  await userEvent.type(screen.getByLabelText(/email/), "test@test.com");\n  await userEvent.click(screen.getByRole("button", { name: /submit/i }));\n  expect(screen.getByText(/success/)).toBeInTheDocument();\n});\n```\n\n## Best Practices\n\n1. Test behavior, not implementation\n2. Use semantic queries\n3. Test error states',
    tags: ['react', 'testing', 'javascript', 'tutorial', 'jest', 'react-testing-library', 'tdd'],
    readingTime: 19,
    likes: 47,
    commentsCount: 26,
    views: 2200
  },
  {
    title: 'Getting Started with Rust for JavaScript Developers',
    description: 'A friendly introduction to Rust for JS developers.',
    slug: 'rust-for-javascript-developers',
    content: '# Getting Started with Rust for JavaScript Developers\n\n## Why Rust?\n\n- Memory safety without garbage collection\n- Incredible performance\n\n## The Ownership Model\n\n```rust\nfn main() {\n    let s1 = String::from("hello");\n    let s2 = s1; // s1 is now invalid!\n    println!("{}", s2); // Works\n}\n```\n\n## Borrowing\n\n```rust\nfn calculate_length(s: &String) -> usize {\n    s.len()\n}\n```\n\nStart small and be patient!',
    tags: ['rust', 'javascript', 'programming', 'beginners', 'systems-programming', 'webassembly'],
    readingTime: 25,
    likes: 92,
    commentsCount: 43,
    views: 3600
  },
  {
    title: 'The Art of Writing Clean Code',
    description: 'Principles and patterns for writing maintainable, readable code.',
    slug: 'art-of-writing-clean-code',
    content: '# The Art of Writing Clean Code\n\n## Naming Matters\n\n**Bad:**\n```javascript\nconst d = new Date();\nconst x = users.filter(u => u.a > 18);\n```\n\n**Good:**\n```javascript\nconst currentDate = new Date();\nconst adultUsers = users.filter(user => user.age > 18);\n```\n\n## Functions Should Do One Thing\n\nBad: processUser() does validation, saving, emailing, logging\nGood: saveUser(), notifyUserCreated()\n\n## Comments\n\nUse comments for WHY, not WHAT.\n\nThe Boy Scout Rule: Always leave code better than you found it.',
    tags: ['programming', 'clean-code', 'refactoring', 'career', 'bestpractices', 'code-quality'],
    readingTime: 13,
    likes: 156,
    commentsCount: 67,
    views: 5800
  },
  {
    title: 'Deploying to Vercel: Beyond the Basics',
    description: 'Advanced Vercel deployment techniques including edge functions.',
    slug: 'deploying-to-vercel-advanced',
    content: '# Deploying to Vercel: Beyond the Basics\n\n## Edge Functions\n\n```javascript\nexport const runtime = "edge";\nexport default function handler(request) {\n  return new Response("Hello from the edge!");\n}\n```\n\n## Middleware\n\n```javascript\nexport function middleware(request) {\n  const token = request.cookies.get("token");\n  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {\n    return NextResponse.redirect("/login");\n  }\n  return NextResponse.next();\n}\n```\n\n## Preview Deployments\n\nEvery PR gets its own preview URL!',
    tags: ['vercel', 'deployment', 'nextjs', 'devops', 'serverless', 'edge-functions'],
    readingTime: 9,
    likes: 39,
    commentsCount: 14,
    views: 1400
  },
  {
    title: 'Understanding JavaScript Closures with Examples',
    description: "Master JavaScript's most powerful concepts through examples.",
    slug: 'javascript-closures-explained',
    content: '# Understanding JavaScript Closures\n\n## What is a Closure?\n\nA closure gives access to an outer function scope.\n\n```javascript\nfunction createCounter() {\n  let count = 0;\n  return function() {\n    count++;\n    return count;\n  };\n}\n\nconst counter = createCounter();\ncounter(); // 1\ncounter(); // 2\n```\n\n## Practical Use: Private Variables\n\n```javascript\nfunction createUser(name) {\n  let _name = name;\n  return {\n    getName() { return _name; },\n    setName(newName) { _name = newName; }\n  };\n}\n```\n\nClosures are everywhere in JavaScript!',
    tags: ['javascript', 'closures', 'programming', 'tutorial', 'beginners', 'functional-programming'],
    readingTime: 8,
    likes: 78,
    commentsCount: 31,
    views: 2900
  },
  {
    title: 'Building a CLI Tool with Node.js',
    description: 'Create your own command-line tools with Node.js and Commander.js.',
    slug: 'building-cli-tool-nodejs',
    content: '# Building a CLI Tool with Node.js\n\n## Project Setup\n\n```bash\nmkdir my-cli\ncd my-cli\nnpm init -y\nnpm install commander chalk\n```\n\n## Basic Structure\n\n```javascript\n#!/usr/bin/env node\nimport { Command } from "commander";\nimport chalk from "chalk";\n\nconst program = new Command();\nprogram.name("mycli").description("A sample CLI").version("1.0.0");\n\nprogram.command("greet").argument("<name>").action((name) => {\n  console.log(chalk.green("Hello, " + name + "!"));\n});\n\nprogram.parse();\n```\n\n## Add to Package.json\n\n```json\n"bin": { "mycli": "./index.js" }\n```',
    tags: ['nodejs', 'cli', 'javascript', 'tools', 'npm', 'package.json'],
    readingTime: 14,
    likes: 54,
    commentsCount: 18,
    views: 1900
  },
  {
    title: 'State Management in 2024: What to Choose?',
    description: 'Compare Redux, Zustand, Jotai, and Context API.',
    slug: 'state-management-2024-comparison',
    content: '# State Management in 2024\n\n## Context API (Built-in)\n\nBest for simple global state.\n\n```javascript\nconst ThemeContext = createContext();\n<ThemeContext.Provider value="dark"><MyApp /></ThemeContext.Provider>\n```\n\n## Redux Toolkit\n\nBest for large applications.\n\n```javascript\nconst store = configureStore({\n  reducer: { counter: counterSlice.reducer }\n});\n```\n\n## Zustand\n\nBest for simplicity with power.\n\n```javascript\nconst useStore = create((set) => ({\n  count: 0,\n  increment: () => set((s) => ({ count: s.count + 1 })),\n}));\n```',
    tags: ['react', 'redux', 'zustand', 'state-management', 'javascript', 'context-api', 'jotai'],
    readingTime: 17,
    likes: 123,
    commentsCount: 52,
    views: 4200
  },
  {
    title: 'Introduction to GitHub Actions for CI/CD',
    description: 'Automate your workflow with GitHub Actions.',
    slug: 'github-actions-ci-cd-tutorial',
    content: '# Introduction to GitHub Actions for CI/CD\n\n## Basic Workflow\n\n```yaml\nname: CI\non: [push, pull_request]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - name: Setup Node.js\n        uses: actions/setup-node@v4\n        with:\n          node-version: "20"\n      - run: npm ci\n      - run: npm test\n```\n\n## Caching\n\n```yaml\n- name: Cache node modules\n  uses: actions/cache@v3\n  with:\n    path: node_modules\n    key: ${{ runner.os }}-npm-${{ hashFiles("**/package-lock.json") }}\n```',
    tags: ['github', 'devops', 'ci-cd', 'automation', 'github-actions', 'workflow'],
    readingTime: 16,
    likes: 67,
    commentsCount: 24,
    views: 2400
  },
  {
    title: 'Making Your First Open Source Contribution',
    description: 'A beginner-friendly guide to contributing to open source.',
    slug: 'first-open-source-contribution',
    content: '# Making Your First Open Source Contribution\n\n## Finding Projects\n\n1. Search GitHub for "good first issue"\n2. Your favorite libraries need love\n3. Documentation is a great starting point\n\n## The Contribution Process\n\n1. Fork the repo\n2. Clone your fork\n3. Create a branch\n4. Make changes\n5. Test locally\n6. Push to your fork\n7. Open a PR\n\n## Writing Your First PR\n\n- Description: What you fixed\n- Changes: What you modified\n- Testing: How you verified it\n\nYour first PR is the hardest. After that, it gets easier!',
    tags: ['opensource', 'beginners', 'github', 'community', 'git', 'pull-request'],
    readingTime: 10,
    likes: 189,
    commentsCount: 78,
    views: 6500
  }
];

const tags = [
  { name: 'react', slug: 'react' },
  { name: 'javascript', slug: 'javascript' },
  { name: 'nodejs', slug: 'nodejs' },
  { name: 'typescript', slug: 'typescript' },
  { name: 'css', slug: 'css' },
  { name: 'webdev', slug: 'webdev' },
  { name: 'beginners', slug: 'beginners' },
  { name: 'programming', slug: 'programming' },
  { name: 'tutorial', slug: 'tutorial' },
  { name: 'devops', slug: 'devops' },
  { name: 'career', slug: 'career' },
  { name: 'frontend', slug: 'frontend' },
  { name: 'backend', slug: 'backend' },
  { name: 'api', slug: 'api' },
  { name: 'docker', slug: 'docker' },
  { name: 'github', slug: 'github' },
  { name: 'productivity', slug: 'productivity' },
  { name: 'tools', slug: 'tools' },
  { name: 'testing', slug: 'testing' },
  { name: 'graphql', slug: 'graphql' },
  { name: 'rust', slug: 'rust' },
  { name: 'vim', slug: 'vim' },
  { name: 'opensource', slug: 'opensource' },
  { name: 'motivation', slug: 'motivation' },
  { name: 'deployment', slug: 'deployment' },
  { name: 'nextjs', slug: 'nextjs' },
  { name: 'vercel', slug: 'vercel' },
  { name: 'redux', slug: 'redux' },
  { name: 'cli', slug: 'cli' },
  { name: 'websockets', slug: 'websockets' },
  { name: 'realtime', slug: 'realtime' },
  { name: 'theming', slug: 'theming' },
  { name: 'refactoring', slug: 'refactoring' },
  { name: 'bestpractices', slug: 'bestpractices' },
  { name: 'hackathon', slug: 'hackathon' },
  { name: 'express', slug: 'express' },
  { name: 'webdesign', slug: 'webdesign' },
  { name: 'automation', slug: 'automation' },
  { name: 'ci-cd', slug: 'ci-cd' },
  { name: 'community', slug: 'community' },
  { name: 'life', slug: 'life' },
  { name: 'future', slug: 'future' },
  { name: 'trends', slug: 'trends' },
  { name: 'state-management', slug: 'state-management' },
  { name: 'mongodb', slug: 'mongodb' },
  { name: 'server-components', slug: 'server-components' },
  { name: 'cssgrid', slug: 'cssgrid' },
  { name: 'flexbox', slug: 'flexbox' },
  { name: 'responsive', slug: 'responsive' },
  { name: 'neovim', slug: 'neovim' },
  { name: 'workflow', slug: 'workflow' },
  { name: 'rest-api', slug: 'rest-api' },
  { name: 'zod', slug: 'zod' },
  { name: 'es6', slug: 'es6' },
  { name: 'arrays', slug: 'arrays' },
  { name: 'functional-programming', slug: 'functional-programming' },
  { name: 'docker-compose', slug: 'docker-compose' },
  { name: 'containers', slug: 'containers' },
  { name: 'career-change', slug: 'career-change' },
  { name: 'self-taught', slug: 'self-taught' },
  { name: 'apollo', slug: 'apollo' },
  { name: 'socketio', slug: 'socketio' },
  { name: 'fullstack', slug: 'fullstack' },
  { name: 'css-variables', slug: 'css-variables' },
  { name: 'dark-mode', slug: 'dark-mode' },
  { name: 'jest', slug: 'jest' },
  { name: 'react-testing-library', slug: 'react-testing-library' },
  { name: 'tdd', slug: 'tdd' },
  { name: 'systems-programming', slug: 'systems-programming' },
  { name: 'webassembly', slug: 'webassembly' },
  { name: 'clean-code', slug: 'clean-code' },
  { name: 'code-quality', slug: 'code-quality' },
  { name: 'serverless', slug: 'serverless' },
  { name: 'edge-functions', slug: 'edge-functions' },
  { name: 'closures', slug: 'closures' },
  { name: 'npm', slug: 'npm' },
  { name: 'zustand', slug: 'zustand' },
  { name: 'context-api', slug: 'context-api' },
  { name: 'jotai', slug: 'jotai' },
  { name: 'github-actions', slug: 'github-actions' },
  { name: 'git', slug: 'git' },
  { name: 'pull-request', slug: 'pull-request' }
];

const commentsData = [
  // Comments for first article
  {
    content: 'Great article! I participated in a hackathon last month and completely relate to the experience. The key takeaway for me was starting simple - we tried to build too much initially.',
    articleSlug: 'how-i-built-fullstack-app-48-hours',
    authorIndex: 1
  },
  {
    content: 'Thanks for sharing! What tools did you use for the real-time collaboration? We\'re planning something similar.',
    articleSlug: 'how-i-built-fullstack-app-48-hours',
    authorIndex: 2
  },
  {
    content: 'Socket.io was a game changer for us too! The API is so intuitive.',
    articleSlug: 'how-i-built-fullstack-app-48-hours',
    authorIndex: 3
  },
  {
    content: 'Sleep is definitely important. Our team skipped it and by Sunday we were making silly mistakes.',
    articleSlug: 'how-i-built-fullstack-app-48-hours',
    authorIndex: 4
  },
  // Comments for second article
  {
    content: 'This is exactly what I needed! Server Components were confusing me. The explanation about never re-rendering really helped.',
    articleSlug: 'understanding-react-server-components',
    authorIndex: 5
  },
  {
    content: 'How do Server Components handle client-side interactivity? Do you need to mix with Client Components?',
    articleSlug: 'understanding-react-server-components',
    authorIndex: 6
  },
  {
    content: 'Great question! You use "use client" directive for interactive components. I wrote a follow-up article about mixing them effectively.',
    articleSlug: 'understanding-react-server-components',
    authorIndex: 0
  },
  {
    content: 'Can you use Server Components with Next.js 13 or do you need the latest version?',
    articleSlug: 'understanding-react-server-components',
    authorIndex: 7
  },
  {
    content: 'They were introduced in Next.js 13 with the App Router. Make sure you\'re using the latest version for the best experience.',
    articleSlug: 'understanding-react-server-components',
    authorIndex: 0
  },
  // Comments for third article
  {
    content: 'Finally a clear explanation of CSS Grid! The examples are so practical.',
    articleSlug: 'complete-guide-modern-css-layouts',
    authorIndex: 8
  },
  {
    content: 'I\'ve been using flexbox for everything. When should I really choose Grid over Flexbox?',
    articleSlug: 'complete-guide-modern-css-layouts',
    authorIndex: 9
  },
  {
    content: 'Grid shines when you need true two-dimensional control. Flexbox is better for one-dimensional rows or columns. But they work great together!',
    articleSlug: 'complete-guide-modern-css-layouts',
    authorIndex: 2
  },
  {
    content: 'Subgrid is amazing! Finally we can align nested elements to the parent grid.',
    articleSlug: 'complete-guide-modern-css-layouts',
    authorIndex: 10
  },
  // Comments for fourth article
  {
    content: 'As a Vim user, this resonates so much! The initial learning curve is steep but worth it.',
    articleSlug: 'switched-from-vscode-to-neovim',
    authorIndex: 3
  },
  {
    content: 'How long did it take you to become productive? I\'ve tried twice but gave up after a week.',
    articleSlug: 'switched-from-vscode-to-neovim',
    authorIndex: 11
  },
  {
    content: 'About 2-3 weeks for basic editing, a month for fluency. Check out vimtutor and this repo: awesome-vim',
    articleSlug: 'switched-from-vscode-to-neovim',
    authorIndex: 3
  },
  {
    content: 'The lazy.nvim plugin manager makes setup so much easier now. Highly recommend!',
    articleSlug: 'switched-from-vscode-to-neovim',
    authorIndex: 12
  },
  {
    content: 'I use AstroNvim and it\'s fantastic out of the box. Pre-configured with good defaults.',
    articleSlug: 'switched-from-vscode-to-neovim',
    authorIndex: 13
  },
  // Comments for fifth article
  {
    content: 'TypeScript with Express is amazing. The type safety catches so many bugs early!',
    articleSlug: 'building-rest-api-typescript-express',
    authorIndex: 9
  },
  {
    content: 'What validation library do you recommend? Zod or Yup?',
    articleSlug: 'building-rest-api-typescript-express',
    authorIndex: 14
  },
  {
    content: 'Zod! It has first-class TypeScript support and the schema validation is incredible.',
    articleSlug: 'building-rest-api-typescript-express',
    authorIndex: 0
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devto-clone');
    console.log('Connected to MongoDB');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Article.deleteMany({});
    await Tag.deleteMany({});
    await Comment.deleteMany({});

    console.log('Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log('Created ' + createdUsers.length + ' users');

    console.log('Creating tags...');
    const createdTags = await Tag.insertMany(tags);
    console.log('Created ' + createdTags.length + ' tags');

    console.log('Creating articles...');
    const articlesWithAuthors = articleContents.map((article, index) => ({
      title: article.title,
      description: article.description,
      slug: article.slug,
      coverImage: article.coverImage || '',
      content: article.content,
      author: createdUsers[index % createdUsers.length]._id,
      tags: article.tags,
      publishedAt: new Date(Date.now() - (index * 86400000)),
      readingTime: article.readingTime,
      likes: Array.from({ length: article.likes }),
      commentsCount: article.commentsCount,
      views: article.views,
      published: true
    }));

    await Article.insertMany(articlesWithAuthors);
    console.log('Created ' + articlesWithAuthors.length + ' articles');

    // Create comments
    console.log('Creating comments...');
    const createdArticles = await Article.find({}).lean();
    const articleMap = {};
    createdArticles.forEach(article => {
      articleMap[article.slug] = article;
    });

    const createdComments = [];
    
    // First pass: create all top-level comments
    for (const commentData of commentsData) {
      const article = articleMap[commentData.articleSlug];
      if (!article) continue;

      const comment = await Comment.create({
        content: commentData.content,
        author: createdUsers[commentData.authorIndex]._id,
        article: article._id,
        parentComment: null,
        likes: [],
        replies: []
      });
      createdComments.push(comment);
    }
    console.log('Created ' + createdComments.length + ' comments');

    // Second pass: create nested replies for specific comments
    console.log('Creating nested replies...');
    
    // Reply to first article's first comment
    const reply1 = await Comment.create({
      content: 'So true! We made the same mistake. Next time we\'ll plan better.',
      author: createdUsers[5]._id,
      article: articleMap['how-i-built-fullstack-app-48-hours']._id,
      parentComment: createdComments[0]._id,
      likes: [createdUsers[1]._id],
      replies: []
    });
    createdComments[0].replies.push(reply1._id);
    await createdComments[0].save();

    // Reply to second article's first comment
    const reply2 = await Comment.create({
      content: 'Yes! Think of Server Components as the data fetching layer and Client Components for interactivity.',
      author: createdUsers[8]._id,
      article: articleMap['understanding-react-server-components']._id,
      parentComment: createdComments[4]._id,
      likes: [createdUsers[5]._id, createdUsers[6]._id],
      replies: []
    });
    createdComments[4].replies.push(reply2._id);
    await createdComments[4].save();

    // Reply to third article's second comment
    const reply3 = await Comment.create({
      content: 'I use both! Grid for overall page structure, Flexbox for components inside.',
      author: createdUsers[2]._id,
      article: articleMap['complete-guide-modern-css-layouts']._id,
      parentComment: createdComments[9]._id,
      likes: [createdUsers[8]._id],
      replies: []
    });
    createdComments[9].replies.push(reply3._id);
    await createdComments[9].save();

    // Reply to fourth article's second comment
    const reply4 = await Comment.create({
      content: 'Stick with it! It took me about a month to feel comfortable. The muscle memory will develop naturally.',
      author: createdUsers[3]._id,
      article: articleMap['switched-from-vscode-to-neovim']._id,
      parentComment: createdComments[14]._id,
      likes: [createdUsers[11]._id, createdUsers[12]._id],
      replies: []
    });
    createdComments[14].replies.push(reply4._id);
    await createdComments[14].save();

    // Nested reply to fourth article
    const reply5 = await Comment.create({
      content: 'Thanks for the encouragement! I\'ll try again with vimtutor.',
      author: createdUsers[11]._id,
      article: articleMap['switched-from-vscode-to-neovim']._id,
      parentComment: createdComments[15]._id,
      likes: [],
      replies: []
    });
    createdComments[15].replies.push(reply5._id);
    await createdComments[15].save();

    // Level 3 reply - reply to reply4
    const reply6 = await Comment.create({
      content: 'Pro tip: Start with the basics and gradually add plugins. Don\'t try to configure everything at once!',
      author: createdUsers[14]._id,
      article: articleMap['switched-from-vscode-to-neovim']._id,
      parentComment: reply4._id,
      likes: [createdUsers[3]._id],
      replies: []
    });
    reply4.replies.push(reply6._id);
    await reply4.save();

    // Level 3 reply - another nested reply
    const reply7 = await Comment.create({
      content: 'Great advice! I wish I read this before starting my Neovim journey.',
      author: createdUsers[7]._id,
      article: articleMap['switched-from-vscode-to-neovim']._id,
      parentComment: reply4._id,
      likes: [],
      replies: []
    });
    reply4.replies.push(reply7._id);
    await reply4.save();

    console.log('Created nested replies');

    // Update article commentsCount to reflect actual comment count (including replies)
    console.log('Updating article comments count...');
    const articles = await Article.find({}).lean();
    for (const article of articles) {
      // Count all comments for this article (top-level + all replies)
      const allComments = await Comment.find({ article: article._id }).lean();
      const totalComments = allComments.length;
      
      await Article.findByIdAndUpdate(article._id, { commentsCount: totalComments });
    }
    console.log('Updated article comments count');

    // Calculate and update articlesCount for each tag
    console.log('Updating tag articles count...');
    const tagCounts = {};
    articlesWithAuthors.forEach(article => {
      article.tags.forEach(tagName => {
        tagCounts[tagName] = (tagCounts[tagName] || 0) + 1;
      });
    });
    for (const [tagName, count] of Object.entries(tagCounts)) {
      await Tag.findOneAndUpdate(
        { name: tagName },
        { articlesCount: count }
      );
    }
    console.log('Updated tag articles count');

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
