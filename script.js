let addNote = document.querySelector('.plus-btn')
let notesContainer = document.querySelector('.notes-container')
let form = document.querySelector('.form')
let titleInput = document.querySelector('.title')
let contentInput = document.querySelector('.content')
let saveBtn = document.querySelector('#saveBtn')
let data = JSON.parse(localStorage.getItem("data")) || []
let categoryValue = document.querySelector('.category')
// localStorage.clear()

let viewModal = document.getElementById('viewModal')
let viewTitle = document.getElementById('viewTitle')
let viewText = document.getElementById('viewText')
let closeView = document.getElementById('closeView')


function showCard(list = data){
    notesContainer.innerHTML = ""

    // empty state
// ❌ NO NOTES CASE
    if (data.length === 0) {

        notesContainer.classList.add("center-empty")

        notesContainer.innerHTML = `
            <div class="empty">
                <img src="Add notes-pana.svg" height="200px" />
                <p>No Notes yet </p>
            </div>
        `
        return
    }

    // ❌ NO SEARCH / FILTER RESULT
    if (list.length === 0) {

        notesContainer.classList.add("center-empty")

        let search =  document.querySelector('#search').value.trim()

        
      
        if(search){
            // 🔥 FIRST priority
           notesContainer.innerHTML = `
            <div class="empty">
                <p> Ups!...No results found</p>
                <img src="https://cdn-icons-png.flaticon.com/512/7486/7486754.png"/>
            </div>
        `
    
        // “home nahi hoga toh selected category (work/personal) ke andar search hoga beacuse home shows us full list”

        }else if(currentFilter !== 'home'){
notesContainer.innerHTML = `
            <div class="empty">
            <img src="Add notes-pana.svg" height="200px" />
                <p>No notes in this ${currentFilter} </p>
                <p>Start adding some!</p>
            </div>
        `

        }
  return   
  }

    // ✅ REMOVE CENTER MODE WHEN NOTES EXIST
    notesContainer.classList.remove("center-empty")





    list.forEach((item,index)=>{
        let card = document.createElement('div')
        let title = document.createElement('h2')
        let content = document.createElement('p')
        let category = document.createElement('span')

        card.classList.add("card") 

        title.textContent = item.title
        content.textContent = item.content
       


let viewCategory = document.getElementById('viewCategory')
        card.addEventListener('click', function(){

  viewTitle.textContent = item.title
  viewText.textContent = item.content
viewCategory.textContent = "category:"  +  item.category

  viewModal.classList.add('show')

})


let btnGrp = document.createElement('div')
btnGrp.id ="btnGrp"

        let buttons = document.createElement('div')

        buttons.id ="buttons"

        let time = document.createElement('div')

let date = document.createElement('span')
date.textContent = item.date
date.classList.add("date") 




        let remove = document.createElement('button')
        remove.textContent ="🗑️"

        remove.classList.add( "delete")

        remove.addEventListener('click', function(e){

// “Event child se start hota hai aur parent tak bubble karta hai”

            e.stopPropagation()   // 🔥 VERY IMPORTANT

           data =  data.filter(i => i.id !== item.id)

           localStorage.setItem("data", JSON.stringify(data))
           showCard(getFilter())
        })



let edit = document.createElement('button')
edit.textContent ="✎"

edit.classList.add( "edit")

edit.addEventListener('click',function(e){

    e.stopPropagation()   // 🔥 VERY IMPORTANT

 
    let newTitle = prompt("Edit Title",item.title)
    if (newTitle) {
         item.title = newTitle

         localStorage.setItem("data", JSON.stringify(data))
           showCard(getFilter())
    }
 
    let newContent = prompt("Edit Content",item.content)
    if (newContent) {
       item.content = newContent 

         localStorage.setItem("data", JSON.stringify(data))
           showCard(getFilter())
    }

      let newCategory  = prompt("Edit Category", item.category)
      if (newCategory) {
        item.category = newCategory.toLowerCase().trim()

        localStorage.setItem("data", JSON.stringify(data))
        showCard(getFilter())
        
      }

})


card.appendChild(title)
card.appendChild(content)


time.appendChild(date)
buttons.appendChild(remove)
buttons.appendChild(edit)

btnGrp.appendChild(time)
btnGrp.appendChild(buttons)

card.appendChild(btnGrp)
notesContainer.appendChild(card)

    })
}


closeView.addEventListener('click', function(){
  viewModal.classList.remove('show')
})


// add btn and closeBtn
let modalHidden = document.querySelector('.modal-hidden')


let closeBtn = document.querySelector('#closeBtn')

addNote.addEventListener('click', function(){
    modalHidden.classList.add('show')
})

closeBtn.addEventListener('click', function(){
    modalHidden.classList.remove('show')
})

// search + filter combine


function getFilter(){
  let filtered = checkFilter()
  let search = document.querySelector('#search').value.toLowerCase()

  if(search){
    return filtered.filter(i =>
      i.title.toLowerCase().includes(search) ||
      i.content.toLowerCase().includes(search) 
    
    )
    
  }

  return filtered
}


document.querySelector('#search').addEventListener('input', function(){

showCard(getFilter())


} )
  




// // filter
// 🧠 🔥 Golden Rule

// 👉 “Data change ho → UI same filter ke according re-render ho
currentFilter = 'home'

function checkFilter(){
if (currentFilter === 'work'){
  return data.filter(i => i.category === 'work')
}
else if(currentFilter === 'personal'){

return data.filter(i => i.category === 'personal')}

else{
  return data
}
}


let personalBtn = document.querySelector('.personal')
let HomeBtn = document.querySelector('.home')
let workBtn = document.querySelector('.work')
console.log(personalBtn);


personalBtn.addEventListener('click', function(){

  currentFilter ="personal"
  personalBtn.classList.add("activeBtn")
  HomeBtn.classList.remove("activeBtn")
  workBtn.classList.remove("activeBtn")

    document.querySelector('#search').value = ""
  showCard(getFilter())
})


HomeBtn.addEventListener('click', function(){
  currentFilter = "home"
  HomeBtn.classList.add("activeBtn")
  personalBtn.classList.remove("activeBtn")
  workBtn.classList.remove("activeBtn")

    document.querySelector('#search').value = ""
  showCard(getFilter())
})

workBtn.addEventListener('click',function(){
  currentFilter ="work"
  workBtn.classList.add("activeBtn")
  personalBtn.classList.remove("activeBtn")
  HomeBtn.classList.remove("activeBtn")
  
    document.querySelector('#search').value = ""
  showCard(getFilter())
})



saveBtn.addEventListener('click',function(){
    let titleValue = titleInput.value
    let contentValue  = contentInput.value

    if (titleValue === "" || !/[a-zA-Z]/.test(titleValue)) {
      return  alert('please give a valid note')
    }

data.push({
  title: titleValue,
  content: contentValue,
  category: categoryValue.value.toLowerCase().trim(),
  id: Date.now(),
  date:new Date().toLocaleTimeString()
})

localStorage.setItem("data", JSON.stringify(data))

titleInput.value =""
contentInput.value =""
categoryValue.value = ""

 modalHidden.classList.remove('show')
showCard(getFilter())

})

showCard()


// Overlay = ek aisi layer jo poore screen ke upar aa jaye aur background ko cover kare
//✔ category → lowercase needed
// ✔ title/content → optional (kyunki comparison nahi ho raha)
// ✔ search → already handled with .toLowerCase()


// Search always overrides filter

// Matlab:

// Agar user search kar raha hai → humesha search ka message dikhao

// 💡 One-line memory trick

// “User ne type kiya → search important
// User ne sirf filter kiya → category important”

// “home nahi hoga toh selected category (work/personal) ke andar search hoga”


// “Block scope is limited to curly braces and applies to let/const, while local scope refers to variables inside a function. Block scope is more restrictive than function scope.”

// javascript checks first only local scope  var follows local and ignore block


