const DEFAULT_USERS = [
  { username: 'admin',   password: 'admin123' },
  { username: 'cha',     password: '1234' }
];

const $ = id => document.getElementById(id);

function getSavedUsers(){
  try { return JSON.parse(localStorage.getItem('ww_users')) || []; }
  catch(e){ return []; }
}
function getAllUsers(){ return [...DEFAULT_USERS, ...getSavedUsers()]; }

function show(which){
  $('loginForm').hidden  = which !== 'login';
  $('signupForm').hidden = which !== 'signup';
  $('error').textContent = '';
  $('signupError').textContent = '';
}
$('toSignup').addEventListener('click', e => { e.preventDefault(); show('signup'); });
$('toLogin').addEventListener('click',  e => { e.preventDefault(); show('login'); });

function login(){
  const u = $('user').value.trim();
  const p = $('pass').value;
  const match = getAllUsers().find(x => x.username.toLowerCase() === u.toLowerCase() && x.password === p);

  if (match){
    localStorage.setItem('ww_user', match.username);
    location.href = '2_front.html';
  }if(p == "" && u == ""){
    $('error').textContent = 'Please Input.';
  } if (!match) {
    $('error').textContent = 'Wrong username or password.';
  }
}

function signup(){
  const u  = $('newUser').value.trim();
  const p  = $('newPass').value;
  const p2 = $('newPass2').value;
  const err = $('signupError');

  if (u == "" && p == "" && p2 == "") return err.textContent = 'Please Input.';
  if (u.length < 3)  return err.textContent = 'Username must be at least 3 characters.';
  if (p.length < 4)  return err.textContent = 'Password must be at least 4 characters.';
  if (p !== p2)      return err.textContent = 'Passwords do not match.';
  if (getAllUsers().some(x => x.username.toLowerCase() === u.toLowerCase()))
                     return err.textContent = 'That username is already taken.';

  const saved = getSavedUsers();
  saved.push({ username: u, password: p });
  localStorage.setItem('ww_users', JSON.stringify(saved));
  localStorage.setItem('ww_user', u);
  location.href = '2_front.html';
}

$('loginBtn').addEventListener('click', login);
$('signupBtn').addEventListener('click', signup);
$('pass').addEventListener('keydown',     e => { if (e.key === 'Enter') login(); });
$('newPass2').addEventListener('keydown', e => { if (e.key === 'Enter') signup(); });