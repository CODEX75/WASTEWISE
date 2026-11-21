const DEFAULT_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'cha', password: '1234', role: 'user' }
];

const $ = id => document.getElementById(id);

function getSavedUsers() {
  try {
    const users = JSON.parse(localStorage.getItem('ww_users') || '[]');
    return Array.isArray(users) ? users : [];
  } catch (e) {
    return [];
  }
}
function getAllUsers() { return [...DEFAULT_USERS, ...getSavedUsers()]; }

function show(which) {
  $('loginForm').hidden = which !== 'login';
  $('signupForm').hidden = which !== 'signup';
  $('error').textContent = '';
  $('signupError').textContent = '';
}
$('toSignup').addEventListener('click', e => { e.preventDefault(); show('signup'); });
$('toLogin').addEventListener('click', e => { e.preventDefault(); show('login'); });

function login() {
  const username = $('user').value.trim();
  const password = $('pass').value;
  if (!username || !password) {
    $('error').textContent = 'Please enter your username and password.';
    return;
  }
  const match = getAllUsers().find(user =>
    user.username.toLowerCase() === username.toLowerCase() && user.password === password
  );
  if (!match) {
    $('error').textContent = 'Wrong username or password.';
    return;
  }
  localStorage.setItem('ww_user', match.username);
  const isAdmin = match.username.toLowerCase() === 'admin';
  localStorage.setItem('ww_role', isAdmin ? 'admin' : 'user');
  location.href = isAdmin ? 'admin.html' : '2_front.html';
}

function signup() {
  const username = $('newUser').value.trim();
  const password = $('newPass').value;
  const confirmPassword = $('newPass2').value;
  const error = $('signupError');
  if (!username || !password || !confirmPassword) return error.textContent = 'Please complete all fields.';
  if (username.length < 3) return error.textContent = 'Username must be at least 3 characters.';
  if (username.toLowerCase() === 'admin') return error.textContent = 'That username is reserved.';
  if (password.length < 4) return error.textContent = 'Password must be at least 4 characters.';
  if (password !== confirmPassword) return error.textContent = 'Passwords do not match.';
  if (getAllUsers().some(user => user.username.toLowerCase() === username.toLowerCase()))
    return error.textContent = 'That username is already taken.';

  const saved = getSavedUsers();
  saved.push({ username, password, role: 'user' });
  localStorage.setItem('ww_users', JSON.stringify(saved));
  localStorage.setItem('ww_user', username);
  localStorage.setItem('ww_role', 'user');
  location.href = '2_front.html';
}

$('loginBtn').addEventListener('click', login);
$('signupBtn').addEventListener('click', signup);
$('pass').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
$('newPass2').addEventListener('keydown', e => { if (e.key === 'Enter') signup(); });