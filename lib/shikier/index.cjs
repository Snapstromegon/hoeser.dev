const shiki = require("shiki");

const isShikierEnabled = (lang) => !lang.toLowerCase().includes("{!sh!}");

const isTokenComment = (token) =>
  (token.explanation || []).some((explanation) =>
    explanation.scopes.some((scope) => scope.scopeName.startsWith("comment."))
  );

const resolveCommandShortcuts = (command) =>
  ({
    "**": "focus",
    "++": "add",
    "--": "remove",
    "~~": "highlight",
  }[command] || command);

const extractLineShikierCommands = (line) => {
  const shikierCommandsExtractor = /\[sh!(?<commands>[^\]]*)\]/gu;
  const commands = [];
  const comments = line.filter(isTokenComment);
  for (const token of comments) {
    const commandsString = shikierCommandsExtractor.exec(token.content)?.groups
      ?.commands;
    if (commandsString) {
      commands.push(...commandsString.trim().split(/\s/u));
      line.splice(
        line.findIndex((t) => t === token),
        1
      );
    }
  }

  return commands;
};

const extractAllLinesWithCommands = (lines) => {
  /**
   * @type {Map<number, string[]>}
   */
  const linesWithCommands = new Map();
  lines.forEach((line, lineIndex) => {
    const commands = extractLineShikierCommands(line);
    if (commands.length > 0) {
      linesWithCommands.set(lineIndex + 1, commands);
    }
  });
  return linesWithCommands;
};

const parseNumberLineSpec = (lineSpec, lineNumber) => {
  const lineSpecParts = lineSpec.split(",").map((l) => parseInt(l, 10));
  switch (lineSpecParts.length) {
    case 1:
      return {
        end: lineNumber + lineSpecParts[0],
        start: lineNumber,
      };
    case 2:
      return {
        end: lineNumber + lineSpecParts[0] + lineSpecParts[1],
        start: lineNumber + lineSpecParts[0],
      };
    default:
      throw new Error(`Invalid line spec ${lineSpec}`);
  }
};

const applyCommandToLines = (lineRange, command, lineCommands) => {
  for (let i = lineRange.start; i <= lineRange.end; i++) {
    if (!lineCommands.has(i)) {
      lineCommands.set(i, []);
    }
    lineCommands.get(i).push(command);
  }
};

const parseLineSpec = (lineSpec, lineNumber, command, rangeStarts) => {
  switch (lineSpec.toLowerCase()) {
    case "":
      return { end: lineNumber, start: lineNumber };
    case "start":
      rangeStarts.set(
        command,
        Math.min(rangeStarts.get(command) || Infinity, lineNumber)
      );
      return;
    case "end": {
      const start = rangeStarts.get(command) || 0;
      rangeStarts.delete(command);
      return { end: lineNumber, start };
    }
    default:
      return parseNumberLineSpec(lineSpec, lineNumber);
  }
};

const applyRemainingStartedCommands = (
  rangeStarts,
  totalLines,
  linesApplyCommands
) => {
  for (const [command, start] of rangeStarts) {
    for (let i = start; i < totalLines; i++) {
      if (!linesApplyCommands.has(i)) {
        linesApplyCommands.set(i, []);
      }
      linesApplyCommands.get(i).push(command);
    }
  }
};

const parseRawCommand = (rawCommand) => {
  const commandParts = rawCommand.split(":");
  if (commandParts.length < 2) {
    commandParts.push("");
  }
  const lineSpec = commandParts.pop();
  const cleanCommand = resolveCommandShortcuts(commandParts.join(":"));
  return { cleanCommand, lineSpec };
};

const lineCommandsToAppliedLines = (linesWithCommands, totalLines) => {
  /**
   * @type {Map<number, string[]>}
   */
  const linesApplyCommands = new Map();
  /**
   * @type {Map<string, number>}
   */
  const rangeStarts = new Map();
  for (const [lineNumber, commands] of linesWithCommands.entries()) {
    for (const rawCommand of commands) {
      const { cleanCommand, lineSpec } = parseRawCommand(rawCommand);
      const lineRange = parseLineSpec(
        lineSpec,
        lineNumber,
        cleanCommand,
        rangeStarts
      );
      if (lineRange) {
        applyCommandToLines(lineRange, cleanCommand, linesApplyCommands);
      }
    }
  }

  applyRemainingStartedCommands(rangeStarts, totalLines, linesApplyCommands);

  return linesApplyCommands;
};

const getLineOptions = (tokenized) => {
  const lineOptions = [];
  const linesWithCommands = extractAllLinesWithCommands(tokenized);
  const linesApplyCommands = lineCommandsToAppliedLines(
    linesWithCommands,
    tokenized.length
  );
  for (const [lineNumber, commands] of linesApplyCommands.entries()) {
    for (const command of commands) {
      if (command.match(/.*\(.*\)/)) {
        lineOptions.push({
          style: [
            `--sh--${command.split("(")[0]}: ${
              command.split("(")[1].split(")")[0]
            }`,
          ],
          class: [`sh--${command.split("(")[0]}`],
          line: lineNumber,
        });
      } else {
        lineOptions.push({
          class: [`sh--${command}`],
          line: lineNumber,
        });
      }
    }
  }
  return lineOptions;
};

/**
 * Highlight code
 * @param {string} code Code to highlight
 * @param {string} lang Language name
 * @param {shiki.Highlighter} highlighter
 * @returns {string} Highlighted code
 */
const highlight = (code, lang, highlighter) => {
  const [cleanLang] = lang.split("{");
  const tokenized = highlighter.codeToThemedTokens(code, cleanLang);
  const lineOptions = isShikierEnabled(lang) ? getLineOptions(tokenized) : [];

  const theme = highlighter.getTheme();
  return renderToHtml(tokenized, {
    bg: theme.bg,
    fg: theme.fg,
    langId: cleanLang,
    lineOptions,
  });
};

const render = (type, { props }, children) => {
  const childrenString =
    type === "code" ? children.join("\n") : children.join("");
  switch (type) {
    case "pre":
      addProp(props, "tabindex", 0);
      return `<pre ${renderProps(props)}>${childrenString}</pre>`;
    case "code":
      return `<code ${renderProps(props)}>${childrenString}</code>`;
    case "line":
      return `<span ${renderProps(props)}>${childrenString}</span>`;
    case "token":
      return `<span ${renderProps(props)}>${childrenString}</span>`;
    default:
      throw new Error(`Unknown type ${type}`);
  }
};
const renderProps = (props) => {
  const propsString = Object.entries(props || {})
    .map(([key, values]) => {
      if (values === undefined) {
        return "";
      }
      let joiner = " ";
      switch (key) {
        case "style":
          joiner = ";";
          break;
      }
      return ` ${key}="${escapeHtml(values.join(joiner))}"`;
    })
    .join("");
  return propsString;
};

const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(html) {
  return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr]);
}

const addProp = (props, key, value) => {
  if (!props[key]) {
    props[key] = [];
  }
  props[key].push(value);
};

const getLineProps = (lineOptions) => {
  const props = {};

  for (const lineOption of lineOptions) {
    for (const [key, value] of Object.entries(lineOption)) {
      addProp(props, key, value);
    }
  }

  return props;
};

const groupByLine = (lineOptions) => {
  const lineOptionsByLine = new Map();
  for (const lineOption of lineOptions) {
    if (!lineOptionsByLine.has(lineOption.line)) {
      lineOptionsByLine.set(lineOption.line, []);
    }
    lineOptionsByLine.get(lineOption.line).push(lineOption);
  }
  return lineOptionsByLine;
};

/**
 * A custom render to html function to allow for setting styles
 * @param {shiki.IThemedToken[][]} lines
 * @param {shiki.HtmlRendererOptions} options
 */
const renderToHtml = (lines, options) => {
  const optionsByLineNumber = groupByLine(options.lineOptions);
  return render(
    "pre",
    {
      props: {
        class: ["shiki", options.themeName],
        style: [`background-color: ${options.bg ?? "#fff"}`],
      },
    },
    [
      options.langId ? `<div class="language-id">${options.langId}</div>` : ``,
      render(
        "code",
        {},
        lines.map((line, lineIndex) => {
          const lineNumber = lineIndex + 1;
          const lineOptions = optionsByLineNumber.get(lineNumber) ?? [];
          const lineProps = getLineProps(lineOptions);
          addProp(lineProps, "class", "line");
          return render(
            "line",
            {
              props: lineProps,
              lines,
              line,
              lineIndex,
            },
            line.map((token) => {
              const cssDeclarations = [`color: ${token.color || options.fg}`];
              if (token.fontStyle & shiki.FontStyle.Italic) {
                cssDeclarations.push("font-style: italic");
              }
              if (token.fontStyle & shiki.FontStyle.Bold) {
                cssDeclarations.push("font-weight: bold");
              }
              if (token.fontStyle & shiki.FontStyle.Underline) {
                cssDeclarations.push("text-decoration: underline");
              }

              return render(
                "token",
                {
                  props: { style: cssDeclarations },
                  tokens: line,
                  token,
                  lineIndex,
                },
                [escapeHtml(token.content)]
              );
            })
          );
        })
      ),
    ]
  );
};

module.exports = (eleventyConfig, { theme = "dark-plus" } = {}) => {
  // empty call to notify 11ty that we use this feature
  // eslint-disable-next-line no-empty-function
  eleventyConfig.amendLibrary("md", () => {});

  eleventyConfig.on("eleventy.before", async () => {
    const highlighter = await shiki.getHighlighter({ theme });
    eleventyConfig.amendLibrary("md", (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => highlight(code, lang, highlighter),
      })
    );
  });
};
