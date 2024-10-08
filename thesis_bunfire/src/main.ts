// @ts-ignore
import system_prompt from "../static/system_prompt.txt" with { type: "text" };
import { explainCommand } from "./explainshell.ts";
import { Groq } from "groq-sdk";

// Config
const config = {
  user: "ehlkristofhenrik",
  repo: "Amper",
  model: Bun.env["MODEL"] || "llama-3.1-8b-instant",
  groq_api_key: Bun.env["GROQ_API_KEY"] || "",
  github_access_token: Bun.env["GITHUB_AUTH_TOKEN"] || "",
  score_cap: parseInt(Bun.env["SCORE_CAP"] || "-5") || -5,
  explaination: Bun.env["EXPLAINATION"] || undefined,
  task: Bun.env["TASK"] || undefined,
};

// exit if the command is empty
if (process.argv.length <= 2) {
  console.log("USAGE: bunfire {cmd}");
  process.exit(0);
}

// Get the command from argc
const command = process.argv.slice(2).join(" ");

// Create groq api client
const client = new Groq({
  apiKey: config.groq_api_key,
});

// Parallel waiting
Promise.all([
  // Get explaination for command form explainshell.com
  explainCommand(command),
  // Get active issues for user
  // @ts-ignore
  fetch(`https://api.github.com/repos/${config.user}/${config.repo}/issues`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.github_access_token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
    redirect: "follow",
  }),
]).then(async (values) => {
  let [help, issues] = values;

  let current_tasks: string[] = ["anything"];

  if (issues.ok) {
    // Prepare the tasks
    const tasks = await issues.json();

    // Filter the active tasks for the current user
    current_tasks = tasks
      .filter(
        (issue: { state: string; assignees: [] }) =>
          issue.state === "open" &&
          issue.assignees.some(
            (assignee: { login: string }) => assignee.login === config.user,
          ),
      )
      .map((task: { id: number; title: string; body: string }) =>
        JSON.stringify({
          id: task.id,
          title: task.title,
          description: task.body,
        }),
      );
  }

  // For testing
  if (config.task !== undefined) current_tasks = [config.task];
  if (config.explaination !== undefined) help = config.explaination;

  // Query the LLM
  let result = await client.chat.completions.create({
    messages: [
      { role: "system", content: system_prompt },
      {
        role: "user",
        content: JSON.stringify({
          tasks: current_tasks,
          command: command,
          generated_explaination: help,
        }),
      },
    ],
    model: config.model,
  });

  // Get the string json
  const content = result.choices[0].message.content;

  // Store the result of the query
  let result_obj: { expectancy: number; security_score: number } = {
    expectancy: 0,
    security_score: 0,
  };

  // Parse the result
  try {
    if (content === null) {
      throw null;
    }
    result_obj = JSON.parse(
      content.substring(content.indexOf("{"), content.lastIndexOf("}") + 1),
    );
  } catch (exception) {
    console.error("Failed to parse json");
  }

  // Calculate overall score, offset it to be from 0:18 instead of -9:9
  const overall_score = 9 + result_obj.expectancy - result_obj.security_score;

  // Return the score
  process.exit(overall_score);
});
