
import React, { useState } from 'react';

// ==========================================
// LOGIN COMPONENT
// Purpose:
// 1. Customer login form.
// 2. New customer signup form.
// 3. Email validation.
// 4. Password show/hide.
// 5. Login/signup callback.
// 6. Form error and success messages.
// ==========================================

function Login({
  onClose,
  onLogin,
  onSignup
}) {

  // ==========================================
  // COMPONENT STATES
  // Login/signup mode aur form data manage karna.
  // ==========================================

  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // ==========================================
  // EMAIL VALIDATION
  // Email format check karna.
  // ==========================================

  const isValidEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  };

  // ==========================================
  // FORM SUBMIT HANDLER
  // Login aur signup request parent ko bhejna.
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    // Check required fields
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    // Validate email
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Signup validation
    if (isSignup) {

      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }

      if (password.length < 8) {
        setError('Password must contain at least 8 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

    }

    // Check callback availability
    const authHandler = isSignup ? onSignup : onLogin;

    if (!authHandler) {
      setError('Authentication service is not connected yet.');
      return;
    }

    try {

      setLoading(true);

      // Parent component/backend ko data bhejna.
      const result = await authHandler(
        isSignup
          ? { name: name.trim(), email: email.trim(), password }
          : { email: email.trim(), password }
      );

      // Callback false return kare to error show.
      if (result === false) {
        setError('Authentication failed. Please try again.');
        return;
      }

      // Successful response
      setSuccess(
        isSignup
          ? 'Account created successfully!'
          : 'Login successful!'
      );

    } catch (err) {

      // Backend/API error handle karna.
      setError(
        err?.message || 'Something went wrong. Please try again.'
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // SWITCH LOGIN/SIGNUP MODE
  // Form mode change karna.
  // ==========================================

  const switchMode = () => {
    setIsSignup((previous) => !previous);

    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setError('');
    setSuccess('');
  };

  // ==========================================
  // MAIN LOGIN UI
  // ==========================================

  return (

    <div
      className="login-overlay"
      onClick={onClose}
      role="presentation"
    >

      {/* Login modal */}
      <div
        className="login-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isSignup ? 'Create account' : 'Customer login'}
      >

        {/* Close button */}
        <button
          type="button"
          className="login-close"
          onClick={onClose}
          aria-label="Close login"
        >
          ×
        </button>

        {/* ======================================
            LOGIN HEADER
        ====================================== */}

        <div className="login-heading">

          <h2>
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>

          <p>
            {isSignup
              ? 'Join Fashion Shop and discover your style.'
              : 'Login to continue shopping with Fashion Shop.'}
          </p>

        </div>

        {/* ======================================
            ERROR AND SUCCESS MESSAGES
        ====================================== */}

        {error && (
          <div className="login-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="login-success" role="status">
            {success}
          </div>
        )}

        {/* ======================================
            LOGIN/SIGNUP FORM
        ====================================== */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* Full name: signup only */}
          {isSignup && (

            <div className="form-group">

              <label htmlFor="login-name">
                Full Name
              </label>

              <input
                id="login-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />

            </div>

          )}

          {/* Email input */}
          <div className="form-group">

            <label htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

          </div>

          {/* Password input */}
          <div className="form-group">

            <label htmlFor="login-password">
              Password
            </label>

            <div className="password-input-wrapper">

              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  isSignup ? 'new-password' : 'current-password'
                }
                minLength={isSignup ? 8 : undefined}
                required
              />

              {/* Show/hide password */}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

            </div>

          </div>

          {/* Confirm password: signup only */}
          {isSignup && (

            <div className="form-group">

              <label htmlFor="confirm-password">
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                autoComplete="new-password"
                required
              />

            </div>

          )}

          {/* Submit button */}
          <button
            type="submit"
            className="login-submit-button"
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isSignup
                ? 'Create Account'
                : 'Login'}
          </button>

        </form>

        {/* ======================================
            SWITCH LOGIN/SIGNUP
        ====================================== */}

        <div className="login-switch">

          <p>
            {isSignup
              ? 'Already have an account?'
              : "Don't have an account?"}

            <button
              type="button"
              onClick={switchMode}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>

          </p>

        </div>

        {/* Security note */}
        <p className="login-security-note">
          🔒 Your account information is handled securely.
        </p>

      </div>

    </div>
  );
}

// ==========================================
// EXPORT LOGIN COMPONENT
// ==========================================

export default Login;
