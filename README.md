# SPAR: Self Service Portal

This module provides Self Service Portal for SPAR.

## Developer Notes

- For local development.
  - Install Node, Npm, Npx.
  - Install dependencies
    ```sh
    npm ci
    ```
  - Create a `.env.local` file with the following content. Edit the below API base path appropriately.
    ```sh
    NEXT_PUBLIC_BASE_PATH=""
    NEXT_PUBLIC_BASE_API_PATH="http://localhost:8000/"
    ```
  - Run the following to start the app
    ```sh
    npm run dev
    ```
  - Open [http://localhost:3000](http://localhost:3000) on browser.
