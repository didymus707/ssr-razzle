import { createHookContext } from '../../../../hooks'
import {
  ForgotPasswordInitialValuesProps,
  LoginFormInitialValuesProps,
  RegisterFormInitialValuesProps
} from '../components'
import * as authService from '../service'

const useAuthMethods = () => {
  const onLogin = (values: LoginFormInitialValuesProps) =>
    authService.login(values)

  const onRegister = (values: RegisterFormInitialValuesProps) =>
    authService.register(values)

  const onForgotPassword = (
    values: ForgotPasswordInitialValuesProps & { link: string }
  ) => authService.forgotPassword(values)

  const onResetPassword = (values: { password: string; token: string }) =>
    authService.resetPassword(values)

  const onLogout = (userId?: string) => authService.logout(userId)

  return { onLogin, onLogout, onRegister, onForgotPassword, onResetPassword }
}

const [AuthProvider, useAuth] = createHookContext(useAuthMethods)

export { AuthProvider, useAuth }
