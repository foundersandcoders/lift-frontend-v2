# Beacons

Beacon is a frontend application designed to work seamlessly with the LIFT-backend. It provides an intuitive interface for users to interact with various data-driven components, focusing on subject and verb selection for creating statements.

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Installation](#installation)
- [Project Structure](#project-structure)
- [Development](#development)
  - [Linting](#linting)
- [Deployment](#deployment)
  - [GitHub Actions Workflow](#github-actions-workflow)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with Beacon, ensure you have the following prerequisites installed:

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Deno (for backend integration)

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/beacon.git
cd beacon
npm install
```

## Project Structure

The project is organized as follows:

- **src/**: Contains the main source code for the application.
  - **components/**: React components used throughout the app.
  - **context/**: Context providers for state management.
  - **api/**: API calls to the backend.
  - **hooks/**: Custom React hooks.
  - **lib/**: Utility functions.
- **data/**: JSON files containing static data for the application.
- **public/**: Static files and assets.
- **.github/**: GitHub workflows for CI/CD.
- **dist/**: Build output directory (ignored in version control).

## Development

To start the development server, run:

```bash
npm run dev
```

This will start a local server at `http://localhost:3000` where you can view the application.

### Linting

Ensure your code adheres to the project's style guidelines by running:

```bash
npm run lint
```

## Deployment

Beacon is configured to deploy to Deno Deploy. The deployment process is automated using GitHub Actions. On every push to the `main` branch, the application is built and deployed.

### GitHub Actions Workflow

The deployment workflow is defined in `.github/workflows/deploy.yml`. It includes steps to:

- Clone the repository
- Install Deno and Node.js
- Build the project
- Deploy to Deno

## Configuration

Configuration settings are managed through environment variables. Ensure you have a `.env` file in the root directory with the necessary variables:

```ini
VITE_API_URL=<your_backend_api_url>
VITE_RESEND_KEY=<your_resend_key>
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
