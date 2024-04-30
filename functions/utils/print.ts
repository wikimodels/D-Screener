export enum ConsoleColors {
  "white" = "white",
  "red" = "red",
  "green" = "green",
  "yellow" = "yellow",
  "blue" = "blue",
  "magenta" = "magenta",
  "cyan" = "cyan",
}

export function print(color: string, text: string) {
  const consoleColor = getConsoleColor(color);
  const resetColor = getConsoleColor("reset");
  console.log(`${consoleColor}${text}`, `${resetColor}`);
}

function getConsoleColor(color: string) {
  switch (color) {
    case ConsoleColors.red:
      return "\x1b[31m";
    case ConsoleColors.green:
      return "\x1b[32m";
    case ConsoleColors.yellow:
      return "\x1b[33m";
    case ConsoleColors.blue:
      return "\x1b[34m";
    case ConsoleColors.magenta:
      return "\x1b[35m";
    case ConsoleColors.cyan:
      return "\x1b[36m";
    case ConsoleColors.white:
      return "\x1b[37m";
    case "reset":
      return "\x1b[0m";
    default:
      return "\x1b[0m";
  }
}
