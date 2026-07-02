# GramWork Frontend

Production-ready frontend for GramWork - A rural employment platform connecting workers with employers.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **TanStack Query** - Server state management
- **React Router v7** - Routing
- **Axios** - HTTP client
- **React Hook Form + Zod** - Form validation
- **STOMP + SockJS** - WebSocket client
- **Framer Motion** - Animations
- **Recharts** - Charts and analytics
- **Sonner** - Toast notifications
- **Leaflet + React Leaflet** - Maps
- **Vitest + RTL** - Testing

## Project Structure

```
Frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── layout/     # Layout components
│   │   └── shared/     # Shared components
│   ├── pages/          # Page components
│   │   ├── auth/       # Authentication pages
│   │   ├── worker/     # Worker dashboard
│   │   ├── employer/   # Employer dashboard
│   │   └── admin/      # Admin dashboard
│   ├── services/       # API services
│   │   ├── api/        # API clients
│   │   └── websocket/  # WebSocket client
│   ├── stores/         # Zustand stores
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── config/         # Configuration
│   ├── test/           # Test utilities
│   ├── App.tsx         # Root component
│   └── main.tsx        # Entry point
├── .env.example        # Environment variables template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
├── vite.config.ts      # Vite config
└── tailwind.config.js  # Tailwind config
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

## Features

### Authentication
- JWT-based authentication
- Role-based access control (Worker, Employer, Admin)
- OTP verification
- Password reset
- Protected routes

### Worker Dashboard
- Profile management
- Job search with filters
- Nearby jobs map view
- Assignment workflow
- Attendance marking
- Payment history
- Real-time notifications

### Employer Dashboard
- Job posting and management
- AI-powered worker matching
- Nearby worker search
- Assignment tracking
- Attendance management
- Payment processing
- Invoice generation

### Admin Dashboard
- User management
- Job statistics
- Payment analytics
- System monitoring
- Real-time notifications

### Maps & Geolocation
- Interactive maps with Leaflet
- Location-based job search
- Geofencing
- Real-time worker location tracking

### Real-time Features
- WebSocket/STOMP notifications
- Live job updates
- Real-time assignment status
- Toast notifications

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report

## Backend Services

The frontend communicates with 8 microservices:

- **Auth Service** (8081) - Authentication
- **Profile Service** (8082) - Worker/Employer profiles
- **Job Service** (8083) - Job management
- **Assignment Service** (8084) - Assignment workflow
- **Attendance Service** (8085) - Attendance tracking
- **Payment Service** (8086) - Payments and invoices
- **AI Matching Service** (8087) - Worker-job matching
- **Notification Service** (8088) - Real-time notifications

## Docker Deployment

### Quick Start

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   ```
   http://localhost:3000
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f gramwork-frontend
   ```

4. **Stop the container:**
   ```bash
   docker-compose down
   ```

### Manual Docker Build

```bash
# Build image
docker build -t gramwork-frontend:latest .

# Run container
docker run -d \
  --name gramwork-frontend \
  -p 3000:80 \
  --add-host=host.docker.internal:host-gateway \
  gramwork-frontend:latest

# Check health
curl http://localhost:3000/health
```

### Docker Features

- Multi-stage build (optimized size ~50MB)
- Nginx production server with compression
- API proxying to all backend services
- WebSocket support for real-time notifications
- Health checks and auto-restart
- Security headers configured

## CI/CD Pipeline

GitHub Actions workflow includes:

1. **Test & Lint** - ESLint, TypeScript check, Vitest tests with coverage
2. **Build** - Production build and verification
3. **Docker** - Multi-platform image build and push to registry
4. **Security** - npm audit and Snyk scanning
5. **Notification** - Deployment status summary

Workflow triggers on:
- Push to `main` or `develop` branches
- Pull requests
- Manual dispatch

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Production Checklist

- [ ] Configure environment variables for production
- [ ] Ensure all backend services are running
- [ ] Build and test Docker image
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up SSL/TLS certificates
- [ ] Configure monitoring and logging
- [ ] Set up backup and recovery
- [ ] Test WebSocket connections
- [ ] Verify API proxying
- [ ] Run security scans

## Testing

Comprehensive test suite with Vitest and React Testing Library:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- src/utils/__tests__/formatters.test.ts
```

Test coverage includes:
- Utility functions (formatters, validation)
- Zustand stores (auth, notifications)
- UI components (Button, Input, etc.)
- Page components (Login, Dashboard)
- API services and hooks

## License

MIT
