export interface examplePlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
