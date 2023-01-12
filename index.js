//global變數宣告
const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'


//DOM節點定義
const userList = document.querySelector('#user-list')
const modal = document.querySelector('#modal')
const pagination = document.querySelector('.pagination')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const changeMode = document.querySelector('.change-mode')

//model {}
const model = {
  users: [],
  filteredUsers: [],
  curPage: 1
}

//view {}
const view = {
  dataPerPage: 12,
  renderUserList(users) {
    if (changeMode.dataset.mode === 'card-mode') {
      console.log('card-mode');
      let rawHTML = ''
      users.forEach(user => {
        rawHTML +=`
        <div class="col-3">
        <div class="card m-1">
          <img src="${user.avatar}" class="card-img-top" alt="user-photo">
          <div class="card-body">
            <h5 class="card-title">${user.name + user.surname}</h5>
            <a href="#" class="btn btn-primary btn-show-modal" data-bs-toggle="modal" data-bs-target="#modal" data-id="${user.id}">More</a>
            <button class="btn btn-info btn-add-friend" data-id="${user.id}">+</button>
          </div>
        </div>
      </div>
        `
      })  //第一段到這邊
      userList.innerHTML = rawHTML
    } else if (changeMode.dataset.mode === 'list-mode') {
      console.log('list-mode')
      let rawHTML = '<ul class="list-group col-sm-12 mb-2">'
      users.forEach(user => {
        rawHTML += `
        <li class="list-group-item d-flex justify-content-between">
          <div class="col-9"> 
            <h5 class="card-title">${user.name + user.surname}</h5>
          </div>
          <div class="col-3"> 
          <a href="#" class="btn btn-primary btn-show-modal" data-bs-toggle="modal" data-bs-target="#modal" data-id="${user.id}">More</a>
          <button class="btn btn-info btn-add-friend" data-id="${user.id}">+</button>
          </div>
        </li>   
        `
      })
      rawHTML += '</ul>'
      userList.innerHTML = rawHTML
    }
    //寫這裡不行嗎?
    //userList.innerHTML = rawHTML
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
  checkMode(mode) {
    if (changeMode.dataset.mode === mode) {
      return
    } else {
      changeMode.dataset.mode = mode
    }
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
      view.renderUserList(controller.getUsersByPage(model.curPage))
    })
  },
  addFriend(user) {
    const friends = JSON.parse(localStorage.getItem('friends')) || []
    if (friends.some(friend => friend.id === user.id)) {
      alert('加過了')
      return
    }
    friends.push(user)
    localStorage.setItem('friends', JSON.stringify(friends))
  },
  setListenerOnChangeMode() {
    changeMode.addEventListener('click', function changeModeClicked(event) {
      const mode = event.target.dataset.mode
      console.log(mode);
      view.checkMode(mode) 
      view.renderUserList(controller.getUsersByPage(model.curPage))
    })
  }
}

// mian  主程式
axios.get(INDEX_URL).then(res => {
  model.users = [...res.data.results]
  view.renderUserList(controller.getUsersByPage(model.curPage))
  view.renderPaginator(model.users)
})

controller.setListenerOnUserList()
controller.setListenerOnSearchForm()
controller.setListenerOnPaginator()
controller.setListenerOnChangeMode()