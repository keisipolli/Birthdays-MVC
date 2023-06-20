import {defineConfig} from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import {addCucumberPreprocessorPlugin} from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";

export default defineConfig({
    e2e: {
        baseUrl: "https://localhost:5173/",
        specPattern: "**/*.feature",
        async setupNodeEvents(
            on: Cypress.PluginEvents,
            config: Cypress.PluginConfigOptions
        ): Promise<Cypress.PluginConfigOptions> {

            // Read the baseUrl from the environment variable VITE_API_BASE_URL
            config.env.VITE_API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://localhost:3000';

            // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
            await addCucumberPreprocessorPlugin(on, config);

            on(
                "file:preprocessor",
                createBundler({
                    plugins: [createEsbuildPlugin(config)],
                })
            );

            // Make sure to return the config object as it might have been modified by the plugin.
            return config;
        },
    },
});

