const fs = require("fs").promises;
const path = require("path");

// --- Configuration ---
const rootDir = __dirname;
const outputFile = path.join(__dirname, "all_frontend_code_condensed.txt");

const relevantExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".scss",
  ".json",
  ".html",
];

const rootFilesToInclude = [
  "package.json",
  "index.html",
  "index.js",
  "index.jsx",
  "index.ts",
  "index.tsx",
  "App.js",
  "App.jsx",
  "App.ts",
  "App.tsx",
  "tsconfig.json",
  "vite.config.js",
  "vite.config.ts",
  "webpack.config.js",
  "postcss.config.js",
  "tailwind.config.js",
].map((file) => path.join(rootDir, file));

const ignoredDirs = [
  "node_modules",
  ".git",
  "build",
  "dist",
  ".next",
  ".vite",
  ".svelte-kit",
  "storybook-static",
  "coverage",
  "public/build",
  ".vscode",
  "temp",
  "cache",
];

const ignoredRootFiles = new Set([
  path.basename(outputFile),
  "aggregate-code.js",
  "package-lock.json",
  "yarn.lock",
  ".gitignore",
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
]);

// --- Helper Functions ---

function isIgnored(itemPath, isDirectory) {
  const baseName = path.basename(itemPath);
  const relativePath = path.relative(rootDir, itemPath);
  const pathSegments = relativePath.split(path.sep);

  if (
    baseName.startsWith(".") &&
    baseName !== ".github" &&
    baseName !== ".gitlab"
  ) {
    const ext = path.extname(baseName).toLowerCase();
    if (
      rootFilesToInclude.includes(itemPath) &&
      relevantExtensions.includes(ext)
    ) {
      return false;
    }
    if (!relevantExtensions.includes(ext)) {
      return true;
    }
  }

  if (pathSegments.length > 0 && ignoredDirs.includes(pathSegments[0]))
    return true;
  if (path.dirname(itemPath) === rootDir && ignoredRootFiles.has(baseName))
    return true;

  return false;
}

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

// --- Content Processing Functions ---

function removeComments(code) {
  let cleanedCode = code.replace(/\/\*[\s\S]*?\*\//g, "");
  cleanedCode = cleanedCode.replace(/(?<!:)\/\/[^\r\n]*/g, "");
  return cleanedCode;
}

function removeBlankLines(text) {
  return text
    .split(/[\r\n]+/)
    .filter((line) => line.trim().length > 0)
    .join("\n");
}

// NEW: Basic HTML whitespace minification (safe for <pre>, <script>, etc.)
function minifyHTML(html) {
  // Preserve content in <pre>, <textarea>, <script>, <style> by marking them
  const placeholder = "__MINIFY_PROTECTED__";
  const protected = [];
  html = html.replace(
    /<(pre|textarea|script|style)(\s[^>]*)?>[\s\S]*?<\/\1>/gi,
    (match) => {
      protected.push(match);
      return `${placeholder}${protected.length - 1}`;
    },
  );
  // Collapse multiple whitespace outside tags, but preserve single spaces
  html = html.replace(/\s+/g, " ");
  // Restore protected content
  html = html.replace(
    new RegExp(`${placeholder}(\\d+)`, "g"),
    (_, i) => protected[i],
  );
  return html;
}

// NEW: Basic CSS/SCSS minification
function minifyCSS(css) {
  // Remove comments (already done in removeComments, but ensure here)
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  // Collapse whitespace, preserve single spaces where needed
  css = css.replace(/\s+/g, " ");
  // Remove spaces around certain characters
  css = css.replace(/\s*([{}:;,])\s*/g, "$1");
  // Remove leading/trailing spaces in blocks
  css = css.replace(/{\s*/g, "{").replace(/\s*}/g, "}");
  return css.trim();
}

// --- Core Aggregation Logic ---
async function aggregateCode() {
  console.log(
    `Aggregating and condensing frontend code from root directory: ${rootDir}...`,
  );

  const existingRootFiles = [];
  for (const file of rootFilesToInclude) {
    try {
      await fs.access(file);
      const ext = path.extname(file).toLowerCase();
      if (relevantExtensions.includes(ext) && !isIgnored(file, false)) {
        existingRootFiles.push(file);
      }
    } catch (err) {
      if (err.code !== "ENOENT") {
        console.error(`Error checking file ${file}:`, err);
      }
    }
  }

  const scannedFiles = await getAllFiles(rootDir);
  const allFilePaths = [...new Set([...existingRootFiles, ...scannedFiles])]
    .filter((filePath) => !isIgnored(filePath, false))
    .sort();

  const fileStructure = await buildFileStructure(rootDir);
  let aggregatedContent = "# Structure\n";
  aggregatedContent += JSON.stringify(fileStructure) + "\n\n"; // Minified JSON
  aggregatedContent += "# Code\n\n";

  for (const filePath of allFilePaths) {
    try {
      const relativePath = path
        .relative(__dirname, filePath)
        .replace(/\\/g, "/");
      let fileContent = await fs.readFile(filePath, "utf8");
      if (fileContent.trim().length === 0) continue; // Skip empty files early

      const fileExt = path.extname(filePath).toLowerCase();

      // Process content based on file type
      if ([".js", ".jsx", ".ts", ".tsx"].includes(fileExt)) {
        fileContent = removeComments(fileContent);
        fileContent = removeBlankLines(fileContent);
      } else if ([".css", ".scss"].includes(fileExt)) {
        fileContent = removeComments(fileContent);
        fileContent = minifyCSS(fileContent);
        fileContent = removeBlankLines(fileContent);
      } else if (fileExt === ".json") {
        try {
          fileContent = JSON.stringify(JSON.parse(fileContent));
        } catch (jsonError) {
          console.warn(
            `Warning: Could not parse/minify JSON file ${relativePath}. Keeping original content. Error: ${jsonError.message}`,
          );
        }
      } else if (fileExt === ".html") {
        fileContent = minifyHTML(fileContent);
        fileContent = removeBlankLines(fileContent);
      } else {
        fileContent = fileContent.trim();
      }

      if (fileContent.length > 0) {
        aggregatedContent += `# ${relativePath}\n${fileContent}\n\n`;
      }
    } catch (err) {
      const relativePath = path
        .relative(__dirname, filePath)
        .replace(/\\/g, "/");
      console.error(`Error processing file ${relativePath}:`, err);
      aggregatedContent += `# ${relativePath} (Error)\n// Error: ${err.message}\n\n`;
    }
  }

  try {
    aggregatedContent = aggregatedContent.trimEnd() + "\n";
    await fs.writeFile(outputFile, aggregatedContent);
    console.log(
      `Successfully aggregated and condensed frontend code to ${outputFile}`,
    );
  } catch (err) {
    console.error(`Error writing to ${outputFile}:`, err);
  }
}

// --- Run Once ---
(async () => {
  await aggregateCode();
})();
