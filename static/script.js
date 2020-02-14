// create a new list
document.querySelector("#list-form").onsubmit = event => {
  event.preventDefault();
  fetch("/lists/create", {
    method: "POST",
    body: JSON.stringify({
      name: document.querySelector('[name="name"]').value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse);
      const listItem = document.createElement("li");
      listItem.innerHTML = jsonResponse["name"];
      document.querySelector("#lists").appendChild(listItem);
      document.querySelector("#error").className = "hidden";
    })
    .catch(() => {
      document.querySelector("#error").className = "";
    });
  document.querySelector('[name="name"]').value = "";
};

// toggle todos to checked / not checked
const checkboxes = document.querySelectorAll(".checkCompleted");
for (let i = 0; i < checkboxes.length; i++) {
  const checkbox = checkboxes[i];
  checkbox.onchange = event => {
    const todoId = event.target.dataset["id"];
    fetch("/todos/" + todoId + "/setCompleted", {
      method: "POST",
      body: JSON.stringify({
        completed: event.target.checked
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        document.querySelector("#error").className = "hidden";
      })
      .catch(() => {
        document.querySelector("#error").className = "";
      });
  };
}

// delete single todos
const deleteButtons = document.querySelectorAll(".deleteTodo");
for (let i = 0; i < deleteButtons.length; i++) {
  const deleteBtn = deleteButtons[i];
  deleteBtn.onclick = event => {
    const todoId = event.target.dataset["id"];
    fetch("/todos/" + todoId, {
      method: "DELETE"
    })
      .then(() => {
        document.querySelector("#error").className = "hidden";
      })
      .catch(() => {
        document.querySelector("#error").className = "";
      });
  };
}

// create a new todo
document.querySelector("#todo-form").onsubmit = event => {
  event.preventDefault();
  fetch("/todos/create", {
    method: "POST",
    body: JSON.stringify({
      description: document.querySelector('[name="description"]').value
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(jsonResponse => {
      console.log(jsonResponse);
      const listItem = document.createElement("li");
      listItem.innerHTML = jsonResponse["description"];
      document.querySelector("#todos").appendChild(listItem);
      document.querySelector("#error").className = "hidden";
    })
    .catch(() => {
      document.querySelector("#error").className = "";
    });
  document.querySelector('[name="description"]').value = "";
};
