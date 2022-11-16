let currentUser
fetchBooks().then(data => {data.forEach(book => {renderBook(book)})})
createUserForm()

function createUserForm() {
    const container = document.getElementById('username')
    const form = document.createElement('form')
    const input = document.createElement('input')
    const button = document.createElement('button')
    input.value = ""
    input.name = "username"
    input.placeholder = "enter username..."
    button.textContent = "submit"
    button.type = "submit"

    form.addEventListener('submit', (e) => {
        e.preventDefault()
        fetchUsers().then(data => {
            const foundUser = data.find(u => u.username === e.target["username"].value)
            if (!foundUser) {
                currentUser = createUser(e.target["username"].value).then(data => data)
            } 

            container.textContent = ""
            container.textContent = `Username: ${e.target["username"].value}`
            currentUser = foundUser
        })
    })

    form.append(input, button)
    container.append(form)
}

function createUser(user) {
    return fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            username: user
        })
    })
    .then(res => res.json())
}

function fetchUsers() {
    return fetch('http://localhost:3000/users').then(res => res.json())
}

function fetchBooks() {
    return fetch('http://localhost:3000/books')
    .then(res => res.json())
}

function renderBook(book) {
    const list = document.getElementById('list')
    const li = document.createElement('li')
    li.textContent = book.title
    li.addEventListener('click', () => {
        showDetails(book)
    })
    list.append(li)
}

function showDetails(book) {
    const container = document.getElementById('show-panel')
    container.textContent = ""
    const header = document.createElement('h5')
    const image = document.createElement('img')
    const description = document.createElement('p')
    const ul = document.createElement('ul')
    const button = document.createElement('button')
    const foundUser = book.users.find(u => u.username === currentUser.username)

    header.textContent = book.title
    image.src = book.img_url
    description.textContent = book.description
    ul.id = "user-likes-list"
    button.textContent = !foundUser ? "like" : "unlike"
    book.users.forEach(user => {addToLikesList(user, ul)})

    button.addEventListener('click', () => {
        likeUnlikeBook(book, book.users, !foundUser ? "add" : "remove")
        button.textContent = !foundUser ? "unlike" : "like"

    })
    container.append(header, image, description, ul, button)
}

function addToLikesList(user, list) {
    const li = document.createElement('li')
    li.textContent = user.username
    list.append(li)
}

function likeUnlikeBook(book, users, action) {
    const userArr = action === "add" ? [...users, currentUser] : users.filter(u => u.username != currentUser.username)

    console.log(userArr)
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "users": userArr
        })
    })
    .then(res => res.json())
    .then(data => {
        const likesList = document.getElementById('user-likes-list')
        likesList.textContent = ""
        data.users.forEach(user => {addToLikesList(user, likesList)})
    })


}
