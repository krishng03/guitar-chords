# Chord Sheet App

- A simple React Native app that converts chord sheet URLs into a clean, readable chord sheet for display in the UI.

- The app accepts a URL and determines the appropriate scraper based on the URL pattern. The scraper extracts the relevant HTML content from the webpage. A corresponding processor is then selected based on the source and transforms the HTML into a common chord sheet data structure.

- This separation keeps website-specific scraping and processing logic independent from the UI, making it easier to add support for new websites and handle changes to existing sources.

- The final processed chord sheet is rendered in the React Native interface.