import { Command } from 'commander';
import {
  ActionsEnum,
  runAction,
  prepareOptions
}                          from './actions/actionsModel';

export const createCommand = (program: Command, action: ActionsEnum) => {
  const myProgram = program.command(action)
  createOptions(myProgram, action)
  myProgram.action((args) => {
    console.log(args);
    runAction(action, args)
  })
}

const createOptions = (program: Command, action: ActionsEnum) => {
  const options = prepareOptions(action)

  for (let i = 0; i < options.length; i++) {
    program.option(options[i].flags, options[i].description)
  }
}