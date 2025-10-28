import { LoginForm } from '../components/LoginForm';
// import Bg from '../../../assets/img/auth-bg.jpg';
import Logo from '../../../assets/img/logo.png';

export function LoginPage() {
  return (
    <div
      className="w-screen bg-primary min-h-screen flex items-center justify-center bg-gray-50"
      // style={{
      //   backgroundImage: `url(${Bg})`,
      //   backgroundSize: 'contain',
      //   backgroundPosition: 'center',
      // }}
    >
      <div className="max-w-md w-full space-y-12 p-6 bg-white rounded-xl shadow-lg">
        <div>
          <img
            src={Logo}
            alt="Logo"
            className="mx-auto h-12 w-auto"
            style={{ filter: 'invert(1)' }}
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {/* <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <a
              href="/register"
              className="font-medium text-primary hover:text-primary/90"
            >
              create a new account
            </a>
          </p> */}
        </div>
        <LoginForm />
        <div className="text-center">
          <a
            href="/reset-password"
            className="text-sm font-medium text-primary hover:text-primary/90"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}