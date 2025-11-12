import { spawn } from "child_process";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const parsed = parseInt(process.env.PORT, 10);
const PORT = !isNaN(parsed) && parsed >= 1024 && parsed <= 65535 ? parsed : 4321;

const args = ['start-server-and-test', 'serve', `http://localhost:${PORT}`, "test"];

const serve = spawn('npx', args, { stdio: 'inherit' });
serve.on("error", (err) => {
  console.error(`Failed to start server: ${err.message}`);
  process.exit(1);
});
serve.on("close", (code) => {
  if (code !== null) {
   console.log(`Server exited with code ${code}`);
    process.exit(code);
  } else {
    console.log(`Server was terminated by a signal`);
    process.exit(1);
  }
});