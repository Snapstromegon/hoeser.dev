const shiki = require("shiki");

module.exports = function (
  eleventyConfig,
  { theme = "dark-plus", ...options } = {}
) {
  // empty call to notify 11ty that we use this feature
  eleventyConfig.amendLibrary("md", () => {});

  eleventyConfig.on("eleventy.before", async () => {
    const highlighter = await shiki.getHighlighter({ theme });
    eleventyConfig.amendLibrary("md", (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => highlight(code, lang, highlighter, options),
      })
    );
  });
};

/**
 * Highlight code
 * @param {string} code Code to highlight
 * @param {string} lang Language name
 * @param {shiki.Highlighter} highlighter
 * @returns {string} Highlighted code
 */
const highlight = (code, lang, highlighter, options) => {
  const tokenized = highlighter.codeToThemedTokens(code, lang);

  /**
   * @type {Map<number, string[]>}
   */
  const linesWithCommands = new Map();
  tokenized.forEach((line, lineIndex) => {
    const commands = extractLineShikierCommands(line, options);
    if (commands.length > 0) {
      linesWithCommands.set(lineIndex + 1, commands);
    }
  });

  /**
   * @type {Map<number, string[]>}
   */
  const linesApplyCommands = new Map();
  /**
   * @type {Map<string, number>}
   */
  const rangeStarts = new Map();

  for (const [lineNumber, commands] of linesWithCommands.entries()) {
    for (const command of commands) {
      const commandParts = command.split(":");
      if (commandParts.length === 1) {
        commandParts.push("");
      }
      const lineSpec = commandParts.pop();
      const cleanCommand = resolveCommandShortcuts(commandParts.join(":"));
      if (lineSpec.toLowerCase() === "start") {
        const start = Math.min(
          lineNumber,
          rangeStarts.get(cleanCommand) || Infinity
        );
        rangeStarts.set(cleanCommand, start);
      } else {
        /**
         * @type {{start: number, end: number}}
         */
        let lineRange;
        if (!lineSpec) {
          lineRange = { start: lineNumber, end: lineNumber };
        } else if (lineSpec.toLowerCase() === "end") {
          const start = rangeStarts.get(cleanCommand);
          if (!start) {
            throw new Error(
              `Missing start for end command ${cleanCommand} in line ${lineNumber}`
            );
          }
          lineRange = { start, end: lineNumber };
        } else {
          const lineSpecParts = lineSpec.split(",").map((l) => parseInt(l));
          switch (lineSpecParts.length) {
            case 1:
              lineRange = {
                start: lineNumber,
                end: lineNumber + lineSpecParts[0],
              };
              break;
            case 2:
              lineRange = {
                start: lineNumber + lineSpecParts[0],
                end: lineNumber + lineSpecParts[0] + lineSpecParts[1],
              };
              break;
            default:
              throw new Error(`Invalid line spec ${lineSpec}`);
          }
        }
        for (let i = lineRange.start; i <= lineRange.end; i++) {
          if (!linesApplyCommands.has(i)) {
            linesApplyCommands.set(i, []);
          }
          linesApplyCommands.get(i).push(cleanCommand);
        }
      }
    }
  }

  const lineOptions = [...linesApplyCommands.entries()].map(
    ([lineNumber, commands]) => ({
      line: lineNumber,
      classes: commands.map((command) => `sh--${command}`),
    })
  );

  const theme = highlighter.getTheme();
  return shiki.renderToHtml(tokenized, {
    lineOptions,
    bg: theme.bg,
    fg: theme.fg,
    langId: lang
  });
};

const extractLineShikierCommands = (line, options) => {
  const shikierCommandsExtractor = /\[sh!(?<commands>[^\]]*)\]/g;
  const commands = [];
  const comments = line.filter(isTokenComment);
  for (const token of comments) {
    const match = shikierCommandsExtractor.exec(token.content);
    if (match) {
      commands.push(...match?.groups?.commands.trim().split(/\s/));
      line.splice(
        line.findIndex((t) => t === token),
        1
      );
    }
  }

  return commands;
};

const isTokenComment = (token) =>
  (token.explanation || []).some((explanation) =>
    explanation.scopes.some((scope) => scope.scopeName.startsWith("comment."))
  );

const resolveCommandShortcuts = (command) => {
  return (
    {
      "++": "add",
      "--": "remove",
      "~~": "highlight",
      "**": "focus",
    }[command] || command
  );
};
