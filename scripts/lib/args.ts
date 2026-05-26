/**
 * 极简 argv 解析器。
 * 支持 --key value 和 --flag（布尔 true）。
 * 不使用任何第三方依赖，保持轻量。
 */
export interface ParsedArgs {
  /** 子命令名称（第一个非选项参数） */
  command: string | null;
  /** --key value 映射 */
  options: Record<string, string | boolean>;
  /** 所有原始 args */
  raw: string[];
}

export function parseArgs(argv: string[] = process.argv.slice(2)): ParsedArgs {
  const options: Record<string, string | boolean> = {};
  let command: string | null = null;
  const raw = [...argv];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) {
        options[key] = next;
        i++;
      } else {
        options[key] = true;
      }
    } else if (!command) {
      command = arg;
    }
  }

  return { command, options, raw };
}

/** 交互模式下没有提供任何参数 */
export function hasArgs(parsed: ParsedArgs): boolean {
  return !!parsed.command || Object.keys(parsed.options).length > 0;
}
