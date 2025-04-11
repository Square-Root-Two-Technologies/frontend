const fs = require("fs").promises;
const path = require("path");

// --- Configuration ---
const rootDir = __dirname; // The root directory (should contain src, public, etc.)
const outputFile = path.join(__dirname, "all_frontend_code_condensed.txt"); // Renamed output

// Files and extensions to include
// *** REVIEW: Are all these extensions needed? Any project-specific ones missing? ***
const relevantExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  // ".module.css", // Included by .css
  // ".module.scss",// Included by .scss
  ".json",
  ".html",
  // Add others like .svg, .md (if desired), framework-specific configs etc.
];

// Specific root files to include (optional, will be included if they match extensions)
const rootFilesToInclude = [
  "package.json",
  "index.html", // Common public HTML entry
  "index.js", // Entry point (if in root)
  "index.jsx",
  "index.ts",
  "index.tsx",
  "App.js", // Common root component
  "App.jsx",
  "App.ts",
  "App.tsx",
  "tsconfig.json",
  "vite.config.js",
  "vite.config.ts",
  "webpack.config.js",
  "postcss.config.js",
  "tailwind.config.js",
  // Add other root config/entry files you want included
].map((file) => path.join(rootDir, file));

// Directories and files to ignore
// *** REVIEW: Add any other build output, cache, or non-essential dirs ***
const ignoredDirs = [
  "node_modules",
  ".git",
  "build", // Common CRA/Webpack output
  "dist", // Common Vite/Webpack output
  ".next", // Next.js output
  ".vite", // Vite cache
  ".svelte-kit", // SvelteKit output
  "storybook-static", // Storybook build output
  "coverage",
  "public/build", // Sometimes used for frontend bundles
  ".vscode",
  "temp",
  "cache",
];

// *** REVIEW: Add any other specific files to ignore (lock files, local envs, etc.) ***
const ignoredRootFiles = new Set([
  path.basename(outputFile), // Ignore the output file itself
  "aggregate-code.js", // This script itself (assuming it's named this)
  "package-lock.json",
  "yarn.lock",
  ".gitignore",
  ".env", // Often sensitive, ignore unless needed for context
  ".env.local",
  ".env.development",
  ".env.production",
  // Add other sensitive or generated files you don’t want included
]);

// --- Helper Functions ---

function isIgnored(itemPath, isDirectory) {
  const baseName = path.basename(itemPath);
  const relativePath = path.relative(rootDir, itemPath);
  const pathSegments = relativePath.split(path.sep);

  // Ignore hidden files/folders (except special cases like .github/.gitlab if needed)
  // Allow hidden files if they have relevant extensions (like .eslintrc.js) or are explicitly included
  if (
    baseName.startsWith(".") &&
    baseName !== ".github" &&
    baseName !== ".gitlab"
  ) {
    const ext = path.extname(baseName).toLowerCase();
    // Check if it's explicitly included first
    if (
      rootFilesToInclude.includes(itemPath) &&
      relevantExtensions.includes(ext)
    ) {
      return false; // Keep explicitly included relevant hidden files
    }
    // Ignore if it doesn't have a relevant extension
    if (!relevantExtensions.includes(ext)) {
      // Before ignoring, check if it's a known config file that might not have standard extension included in relevantExtensions yet
      // Example: .prettierrc (if you decided not to add "" extension)
      // For simplicity now, we ignore if no relevant extension and not explicitly included.
      // You might refine this if you have extensionless hidden config files to include.
      return true;
    }
    // If it has a relevant extension but wasn't explicitly included, let it pass this check
    // It might still be ignored by directory rules later.
  }

  if (pathSegments.length > 0 && ignoredDirs.includes(pathSegments[0]))
    return true;
  if (path.dirname(itemPath) === rootDir && ignoredRootFiles.has(baseName))
    return true;

  return false;
}

// Async function to get all relevant files from the root directory
async function getAllFiles(dirPath) {
  const files = [];
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
      const fullPath = path.join(dirPath, item.name);
      if (isIgnored(fullPath, item.isDirectory())) continue;

      if (item.isDirectory()) {
        const subFiles = await getAllFiles(fullPath);
        files.push(...subFiles);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        // Check extension is relevant AND the file itself isn't ignored (e.g., package-lock.json in root)
        if (relevantExtensions.includes(ext) && !isIgnored(fullPath, false)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dirPath}:`, err);
  }
  return files;
}

// Build file structure (async)
async function buildFileStructure(dirPath) {
  const structure = {};
  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    for (const item of items.sort((a, b) => a.name.localeCompare(b.name))) {
      const fullPath = path.join(dirPath, item.name);
      if (isIgnored(fullPath, item.isDirectory())) continue;

      if (item.isDirectory()) {
        const subStructure = await buildFileStructure(fullPath);
        if (Object.keys(subStructure).length > 0) {
          structure[item.name] = subStructure;
        }
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        // Include in structure only if relevant extension and not ignored
        if (relevantExtensions.includes(ext) && !isIgnored(fullPath, false)) {
          structure[item.name] = true;
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory for structure ${dirPath}:`, err);
  }
  return structure;
}

// --- NEW: Content Processing Functions ---

/**
 * Removes single-line (//) and multi-line (/* ... * /) comments.
 * Works for JS, TS, JSX, TSX, CSS, SCSS.
 * Note: Regex might not be 100% perfect for edge cases. Does NOT remove HTML comments.
 * @param {string} code The code content
 * @returns {string} Code with comments removed
 */
function removeComments(code) {
  // Remove multi-line comments /* ... */ (non-greedy)
  let cleanedCode = code.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove single-line comments // ... (handles http:// correctly)
  cleanedCode = cleanedCode.replace(/(?<!:)\/\/[^\r\n]*/g, ""); // Avoid matching // in http://
  // HTML comments are NOT removed by default to avoid breaking conditional comments etc.
  return cleanedCode;
}

/**
 * Removes blank lines (lines containing only whitespace) from text.
 * @param {string} text The text content
 * @returns {string} Text with blank lines removed
 */
function removeBlankLines(text) {
  return text
    .split(/[\r\n]+/) // Split by one or more newline characters
    .filter((line) => line.trim().length > 0) // Keep lines with non-whitespace content
    .join("\n"); // Join back with single newlines
}

// --- Core Aggregation Logic ---
async function aggregateCode() {
  console.log(
    `Aggregating and condensing frontend code from root directory: ${rootDir}...`,
  );

  // Filter root files to include only those that exist and match extensions
  const existingRootFiles = [];
  for (const file of rootFilesToInclude) {
    try {
      await fs.access(file);
      const ext = path.extname(file).toLowerCase();
      // Ensure it has a relevant extension AND is not globally ignored
      if (relevantExtensions.includes(ext) && !isIgnored(file, false)) {
        existingRootFiles.push(file);
      }
    } catch (err) {
      if (err.code === "ENOENT") {
        // Optional: Log skipped non-existent root files
        // console.log(`Skipping non-existent root file: ${path.relative(rootDir, file)}`);
      } else {
        console.error(`Error checking file ${file}:`, err);
      }
    }
  }

  // Scan the rest of the project directory for other files
  const scannedFiles = await getAllFiles(rootDir);

  // Combine, ensure uniqueness (Set), sort, and filter out ignored root files again just in case
  const allFilePaths = [...new Set([...existingRootFiles, ...scannedFiles])]
    .filter((filePath) => !isIgnored(filePath, false)) // Final check for ignored status
    .sort();

  // Build the file structure representation (optional)
  const fileStructure = await buildFileStructure(rootDir);
  let aggregatedContent = "// --- File Structure ---\n";
  aggregatedContent += JSON.stringify(fileStructure, null, 2) + "\n\n"; // Pretty print structure
  // For slightly smaller structure: aggregatedContent += JSON.stringify(fileStructure) + "\n\n";

  aggregatedContent +=
    "// --- Aggregated Code Content (Comments and Blank Lines Removed) ---\n\n";

  for (const filePath of allFilePaths) {
    try {
      const relativePath = path
        .relative(__dirname, filePath)
        .replace(/\\/g, "/"); // Use forward slashes for consistency

      let fileContent = await fs.readFile(filePath, "utf8");
      const fileExt = path.extname(filePath).toLowerCase();

      // --- Process Content based on file type ---
      if ([".js", ".jsx", ".ts", ".tsx", ".css", ".scss"].includes(fileExt)) {
        fileContent = removeComments(fileContent); // Remove JS/CSS comments
        fileContent = removeBlankLines(fileContent);
      } else if (fileExt === ".json") {
        // Minify JSON (removes whitespace)
        try {
          fileContent = JSON.stringify(JSON.parse(fileContent));
        } catch (jsonError) {
          console.warn(
            `Warning: Could not parse/minify JSON file ${relativePath}. Keeping original content. Error: ${jsonError.message}`,
          );
        }
      } else if (fileExt === ".html") {
        // For HTML, just remove blank lines to be safe (don't remove comments)
        fileContent = removeBlankLines(fileContent);
      } else {
        // For other included types (e.g., .svg, .md if added), just trim whitespace
        fileContent = fileContent.trim();
      }
      // ------------------------------------------

      // Add a separator only if the file content is not empty after processing
      if (fileContent.length > 0) {
        aggregatedContent += `// FILE: ${relativePath}\n${fileContent}\n\n`;
      } else {
        aggregatedContent += `// FILE: ${relativePath} (Content Removed or Empty)\n\n`;
      }
    } catch (err) {
      const relativePath = path
        .relative(__dirname, filePath)
        .replace(/\\/g, "/");
      console.error(`Error processing file ${relativePath}:`, err);
      aggregatedContent += `// !!! ERROR Processing File: ${relativePath} !!!\n// Error: ${err.message}\n\n`;
    }
  }

  try {
    // Ensure there's a single newline at the very end
    aggregatedContent = aggregatedContent.trimEnd() + "\n";
    await fs.writeFile(outputFile, aggregatedContent);
    console.log(
      `Successfully aggregated and condensed frontend code to ${outputFile}`,
    );
    console.log(`\nTip: For further size reduction, compress the output file:`);
    console.log(`  gzip ${path.basename(outputFile)}`);
    console.log(`  (Or use zip/7z)`);
  } catch (err) {
    console.error(`Error writing to ${outputFile}:`, err);
  }
}

// --- Run Once ---
(async () => {
  await aggregateCode();
})();
