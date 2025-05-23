'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import '@/styles/style.css';
import { Eye, EyeOff } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    setIsClient(true);
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
    const result = await signIn('credentials', {
      redirect: false,
        email,
      password,
    });

      if (result?.error) {
        setError(result.error);
        console.error('Login error:', result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="page-wrapper">
        <div className="login-container">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    return null;
    }

  return (
    <div className="page-wrapper">
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <p>Please enter your details</p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="email"
              placeholder="Email or Student ID"
              required
              disabled={loading}
              autoComplete="email"
            />

            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <div
                className="eye-icon"
                role="button"
                tabIndex={0}
                onClick={() => !loading && setShowPassword(!showPassword)}
                onKeyDown={(e) => {
                  if ((e.key === 'Enter' || e.key === ' ') && !loading) {
                    setShowPassword(!showPassword);
                  }
                }}
              >
                {isClient && (showPassword ? <EyeOff size={20} /> : <Eye size={20} />)}
              </div>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="signup-text">
              <p>
                Don&apos;t have an account?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!loading) router.push('/signup');
                  }}
                >
                  Sign Up
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        .page-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f0f2f5;
          padding: 20px;
        }

        .login-container {
          background: rgba(255, 255, 255, 0.95);
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 400px;
          text-align: center;
          transition: all 0.3s ease-in-out;
          z-index: 1;
        }

        .password-container {
          position: relative;
        }

        .password-container input {
          width: 100%;
          padding-right: 2.5rem;
        }

        .eye-icon {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }

        .error-message {
          color: #dc3545;
          margin-top: 10px;
          font-size: 14px;
          text-align: left;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
