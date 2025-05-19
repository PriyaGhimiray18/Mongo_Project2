'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import '@/styles/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const studentId = form.studentId.value;

    if (!username || !password || !studentId || !email) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, studentId }),
      });

      const data = await res.json();

      if (res.ok) {
        setTimeout(() => {
          router.push('/?success=true');
        }, 1000);
      } else {
        setError(data.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        <div className="login-form">
          <h2>Sign Up</h2>
          <p>Create a new account</p>
          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="username"
              placeholder="Full Name"
              required
              disabled={isLoading}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              disabled={isLoading}
            />
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              required
              disabled={isLoading}
            />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                required
                disabled={isLoading}
              />
              <span
                className="eye-icon"
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {error && (
              <div style={{ color: '#ff0000', marginTop: '10px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>

          <div className="signup-text">
            <p>
              Already have an account?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!isLoading) router.push('/');
                }}
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Style section for centering and layout */}
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
