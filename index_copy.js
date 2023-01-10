// API網址
const BASE_URL = 'https://user-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/users/'


//DOM
const userList = document.querySelector('#user-list')



//model {}
const model = {
  users: [],
  favoriteUsers: [],
}

//view {}
const view = {
  dataPerPage: 12,

  renderUserList(page) {
    //為了分頁器改的
    let startIndex = (page-1) * this.dataPerPage
    let endIndex = startIndex + this.dataPerPage
    //為什麼model.users會越來越少 ?? 
    //物件不能用等於的, 要用Array.copy() Array.from才不會變少?
    let pageUsers = model.users
    const usersByPage = pageUsers.splice(startIndex, endIndex)
    //為了分頁器改的

    let rawHTML = ''
    usersByPage.forEach(user => {
      rawHTML +=`
      <div class="col-sm-3">
        <div class="card">
          <img src="${user.avatar
          }" class="card-img-top" alt="user-photo.">
          <div class="card-body">
            <h5 class="card-title">${user.name + user.surname}  </h5>
            <footer>
              <a href="#" class="btn btn-primary btn-show-info" data-bs-toggle="modal" data-bs-target="#modal-info" data-id="${user.
              id}">More</a>
              <a href="#" class="btn btn-info btn-add-favorite" data-id="${user.
                id}">+</a>
            </footer>
          </div>
        </div>
      </div>  
      `
    })
    userList.innerHTML = rawHTML
  },
  renderPaginator(data) {
    const pageAmount = Math.ceil(data.length / this.dataPerPage)
    let rawHTML = ''
    for (let page = 1; page <= pageAmount; page ++) {
      rawHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
      `
    }
    const paginator = document.querySelector('.pagination')
    paginator.innerHTML = rawHTML
  },
}

//controller{}
const controller = {
  //search
  addSearchEventLisenter () {
    const searchForm = document.querySelector('#search-form')
    searchForm.addEventListener('submit', function onSearchFrom(event) {
      event.preventDefault()
      const searchInput = document.querySelector('#search-input')
      const keyword = searchInput.value.trim().toLowerCase()
      const filteredUsers = model.users.filter(user => 
        user.name.toLowerCase().includes(keyword) || 
        user.surname.toLowerCase().includes(keyword))
      view.renderUserList(filteredUsers)
    })
  },
  addUserCardListener() {
    userList.addEventListener('click', function userListClicked(event) {
      event.preventDefault()
      const id = Number(event.target.dataset.id)
      const user = model.users.find(user => user.id === id)
      if (event.target.classList.contains('btn-show-info')) {
        //這邊不能用this.showModalInfo(id)來呼叫
        //在這邊呼叫showMoalInfo的人是userList, 所以這邊的this是userList. 
        //可以用consloe.log(this)來看看
        controller.showModalInfo(user)
      }
      if (event.target.classList.contains('btn-add-favorite')) {
        controller.addToFavorite(user)
      }
    })
  },
  showModalInfo(user) {
    const modalInfo = document.querySelector('#modal-info')
    modalInfo.innerHTML = `
    <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">${user.name + user.surname}</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body row">
        <div class="col-8">
          <img src="${user.avatar}" alt="modal-photo">
        </div>
        <div class="col-4">
          <p>age: ${user.age}</p>
          <p>gender: ${user.gender}</p>
          <p>region: ${user.region}</p>
          <p>birtheday: ${user.birtheday}</p>
          <p>email: ${user.email}</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger">Remove</button>
      </div>
    </div>
  </div>
    `
  },
  addToFavorite(user) {
    let favoriteUsers = JSON.parse(localStorage.getItem('favoriteUsers')) || []
    favoriteUsers.push(user)
    localStorage.setItem('favoriteUsers',JSON.stringify(favoriteUsers))
  },
  getPage() {
    const paginator = document.querySelector('.pagination')
    paginator.addEventListener('click', function paginatorClicked(event) {
      console.log('clicked');
      event.preventDefault()
      const page = event.target.dataset.page
      console.log(page);
      view.renderUserList(page)
    })
  }
}


axios.get(INDEX_URL).then(res => {
  res.data.results.forEach(user => {
    model.users.push(user) 
  })
  view.renderUserList(1)
  view.renderPaginator(model.users)
})

controller.addSearchEventLisenter ()
controller.addUserCardListener()
controller.getPage()