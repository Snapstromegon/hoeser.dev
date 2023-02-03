const shiki = require('shiki');

const isShikierEnabled = (lang) => !lang.toLowerCase().includes('{!sh!}');

const isTokenComment = (token) =>
  (token.explanation || []).some((explanation) =>
    explanation.scopes.some((scope) => scope.scopeName.startsWith('comment.'))
  );

const resolveCommandShortcuts = (command) =>
  ({
    '++': 'add',
    '--': 'remove',
    '~~': 'highlight',
    '**': 'focus',
  }[command] || command);

const extractLineShikierCommands = (line) => {
  const shikierCommandsExtractor = /\[sh!(?<commands>[^\]]*)\]/g;
  const commands = [];
  const comments = line.filter(isTokenComment);
  for (const token of comments) {
    const commandsString = shikierCommandsExtractor.exec(token.content)?.groups
      ?.commands;
    if (commandsString) {
      commands.push(...commandsString.trim().split(/\s/));
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
    for (const command of commands) {
      const commandParts = command.split(':');
      if (commandParts.length === 1) {
        commandParts.push('');
      }
      const lineSpec = commandParts.pop();
      const cleanCommand = resolveCommandShortcuts(commandParts.join(':'));
      if (lineSpec.toLowerCase() === 'start') {
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
        } else if (lineSpec.toLowerCase() === 'end') {
          const start = rangeStarts.get(cleanCommand) || 0;
          rangeStarts.delete(cleanCommand);
          lineRange = { start, end: lineNumber };
        } else {
          const lineSpecParts = lineSpec.split(',').map((l) => parseInt(l));
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

  for (const [command, start] of rangeStarts) {
    for (let i = start; i < totalLines; i++) {
      if (!linesApplyCommands.has(i)) {
        linesApplyCommands.set(i, []);
      }
      linesApplyCommands.get(i).push(command);
    }
  }

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
    lineOptions.push({
      line: lineNumber,
      classes: commands.map((command) => `sh--${command}`),
    });
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
  const cleanLang = lang.split('{')[0];
  const tokenized = highlighter.codeToThemedTokens(code, cleanLang);
  const lineOptions = isShikierEnabled(lang) ? [] : getLineOptions(tokenized);

  const theme = highlighter.getTheme();
  return shiki.renderToHtml(tokenized, {
    lineOptions,
    bg: theme.bg,
    fg: theme.fg,
    langId: cleanLang,
  });
};

module.exports = function (eleventyConfig, { theme = 'dark-plus' } = {}) {
  // empty call to notify 11ty that we use this feature
  eleventyConfig.amendLibrary('md', () => {});

  eleventyConfig.on('eleventy.before', async () => {
    const highlighter = await shiki.getHighlighter({ theme });
    eleventyConfig.amendLibrary('md', (mdLib) =>
      mdLib.set({
        highlight: (code, lang) => highlight(code, lang, highlighter),
      })
    );
  });
};
