const inputName = document.querySelector('#name-input');
const inputPhone = document.querySelector('#phone-input');
const form = document.querySelector('#form');
const formBtn = document.querySelector('#form-btn');
const list = document.querySelector('#list');
const NAME_REGEX = /^[A-Z][a-z]{2,20}$/;
const PHONE_REGEX = /^[0]{1}[42]{1}[12]{1}[426]{1}[0-9]{7}$/;

let nameValidation = false;
let phoneValidation = false;

const validateInput = (input, validation) => {
  // Selecciono el p 
  const helper = input.parentElement.children[2];

  // Verifico las validaciones para quitar el atributo disabled del boton
  if (nameValidation && phoneValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }

  // Valido si el input esta vacio
  // Si la validacion es verdadera
  // Si la validacion es falsa
  if (input.value === '') {
    input.classList.remove('error');
    input.classList.remove('correct');
    helper.classList.remove('show');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('error');
    helper.classList.remove('show');
  } else {
    input.classList.add('error');
    input.classList.remove('correct');
    helper.classList.add('show');
  }
}

const validateEditInput = (input, validation, validationEditName, validationEditPhone, btn) => {
  // Verifico las validaciones para quitar el atributo disabled del boton
  if (validationEditName && validationEditPhone) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }

  // Valido si el input esta vacio
  // Si la validacion es verdadera
  // Si la validacion es falsa
  if (input.value === '') {
    input.classList.remove('error');
    input.classList.remove('correct');
  } else if (validation) {
    input.classList.add('correct');
    input.classList.remove('error');
  } else {
    input.classList.add('error');
    input.classList.remove('correct');
  }
}

inputName.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(inputName.value);
  validateInput(inputName, nameValidation)
});

inputPhone.addEventListener('input', e => {
  phoneValidation = PHONE_REGEX.test(inputPhone.value);
  validateInput(inputPhone, phoneValidation)
});

const user = JSON.parse(localStorage.getItem("user"));
form.addEventListener('submit', async e => {
  e.preventDefault();
  e.preventDefault()
  const responseJSON =  await fetch("http://localhost:3004/todos", {
        method: "POST", 
        headers:{
            "Content-type": "application/json"
        },
        body: JSON.stringify({name: inputName.value, phone:inputPhone.value, user: user.username}),
    });
    const response =  await responseJSON.json()
  const newContact = document.createElement('div');
  newContact.innerHTML = `
  <li class="list-item" id=${response.id}>
    <button class="delete-icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
    <div class="edit-inputs-container">
      <input class="edit-input" type="text" value="${response.name, inputName.value}" readonly>
      <input class="edit-input" type="text" value="${response.phone, inputPhone.value}" readonly>
    </div>
    <button class="edit-icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    </button>
    </li>
  `;
  list.append(newContact);
  inputName.value = "";
  inputPhone.value = "";
  nameValidation = false;
  phoneValidation = false;
  validateInput(inputName);
  validateInput(inputPhone);


  localStorage.setItem('contacts', list.innerHTML);
});
list.addEventListener('click',  async e => {
  if (e.target.closest('.delete-icon')) {
    const id = e.target.closest('.list-item').id; // Accede al elemento '.list-item' más cercano que contiene el ícono de eliminación
  console.log(id);
    await fetch(`http://localhost:3004/todos/${id}`, {
        method: "DELETE", 
    });
    e.target.closest('.list-item').remove(); // Elimina el elemento más cercano de clase '.list-item'
    localStorage.setItem('contacts', list.innerHTML);
    e.target.parentElement.remove()
  }

 if (e.target.closest('.edit-icon')) {
   const editBtn = e.target.closest('.edit-icon');
   const editName = editBtn.parentElement.children[1].children[0];
   const editPhone = editBtn.parentElement.children[1].children[1];

   let editNameValidation = true;
   let editPhoneValidation = true;
    
   if (!editBtn.classList.contains('editando')) {
     editBtn.innerHTML = `
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
       <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
     </svg>
     `
     editBtn.classList.add('editando');
     editName.removeAttribute('readonly');
     editPhone.removeAttribute('readonly');
     editName.classList.add('show-input');
     editPhone.classList.add('show-input');


     editName.addEventListener('input', e => {
       editNameValidation = NAME_REGEX.test(editName.value);
       validateEditInput(editName, editNameValidation, editNameValidation, editPhoneValidation, editBtn)
       

     });
      
     editPhone.addEventListener('input', e => {
       editPhoneValidation = PHONE_REGEX.test(editPhone.value);
       validateEditInput(editPhone, editPhoneValidation, editNameValidation, editPhoneValidation, editBtn)
     });
   } else {
     editBtn.innerHTML = `
     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
       <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
     </svg>
     `
     editBtn.classList.remove('editando');
     editName.setAttribute('readonly', true);
     editPhone.setAttribute('readonly', true);

    //Guardar valor
     editName.setAttribute('value', editName.value);
     editPhone.setAttribute('value', editPhone.value);

     editName.classList.remove('correct');
     editPhone.classList.remove('correct');


     editName.classList.remove('show-input');
     editPhone.classList.remove('show-input');

     localStorage.setItem('contacts', list.innerHTML);
      
     // Obtener el ID del contacto que se está editando
    const contactId = editBtn.parentElement.id;

    // Obtener los nuevos valores del nombre y el número de teléfono
    const updatedName = editName.value;
    const updatedPhone = editPhone.value;

    // Realizar la solicitud de actualización al servidor
    await fetch(`http://localhost:3004/todos/${contactId}`, {
      method: "PUT", 
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ name: updatedName, phone: updatedPhone })
    });
   }
 };
});


const getTodos = async () =>{
  const response = await fetch("http://localhost:3004/todos", {method: "GET"});
  const todos  = await response.json()
  const userTodos  = todos.filter(todo  => todo.user === user.username )
  userTodos.forEach(todo => {
      const listItem = document.createElement("li")
      listItem.innerHTML = `
      <li class="list-item" id=${todo.id}>
      <button class="delete-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      <div class="edit-inputs-container">
        <input class="edit-input" type="text" value="${todo.name}" readonly>
        <input class="edit-input" type="text" value="${todo.phone}" readonly>
      </div>
      <button class="edit-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </button>
      </li>
      `;
    list.append(listItem)
    
  });
}
getTodos()


