import { useState } from 'react';                  //lets us store state (form fields, errors, etc)
import { useNavigate } from 'react-router-dom';    //hook to change routes after login

//local imports
import { isValidUsername, isValidPassword } from '../utils/validation';  //our helper functions that enforce the validation rules
import { login } from '../api';                                         //mock login API (stores user in sessionStorage)

//component definition: login page
export default function Login() {
  //STATE HOOKS
  //track what's typed into the username input
  const [username, setUsername] = useState('');

  //track what's typed into the password input
  const [password, setPassword] = useState('');

  //track any error messages
  const [error, setError] = useState('');

  //track whether the form is in "loading" mode (so we can disable the button)
  const [loading, setLoading] = useState(false);

  //useNavigate() gives us a function we can call to change pages after successful login
  const nav = useNavigate();

  // SUBMIT HANDLER
  async function onSubmit(e) {
    e.preventDefault();    //stop the browser from doing a full page refresh
    setError('');          //clear any previous error

    //1st validation: USERNAME
    //sean's rule: must be EXACTLY 8 lowercase letters ("abcdefgh")
    if (!isValidUsername(username)) {
      setError('Username must be exactly 8 lowercase letters.');
      return;  //stop here, don't even check password if username is wrong
    }

    //2nd validation: PASSWORD
    //sean's rule: >=12 characters, must include: >= uppercase letter, >= lowercase letter, >=int, >=symbol
    if (!isValidPassword(password)) {
      setError(
        'Password must be at least 12 characters and include 1 uppercase, 1 lowercase, 1 digit, and 1 symbol.'
      );
      return;  //stop here if password doesn't meet
    }

    try {
      //turn on loading state (so button can indicate it's logging you in)
      setLoading(true);

      //call our fake login API (which just decides a role and puts user in sessionStorage)
      const user = await login(username, password);

      //redirect the user to the dashboard for their role: student = /student, faculty = /faculty, admin = /admin
      nav('/' + user.role);

    } catch {
      //if login() throws an error show message
      setError('You broke something, wtg.');
    } finally {
      //turn off loading state whether login succeeded or failed
      setLoading(false);
    }
  }

  // JSX RENDER (the UI)
  return (
    <div
      style={{                   //center box on page
        maxWidth: 360,          //make the box not too wide
        margin: '80px auto',    //80px from top, centered horizontally
        padding: 24,            //space inside the box
        border: '1px solid #ddd',   //light gray border
        borderRadius: 8             //rounded corners
      }}
    >
      {/* page title */}
      <h2 style={{ marginTop: 0 }}>DegreeAdmin Sign in</h2>

      {/* FORM START */}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        {/* username input */}
        <label>
          Username
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}  //keep state in sync as user types
          />
        </label>

        {/* password input */}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}  //keep state in sync as user types
          />
        </label>

        {/* show error message in red if there is one */}
        {error && <div style={{ color: '#b00020' }}>{error}</div>}

        {/* submit button: disabled while loading, and text changes to "Signing in..." while waiting */}
        <button disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      {/* FORM END */}

      {/* small footer note about session longevity */}
      <p style={{ fontSize: 12, opacity: 0.7, marginTop: 12 }}>
        Sessions end on logout or browser close.
      </p>
    </div>
  );
}