export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }
}
// classe que vai conter a lógica dos dados
// como os dados serão estruturados
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search("maykbrito").then(user => console.log(user))
  }
  //a função load vai funcionar para carregamento dos dados
  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  add(username) {
    console.log(username)
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
  }
}
// classe que vai criar a visualização e eventos do HTML
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody")

    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector(".search button")
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input")

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(function (user) {
      const row = this.createRow()

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`
      row.querySelector(".user img").alt = `Imagem de ${user.name}`
      row.querySelector(".user p").textContent = user.name
      row.querySelector(".user span").textContent = user.login
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?")
        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement("tr")

    tr.innerHTML = `
    <td class="user">
      <img
        src="https://github.com/DevVictorDantas.png"
        alt="Imagem de Victor Dantas"
      />
      <a href="https://github.com/DevVictorDantas" target="_blank">
        <p>Victor Dantas</p>
        <span>DevVictorDantas</span>
      </a>
    </td>
    <td class="repositories">12</td>
    <td class="followers">0</td>
    <td>
      <button class="remove">&times;</button>
    </td>
    `
    return tr
  }
  //função removeAllTr remove todas as Tr's do tbody quando
  //a mesma for chamada pela função updade()
  removeAllTr() {
    const tbody = this.root.querySelector("table tbody")

    // forEach faz a função ser executada para cada tr do tbody
    this.tbody.querySelectorAll("tr").forEach(tr => {
      tr.remove()
    })
  }
}
