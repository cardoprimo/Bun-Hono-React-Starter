import { BuildConfig, BuildOutput } from 'bun';

const { NODE_ENV } = import.meta.env; // fix import

buildLog(
  await Bun.build({
    entrypoints: ['./index.ts', './frontend/index.ts],
    format: 'esm',
    outdir: 'dist',
    target: 'browser',
    ...extraConfig(),
  }),
);

function extraConfig(): Partial<BuildConfig> {
  switch (NODE_ENV ?? 'development') {
    case 'development':
      return {};
    case 'production':
      return { minify: true };
    default:
      console.log(
        '\x1b[93m' +
          `Unrecognizable "NODE_ENV": ${NODE_ENV}, is this a mistake?` +
          '\x1b[0m',
      );
      return {};
  }
}

function buildLog({ logs, outputs, success }: BuildOutput) {
  if (success) {
    for (const { path } of outputs) {
      console.log(
        '\x1b[32;2m' +
          `Artifact generated successfully at "${path}"` +
          '\x1b[0m',
      );
    }
    console.log(
      '\x1b[92;1m' +
        `Build succeeded in ${NODE_ENV} mode` +
        '\x1b[0m',
    );
  } else {
    for (const log of logs) {
      console.error(log);
    }
    console.error(
      '\x1b[91;1m' +
        `Build failed in ${NODE_ENV} mode` +
        '\x1b[0m',
    );
  }
}