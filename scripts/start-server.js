import { spawn } from "child_process";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const PORT = process.env.PORT || 4321;

console.log(`Starting dev server on port ${PORT}...`);

const command = process.platform === "win32" ? "npm.cmd" : "npm";

const serve = spawn(command, ["run", "serve"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    PORT: PORT.toString(),
  },
});

serve.on("error", (err) => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});
serve.on("close", (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});
