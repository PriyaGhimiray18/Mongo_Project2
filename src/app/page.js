'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/style.css';
import { Eye, EyeOff } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loginInput = e.target.studentId.value;
    const password = e.target.password.value;

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginInput, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      // Login successful → redirect
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <p>Please enter your details</p>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              name="studentId"
              placeholder="Email or Student ID"
              required
              disabled={loading}
            />

            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                disabled={loading}
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
              <div style={{ color: '#ff0000', marginTop: '10px', fontSize: '14px' }}>
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

      {/* Centering and layout styles just like signup page */}
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
