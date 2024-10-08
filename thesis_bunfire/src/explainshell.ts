// Generate explaination using the explainshell.com tool
export const explainCommand = async (command: string): Promise<string> => {
  const url = `https://explainshell.com/explain?cmd=${Bun.escapeHTML(command)}`;

  let help: string = "";

  // Select the help-box objects' text
  new HTMLRewriter()
    .on("pre.help-box", {
      text: (text) => {
        let trimmed = text.text.trim();
        if (trimmed !== "") {
          help += trimmed + "\n";
        }
      },
    })
    .transform(await fetch(url));

  return help.replaceAll(",\n", ",").replaceAll("\n,", ",");
};
