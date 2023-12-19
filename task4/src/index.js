let isEdit = false;
const form = document.querySelector('.info_form');
const header = document.querySelector('.header h3');
const spinner = document.querySelector('.spinner')
async function creatorInfo(){
  const res = await fetch(' http://localhost:3000/creatorInfo');
  const data = await res.json();
  header.textContent = `${data.name} ${data.group} ${data.repo}`
}
function clearAllItems(){
  return getItems().then((data) => data.forEach((res) => deleteItemF(res.id)))
}
async function getItems(){
  spinner.style.display = 'flex';
  const res = await fetch('http://localhost:3000/items');
  const data = await res.json();
  spinner.style.display = 'none';
  return data;
}
async function getItem(id){
  spinner.style.display = 'flex';
  const res = await fetch(`http://localhost:3000/items/${id}`);
  const data = res.json();
  spinner.style.display = 'none';
  return data;
}
async function deleteItemF(id){
  spinner.style.display = 'flex';
  await fetch(`http://localhost:3000/items/${id}`,{
    method: 'DELETE'
  });
  spinner.style.display = 'none';
}
async function editCard(data){
  spinner.style.display = 'flex';
  await fetch(`http://localhost:3000/items/${data.id}`, {
    method:'PATCH',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
  },
  body: JSON.stringify(data)
  }).then((res) =>  {
    spinner.style.display = 'none';
    return res.json()}).catch((e) => console.error(e));
}
async function addItem(data){
  spinner.style.display = 'flex';
  const res = await fetch('http://localhost:3000/items', {
    method:'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
  },
  body:JSON.stringify(data)
  }).then((res) => {
    spinner.style.display = 'none';
    return res.json()}).catch((e) => console.error(e));
  return res;
}
function editItem(data, id) {
    isEdit = true;
    const inputs = form.querySelectorAll("input");
    inputs.forEach((item) => (item.value = data[item.id]));
    form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        const obj = {}; 
        inputs.forEach((item) => (obj[item.id] = item.value));
        obj.id = id;  
        editCard(obj);
        inputs.forEach((item) => (item.value = ""));
        const itemToChange = document.getElementById(data.id);
        itemToChange.querySelector('img').src = obj.img;
        itemToChange.querySelector('.card-title').textContent = obj.title;
        itemToChange.querySelector('.card-text').textContent = `Описание: ${obj.body}`;
        itemToChange.querySelector('.card-text-deliever').textContent = `Поставщик: ${obj.deliever}`;
        itemToChange.querySelector('.id').textContent = `Код товара: ${obj.id}`;
        isEdit = false;
    }, {once:true})
  }
  function deleteItem(id) {
    const item = document.getElementById(id);
    deleteItemF(id);
    item.remove();
  }
  const createButton = (isEdit, title, img, body, id) => {
    if(isEdit){
        const editBtn = document.createElement("button");
        editBtn.addEventListener("click", (e) => {
        e.preventDefault();
        getItem(id).then((res) => editItem(res, id))
        });
        editBtn.append(document.createTextNode("Edit"));
        editBtn.classList.add('btn');
        editBtn.classList.add('btn-primary');
        return editBtn;
    }
    else{
        const deleteBtn = document.createElement("button");
        deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        deleteItem(id);
        });
        deleteBtn.append(document.createTextNode("Delete"));
        deleteBtn.classList.add('btn');
        deleteBtn.classList.add('btn-danger');
        return deleteBtn;
    }
    
  }
function addCard({ title, img, body, id, deliever, code}) {
    const container = document.createElement("div");
    container.style.width = '18rem';
    container.classList.add("card");
    container.id = id;
    //create IMG
    const imgElement = document.createElement('img');
    imgElement.classList.add('card-img-top');
    imgElement.src = img;
    imgElement.style.height = "50%";
    imgElement.style.width = "100%";
    //create body
    const info = document.createElement("div");
    info.classList.add("card-body");
    //title
    const titleContainer = document.createElement("h5");
    titleContainer.classList.add("card-title");
    titleContainer.append(document.createTextNode(title));
    //body text
    const bodyContainer = document.createElement("p");
    bodyContainer.classList.add("card-text");
    bodyContainer.append(document.createTextNode(`Описание: ${body}`));
    //delivere
    const providerContainer = document.createElement("p");
    providerContainer.classList.add("card-text-deliever");
    providerContainer.append(document.createTextNode(`Поставщик: ${deliever}`));
    //id
    const idContainer = document.createElement("p");
    idContainer.classList.add("id");
    idContainer.append(document.createTextNode(`Код товара: ${code}`));

    const buttonContainer = document.createElement("div");
    const editBtn = createButton(true, title, img, body, id, deliever);
    const deleteBtn = createButton(false, title, img, body, id, deliever);
    
    info.append(titleContainer);
    info.append(bodyContainer);
    info.append(providerContainer);
    info.append(idContainer);
    buttonContainer.append(editBtn);
    buttonContainer.append(deleteBtn);
    container.append(imgElement);
    container.append(info);
    container.append(buttonContainer);
    return container;
  }
(function onLoad(){
  const itemsContainer = window.document.querySelector(".info_items");
  getItems().then((items) => items.map((item) => itemsContainer.append(addCard(item)))); 
}());
creatorInfo();
function createItem(obj){
  const cardsContainer = window.document.querySelector(".info_items");
  addItem(obj).then((res) => cardsContainer.append(addCard(res)));
}
const toDefault = document.getElementById('defaultClick');
toDefault.addEventListener('click', () => {
   const data = {
    "id": 1,
    "title": "First item",
    "body": "...description...",
    "img": "https://2ch.hk/hry/src/745033/16817661574300.jpg",
    "code": "1234123123",
    "deliever": "ООО ТрансОбщажный сервис"
  };

  clearAllItems().then(() => addItem(data).then(() => window.location.reload()))
});
form.addEventListener("submit", (evt) => {
    evt.preventDefault();
    if (!isEdit) {
      const obj = {};
      const inputs = evt.target.querySelectorAll("input");
      inputs.forEach((item) => (obj[item.id] = item.value));
      createItem(obj);
      inputs.forEach((item) => (item.value = ""));
    }
  });