#!/usr/bin/env node

import { program }                      from 'commander';
import { createCommand } from './utils';
import { ActionsEnum }                  from './actions/actionsModel';

program
  .version('0.0.1')
  .description('revo_cli')


createCommand(program, ActionsEnum.CREATE_LOG)
createCommand(program, ActionsEnum.CREATE_ERROR)

program.parse(process.argv);