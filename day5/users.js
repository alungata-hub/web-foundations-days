
/* 1. Select the HTML elements */
const loadUsersButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusMessage = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

/* 2. Create an array to store users */
let users = [];

/* 3. Write the loadUsers() function here */
async function loadUsers() {
  loadUsersButton.disabled = true;
  statusMessage.textContent = "Loading users...";

  try {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
const data = await response.json();
users = data;

renderUsers(users);

statusMessage.textContent = `Loaded ${users.length} users.`;
console.table(users);
  } catch (error) {
    statusMessage.textContent =
      "Unable to load users. Please try again.";

    console.error("Error loading users:", error);
  } finally {
    loadUsersButton.disabled = false;
  }
}

function renderUsers(list) {
  usersList.textContent = "";

  list.forEach(function (user) {
    const listItem = document.createElement("li");

    const name = document.createElement("h3");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    listItem.append(name, email, city, company);
    usersList.appendChild(listItem);
  });
}

/* 4. Run the function when the button is clicked */
loadUsersButton.addEventListener("click", loadUsers);

filterInput.addEventListener("input", function () {
  const searchText = filterInput.value.trim().toLowerCase();

  const filteredUsers = users.filter(function (user) {
    return user.name.toLowerCase().includes(searchText);
  });

  renderUsers(filteredUsers);
});
