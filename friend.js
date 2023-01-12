//global變數宣告
const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'


//DOM節點定義
const userList = document.querySelector('#user-list')
const modal = document.querySelector('#modal')
const pagination = document.querySelector('.pagination')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

//model {}
const model = {
  users: [],
  filteredUsers: [],
  friends: [],
  curPage: 1,
}


//view {}
const view = {
  dataPerPage: 12,
  renderUserList(users) {
    let rawHTML = ''
    users.forEach(user => {
      rawHTML +=`
      <div class="col-3">
      <div class="card m-1">
        <img src="${user.avatar}" class="card-img-top" alt="user-photo">
        <div class="card-body">
          <h5 class="card-title">${user.name + user.surname}</h5>
          <a href="#" class="btn btn-primary btn-show-modal" data-bs-toggle="modal" data-bs-target="#modal" data-id="${user.id}">More</a>
          <button class="btn btn-danger btn-remove" data-id="${user.id}">x</button>
        </div>
      </div>
    </div>
      `
    })
    userList.innerHTML = rawHTML
  },
  showUserModal(user) {
    modal.innerHTML= `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body row">
          <div class="modal-photo col-6">
            <img src="${user.avatar}" alt="modal-avatar">
          </div>
          <div class="modal-info col-4">
            <p>age:${user.age}</p>
            <p>gender: ${user.gender}</p>
            <p>birtheday: ${user.birthday}</p>
            <p>region: ${user.region}</p>
            <p>email: ${user.email}</p>
          </div>
        </div>
      </div>
    </div>
    `
  },
  renderPaginator(users) {
    const pageAmount = Math.ceil(users.length / this.dataPerPage)
    let rawHTML = ''
    for (let page = 1; page <= pageAmount; page ++) {
      rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
      `
    }
    pagination.innerHTML = rawHTML
  },

}

//controller {}
const controller = {
  setListenerOnUserList() {
    userList.addEventListener('click', function userListClicked (event) {
      event.preventDefault()
      const id = Number(event.target.dataset.id)
      const user = model.users.find(user => user.id === id)
      if (event.target.classList.contains('btn-show-modal')) {
        view.showUserModal(user)
      }
      if (event.target.classList.contains('btn-add-friend')) {
        controller.addFriend(user)
      }
      if (event.target.classList.contains('btn-remove')) {
        controller.remove(user)
        model.users = [...model.friends]
        view.renderPaginator(model.users)
        view.renderUserList(controller.getUsersByPage(model.curPage))
      }
    })
  },
  setListenerOnPaginator() {
    pagination.addEventListener('click', function paginationClicked(event) {
      const page = Number(event.target.dataset.page)
      model.curPage = page
      view.renderUserList(controller.getUsersByPage(page))
    })
  },
  getUsersByPage(page) {
    const data = model.filteredUsers.length ? model.filteredUsers : model.users
    const startIndex = (page-1) * view.dataPerPage
    const endIndex = startIndex + view.dataPerPage
    const usersInPage = data.slice(startIndex, endIndex)
    return usersInPage
  },
  setListenerOnSearchForm() {
    searchForm.addEventListener('submit', function searchFormSumbitted(event) {
      event.preventDefault()
      const keyword = searchInput.value.trim().toLowerCase()
      model.filteredUsers = model.users.filter(user => 
        user.name.toLowerCase().includes(keyword) || 
        user.surname.toLowerCase().includes(keyword)
        ) 
      view.renderPaginator(model.filteredUsers)
      view.renderUserList(controller.getUsersByPage(1))
    })
  },
  addFriend(user) {
    model.friends = JSON.parse(localStorage.getItem('friends')) || []
    if (friends.some(friend => friend.id === user.id)) {
      alert('加過了')
      return
    }
    model.friends.push(user)
    localStorage.setItem('friends', JSON.stringify(model.friends))
  },
  remove(user) {
    model.friends = JSON.parse(localStorage.getItem('friends'))
    const index = model.friends.findIndex(friend => friend.id === user.id)
    model.friends.splice(index, 1)
    localStorage.setItem('friends', JSON.stringify(model.friends))
  }
}

// mian  主程式
model.users = JSON.parse(localStorage.getItem('friends'))

view.renderUserList(controller.getUsersByPage(1))
view.renderPaginator(model.users)
controller.setListenerOnUserList()
controller.setListenerOnSearchForm()
controller.setListenerOnPaginator()
