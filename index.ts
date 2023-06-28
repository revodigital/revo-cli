#!/usr/bin/env node

import { program }                      from 'commander';
import { createCommand } from './mobile_app/utils';
import { ActionsEnum }                  from './mobile_app/actions/actionsModel';

program
  .version('0.0.1')
  .description('revo_cli')


createCommand(program, ActionsEnum.CREATE_LOG)
createCommand(program, ActionsEnum.CREATE_ERROR)
createCommand(program, ActionsEnum.CREATE_FLUTTER_APP)

program.parse(process.argv);