import { validator } from '@ioc:Adonis/Core/Validator'
import Env from '@ioc:Adonis/Core/Env'

validator.rule('adminKey', async (value, _, options) => {
  if (typeof value !== 'string') {
    return
  }

  if (Env.get('ADMIN_KEY') != value.trim()) {
    options.errorReporter.report(
      options.pointer,
      'adminKey',
      'Invalid Admin Key',
      options.arrayExpressionPointer
    )
  }
})
