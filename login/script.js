const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const container = document.getElementById('container');

const mongoClient = new MongoClient('mongodb://localhost:27017');
mongoClient.connect((err, db) => {
  if (err) {
    throw err;
  }

  const usersCollection = db.collection('users');

  signUpButton.addEventListener('click', async () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const user = {
      name,
      email,
      password,
    };

    await usersCollection.insertOne(user);

    // Sign up successfully
    alert('Sign up successfully');
    container.classList.remove('auth-active');
  });

  signInButton.addEventListener('click', async () => {
    const email = document.getElementById('signInEmail').value;
    const password = document.getElementById('signInPassword').value;

    const user = await usersCollection.findOne({ email });

    if (!user) {
      // User not found
      alert('User not found');
      return;
    }

    if (user.password !== password) {
      // Invalid password
      alert('Invalid password');
      return;
    }

    // Sign in successfully
    alert('Sign in successfully');
    container.classList.remove('auth-active');
  });
});
