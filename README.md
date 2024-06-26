# SysOut Project

## Table of Contents
- [Description](#description)
- [Project Structure](#project-structure)
- [Backend](#backend)
- [Frontend](#frontend)
- [How to Run the Project](#how-to-run-the-project)
- [ESLint Configuration](#eslint-configuration)
- [Contribution](#contribution)
- [License](#license)

## Description
SysOut is a project based on React, TypeScript, and Vite. It provides a minimal configuration for running React with HMR (Hot Module Replacement) and some ESLint rules.

## Project Structure
The project is structured as follows:
- `backend/`: Contains the backend server code, including controllers, models, and routes.
- `runners/`: Contains scripts for running MongoDB and React.
- `SysOut/`: Contains the frontend application code, including components, styles, and Vite configuration.

## Backend
The backend is an Express application that uses MongoDB as a database. It also uses sockets for real-time communication.

## Frontend
The frontend is a React application that uses TypeScript for static typing. It also uses Vite for fast module reloading.

## How to Run the Project
To run the project, you first need to start the backend by running the `runMongo.sh` script in the `runners/` directory. Then, you can start the frontend application by running the `runReact.sh` script in the same directory.

## ESLint Configuration
If you are developing a production application, we recommend updating the configuration to enable type lint rules:
- Replace `plugin:@typescript-eslint/recommended` with `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`.
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`.
- Install `eslint-plugin-react` and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the extends list.

## Contribution
If you want to contribute to this project, please follow the contribution guidelines provided in the `CONTRIBUTING.md` file.

## License
This project is licensed under the MIT License. See the `LICENSE` file for more details.
