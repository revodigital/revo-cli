import { Option } from 'commander';

export const createLogOptions : Array<Partial<Option>> = [
  {flags: "-l, --log <message>", description: "Log message"}
]

export const createErrorOptions : Array<Partial<Option>> = [
  {flags: "-e, --error <message>", description: "Error message"}
]

export const createFlutterOptions : Array<Partial<Option>> = []