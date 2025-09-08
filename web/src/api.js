//base url for api calls
//if there's an environment variable called REACT_APP_API_URL, use that
//otherwise, fall back to localhost:8080 (common spring boot port)
//right now, it's not really used because we fake login
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

//mock login function
//in the future this should POST to `${BASE}/auth/login` with {username, password}
//for now, it just pretends to check login and assigns a role based on username
export async function login(username, password) {
  //fake network delay (300ms) so the ui behaves like it's waiting for a server
  await new Promise(r => setTimeout(r, 300));

  //dummy role assignment:
  //usernames starting with "s" are student
  //starting with "f" are faculty
  //starting with "a" are admin
  //else: student ig
  const role = username.startsWith('s')
    ? 'student'
    : username.startsWith('f')
    ? 'faculty'
    : username.startsWith('a')
    ? 'admin'
    : 'student';

  //build a user object with username and role
  const user = { username, role };

  //save it in sessionStorage (so it persists until the tab/browser closes)
  //this mimics what a real token would do
  sessionStorage.setItem('user', JSON.stringify(user));

  //return the fake user object to whoever called login()
  return user;
}

//get the currently "logged in" user
//reads from sessionStorage, parses JSON, or returns null if no user is logged in
export function getCurrentUser() {
  const raw = sessionStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

//log out the user by removing them from sessionStorage
//future version would also tell the backend to kill the token
export function logout() {
  sessionStorage.removeItem('user');
}