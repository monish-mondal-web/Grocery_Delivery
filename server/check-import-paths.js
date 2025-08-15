import fs from "fs";
import path from "path";
import { glob } from "glob"; // এখানে fix করা হয়েছে

const projectRoot = path.resolve("./server"); // তোমার backend folder root

function getAllImports(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const regex = /import\s+.*?from\s+['"](.*?)['"]/g;
  let matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function checkPaths() {
  const jsFiles = glob.sync(path.join(projectRoot, "**/*.js"));
  let problems = [];

  jsFiles.forEach((file) => {
    const imports = getAllImports(file);

    imports.forEach((imp) => {
      if (imp.startsWith(".")) {
        const fullPath = path.resolve(path.dirname(file), imp);

        let resolvedFile = null;
        if (fs.existsSync(fullPath)) {
          resolvedFile = fullPath;
        } else if (fs.existsSync(fullPath + ".js")) {
          resolvedFile = fullPath + ".js";
        } else {
          problems.push({
            type: "MISSING FILE",
            file,
            import: imp,
          });
          return;
        }

        const actualName = path.basename(resolvedFile);
        const importName = path.basename(imp.endsWith(".js") ? imp : imp + ".js");

        if (actualName !== importName) {
          problems.push({
            type: "CASE MISMATCH",
            file,
            import: imp,
            actualFile: actualName,
          });
        }
      }
    });
  });

  if (problems.length === 0) {
    console.log("✅ No path or case issues found!");
  } else {
    console.log("⚠ Problems found:");
    problems.forEach((p) => console.log(p));
  }
}

checkPaths();
