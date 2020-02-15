// create a new list
document.querySelector('#list-form').onsubmit = event => {
    event.preventDefault();
    fetch('/lists/create', {
        method: 'POST',
        body: JSON.stringify({
            name: document.querySelector('[name="name"]').value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse);
            const listItem = document.createElement('li');
            listItem.innerHTML = jsonResponse['name'];
            document.querySelector('#lists').appendChild(listItem);
            document.querySelector('#error').className = 'hidden';
        })
        .catch(() => {
            document.querySelector('#error').className = '';
        });
    document.querySelector('[name="name"]').value = '';
};

// toggle list to checked / not checked (incl. all child items)
const listCheckboxes = document.querySelectorAll('.listCheckCompleted');
for (let i = 0; i < listCheckboxes.length; i++) {
    const listCheckbox = listCheckboxes[i];
    listCheckbox.onchange = event => {
        const listId = event.target.dataset['id'];
        fetch('/lists/' + listId + '/setCompleted', {
            method: 'POST',
            body: JSON.stringify({
                completed: event.target.checked,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                document.querySelector('#error').className = 'hidden';
            })
            .catch(() => {
                document.querySelector('#error').className = '';
            });
    };
}

// delete a list and all child items
const listDeleteButtons = document.querySelectorAll('.deleteList');
for (let i = 0; i < listDeleteButtons.length; i++) {
    const listDeleteBtn = listDeleteButtons[i];
    listDeleteBtn.onclick = event => {
        const listId = event.target.dataset['id'];
        fetch('/lists/' + listId, {
            method: 'DELETE',
        })
            .then(() => {
                document.querySelector('#error').className = 'hidden';
            })
            .catch(() => {
                document.querySelector('#error').className = '';
            });
    };
}

// toggle todos to checked / not checked
const checkboxes = document.querySelectorAll('.checkCompleted');
for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    checkbox.onchange = event => {
        const todoId = event.target.dataset['id'];
        fetch('/todos/' + todoId + '/setCompleted', {
            method: 'POST',
            body: JSON.stringify({
                completed: event.target.checked,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                document.querySelector('#error').className = 'hidden';
            })
            .catch(() => {
                document.querySelector('#error').className = '';
            });
    };
}

// delete single todos
const todoDeleteButtons = document.querySelectorAll('.deleteTodo');
for (let i = 0; i < todoDeleteButtons.length; i++) {
    const todoDeleteBtn = todoDeleteButtons[i];
    todoDeleteBtn.onclick = event => {
        const todoId = event.target.dataset['id'];
        fetch('/todos/' + todoId, {
            method: 'DELETE',
        })
            .then(() => {
                document.querySelector('#error').className = 'hidden';
                window.location.reload(true);
            })
            .catch(() => {
                document.querySelector('#error').className = '';
            });
    };
}

// create a new todo
document.querySelector('#todo-form').onsubmit = event => {
    event.preventDefault();
    fetch('/todos/create', {
        method: 'POST',
        body: JSON.stringify({
            description: document.querySelector('[name="description"]').value,
            list_id: document.querySelector('#list-select').value,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse);
            const listItem = document.createElement('li');
            listItem.innerHTML = jsonResponse['description'];
            document.querySelector('#todos').appendChild(listItem);
            document.querySelector('#error').className = 'hidden';
        })
        .catch(() => {
            document.querySelector('#error').className = '';
        });
    document.querySelector('[name="description"]').value = '';
};
