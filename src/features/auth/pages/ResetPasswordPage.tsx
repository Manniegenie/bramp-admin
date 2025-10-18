import { ResetPasswordForm } from '../components/ResetPasswordForm';
import Logo from '../../../assets/img/logo.png';

export function ResetPasswordPage() {
  return (
    <div
      className="w-screen bg-primary min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-12 p-6 bg-white rounded-xl shadow-lg">
        <div>
          <img
            src={Logo}
            alt="Logo"
            className="mx-auto h-12 w-auto"
            style={{ filter: 'invert(1)' }}
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        <ResetPasswordForm />
        <div className="text-center">
          <a
            href="/login"
            className="text-sm font-medium text-primary hover:text-primary/90"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}