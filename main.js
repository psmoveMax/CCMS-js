document.addEventListener("DOMContentLoaded", function () {

  document.querySelector('#btn_save').addEventListener("click", async e => {
    e.preventDefault();
    let name = document.getElementById('name').value.trim();
    let surname = document.getElementById('surname').value.trim();
    let lastname = document.getElementById('lastname').value.trim();


    let contacts = [];

    for (let i = 0; i < document.querySelectorAll('.contacts_select').length; i++) {
      const type = document.querySelectorAll('.contacts_type')[i].value.trim();
      const value = document.querySelectorAll('.contacts_select')[i].value.trim();
      const contactPush = Array();

      contactPush.push(type, value);
      contacts.push(contactPush);
    }





    const response = await fetch('http://localhost:3000/api/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        surname: surname,
        lastname: lastname,
        contacts: contacts
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const customer = await response.json();
    console.log(customer);
    if (customer.hasOwnProperty("errors")) {
      infoModal('Ошибка!', customer);
    } else {
      document.querySelector('#modal_add').style.display = 'none';
      cleaningTable();
      renderCustomerTable();
    }






  });



  function eventAddContact(options_name) {
    const id_contact = `F${Math.random().toString().substr('2', '5')}`;

    const toadd = document.querySelector(`#${options_name}`);
    const div_contacts = document.createElement("div");
    div_contacts.setAttribute('id', `${id_contact}`);
    const select_contact = document.createElement("select");
    const input_contact = document.createElement("input");
    const delete_contact = document.createElement("button");


    div_contacts.classList.add('div_contact');
    select_contact.setAttribute('class', 'contacts_type');

    input_contact.classList.add('contacts_select');
    input_contact.required = true;
    input_contact.setAttribute('placeholder', 'Введите данные контакта');
    delete_contact.type = 'button';
    delete_contact.classList.add('btn', 'del_cont');
    delete_contact.setAttribute('onclick', `deleteContact(${id_contact})`);

    const optionTel = document.createElement("option");
    optionTel.value = 'mob';
    optionTel.innerText = 'Телефон';
    const optionEmail = document.createElement("option");
    optionEmail.value = 'email';
    optionEmail.innerText = 'Email';
    const optionVk = document.createElement("option");
    optionVk.value = 'vk';
    optionVk.innerText = 'VK';
    const optionFacebook = document.createElement("option");
    optionFacebook.value = 'facebook';
    optionFacebook.innerText = 'Facebook';
    const optionOther = document.createElement("option");
    optionOther.value = 'other';
    optionOther.innerText = 'Другое';

    select_contact.append(optionTel);
    select_contact.append(optionEmail);
    select_contact.append(optionVk);
    select_contact.append(optionFacebook);
    select_contact.append(optionOther);


    div_contacts.append(select_contact);
    div_contacts.append(input_contact);
    div_contacts.append(delete_contact);
    toadd.append(div_contacts);
  }

  document.querySelector("#btn_add_contact_add").addEventListener("click", () => {
    if (document.querySelector('#options_add').children.length < 10) {
      eventAddContact('options_add');
      if (document.querySelector('#options_add').children.length == 10) {
        document.querySelector("#btn_add_contact_add").style.display = 'none';
      }
    } else {

    }
  });

  document.querySelector("#btn_add_contact_edit").addEventListener("click", () => {
    if (document.querySelector('#options_edit').children.length < 10) {
      eventAddContact('options_edit');
      if (document.querySelector('#options_edit').children.length == 10) {
        document.querySelector("#btn_add_contact_edit").style.display = 'none';
      }
    } else {

    }


  });
  const modal_add = document.getElementById("modal_add");
  const modal_edit = document.getElementById("modal_edit");
  const modal_delete = document.getElementById("modal_delete");
  const modal_info = document.getElementById("modal_info");
  const btn_add = document.getElementById("btn_add");
  const span_add = document.getElementsByClassName("close")[0];
  const span_edit = document.getElementsByClassName("close")[1];
  const span_delete = document.getElementsByClassName("close")[2];
  const span_info = document.getElementsByClassName("close")[3];
  const bottom_delete = document.getElementsByClassName("close_bottom")[2];
  const bottom_close = document.getElementsByClassName("close_bottom")[0];
  const bottom_info = document.getElementById("btn_close_info");




  btn_add.onclick = function () {
    modal_add.style.display = "block";
  }




  // Когда пользователь нажимает на <span> (x), закройте модальное окно
  span_add.onclick = function () {
    modal_add.style.display = "none";
  }

  span_delete.onclick = function () {
    modal_delete.style.display = "none";
  }

  span_info.onclick = function () {
    modal_info.style.display = "none";
  }

  bottom_delete.onclick = function () {
    modal_delete.style.display = "none";
  }

  bottom_info.onclick = function () {
    modal_info.style.display = "none";
  }

  span_edit.onclick = function () {
    modal_edit.style.display = "none";
    removeContact();
  }



  bottom_close.onclick = function () {
    modal_add.style.display = "none";
  }

  /*
  // Когда пользователь щелкает в любом месте за пределами модального, закройте его
  window.onclick = function (event) {
    if (event.target == modal_add || event.target == modal_edit || event.target == modal_delete) {
      modal_add.style.display = "none";
      modal_edit.style.display = "none";
      modal_delete.style.display = "none";
      removeContact();
    }
  }
  */







});
function infoModal(header, text, mode = 'norm') {



  const modal_info = document.getElementById("modal_info");
  const form = document.querySelector('.form-info');
  modal_info.style.display = 'block';
  document.querySelector('#info_header').innerText = header;
  console.log(form.children.length);
  let length = form.children.length;

  //Очистка формы
  if (length > 0) {
    for (let i = 0; i < length; i++) {
      console.log('ERASING');
      console.log(form.children);
      console.log(form.children[0]);
      form.children[0].remove();
    }
  }

  if (mode == 'critical') {
    document.querySelector('#btn_close_info').setAttribute('onclick', 'location.reload()');
    document.querySelector('#btn_close_info').innerText = 'Повторить попытку соединения';
  }

  if (text.hasOwnProperty("errors")) {
    for (let i = 0; i < text['errors'].length; i++) {
      const select_contact = document.createElement("p");
      select_contact.innerText = `${i + 1}) ${text['errors'][i]['message']}`;
      form.append(select_contact);
    }
  } else {
    const select_contact = document.createElement("p");
    select_contact.innerText = text;
    form.append(select_contact);
  }



}

function removeContact() {
  let lengthOptions = document.querySelector('#options_edit').children.length;
  for (let i = lengthOptions; i > 0; i--) {
    document.querySelector('#options_edit').children[i - 1].remove();

  }
}

function deleteContact(id) {


  document.getElementById(`${id.id}`).remove();

  if (document.querySelector('#options_add').children.length < 10) {
    document.querySelector('#btn_add_contact_add').style.display = 'block';
  }

  if (document.querySelector('#options_edit').children.length < 10) {
    document.querySelector('#btn_add_contact_edit').style.display = 'block';
  }

}


function removeExtendedIco(id) {
  const allId = document.getElementsByClassName(id);
  for (let i = 0; i < allId.length; i++) {
    if (allId[i].classList.contains('invisible_ico')) {
      allId[i].classList.remove('invisible_ico');
    } else if (allId[i].classList.contains('extended_ico')) {
      allId[i].remove();
      i--;
    }
  }


}

function getCustomerItem(customer) {
  const table = document.querySelector('#main_table')['tBodies'][0];

  const table_list = document.createElement("tr");
  const id = document.createElement("td");
  const fio = document.createElement("th");
  const date_td = document.createElement("td");
  const time_td = document.createElement("th");
  const contacts = document.createElement("th");
  const actions_td = document.createElement("td");
  const delete_btn = document.createElement("a");
  const change_btn = document.createElement("a");



  const keysContacts = Object.keys(customer.contacts);

  contacts.setAttribute('style', 'width:140px');

  for (let i = 0; i < keysContacts.length; i++) {



    const info_text = customer.contacts[i][1];
    let contact = document.createElement("span");




    if (customer.contacts[i][0] == 'mob') {
      contact.classList.add('mob_ico', `${customer.id}`);
      contact.setAttribute('info', info_text);
    } else if (customer.contacts[i][0] == 'email') {
      contact.classList.add('email_ico', `${customer.id}`);
      contact.setAttribute('info', info_text);
    } else if (customer.contacts[i][0] == 'facebook') {
      contact.classList.add('facebook_ico', `${customer.id}`);
      contact.setAttribute('info', info_text);
    } else if (customer.contacts[i][0] == 'vk') {
      contact.classList.add('vk_ico', `${customer.id}`);
      contact.setAttribute('info', info_text);
    } else if (customer.contacts[i][0] == 'other') {
      contact.classList.add('other_ico', `${customer.id}`);
      contact.setAttribute('info', info_text);
    }
    if (keysContacts.length > 5 && i >= 4) {
      contact.classList.add('invisible_ico');
      let extended_ico = document.createElement("span");

      if (i == 4) {
        extended_ico.classList.add('extended_ico', `${customer.id}`);
        extended_ico.innerText = `+${keysContacts.length - i}`;
        extended_ico.setAttribute('onclick', `removeExtendedIco(${customer.id})`);

        contacts.append(extended_ico);
      }
    }




    contacts.append(contact);


  }


  const date_create = document.createElement("span");
  const time_create = document.createElement("span");

  const date_change = document.createElement("span");
  const time_change = document.createElement("span");



  change_btn.innerText = 'Изменить';

  change_btn.setAttribute('onclick', `changeCustomer(${customer.id})`);
  change_btn.setAttribute('class', 'change_customer');
  actions_td.append(change_btn);

  delete_btn.innerText = 'Удалить';
  delete_btn.setAttribute('class', 'delete_customer');
  let customer_id = customer.id;
  customer_id = String(customer.id);
  delete_btn.setAttribute('onclick', `deleteCustomer(${customer_id})`);
  actions_td.append(delete_btn);

  const createAt = new Date(customer.createdAt);
  const createHour = String(createAt.getHours()).padStart(2, '0');
  const createMinute = String(createAt.getMinutes()).padStart(2, '0');

  const updateAt = new Date(customer.updatedAt);
  const updateHour = String(updateAt.getHours()).padStart(2, '0');
  const updateMinute = String(updateAt.getMinutes()).padStart(2, '0');




  id.innerHTML = `${customer.id}`;
  id.style = 'color: #B0B0B0';
  fio.innerHTML = `${customer.name} ${customer.surname} ${customer.lastname}`;

  date_create.setAttribute('class', 'date_span');
  time_create.setAttribute('class', 'time_span');
  date_create.innerHTML = `${new Date(customer.createdAt).toLocaleDateString('ru-RU')} `;
  time_create.innerHTML = `${createHour}:${createMinute}`;


  date_change.setAttribute('class', 'date_span');
  time_change.setAttribute('class', 'time_span');
  date_change.innerHTML = `${new Date(customer.updatedAt).toLocaleDateString('ru-RU')} `;
  time_change.innerHTML = `${updateHour}:${updateMinute}`;




  date_td.append(date_create);
  date_td.append(time_create);

  time_td.append(date_change);
  time_td.append(time_change);


  table_list.append(id);
  table_list.append(fio);
  table_list.append(date_td);
  table_list.append(time_td);

  table_list.append(contacts);
  table_list.append(actions_td);

  table.appendChild(table_list);


}


async function changeCustomer(id) {
  const modal_edit = document.getElementById("modal_edit");
  const btn_delete = document.querySelectorAll('.close_bottom')[1];
  const customer_id = document.getElementById("modal_name_id");

  const customer_name = document.getElementById("name_edit");
  const customer_surname = document.getElementById("surname_edit");
  const customer_lastname = document.getElementById("lastname_edit");

  const btn_resave = document.getElementById("btn_resave");

  modal_edit.style.display = "block";
  btn_delete.setAttribute('onclick', `modalEditDelete(${id})`);
  customer_id.innerText = `ID: ${id}`;


  const customer = await renderCustomer(id);
  customer_name.value = customer.name;
  customer_surname.value = customer.surname;
  customer_lastname.value = customer.lastname;
  customer_contacts = customer.contacts;




  for (let i = 0; i < customer_contacts.length; i++) {
    addContact(customer.contacts[i]);
  }

  function addContact(customer) {
    const id_contact = `F${Math.random().toString().substr('2', '5')}`;

    const toadd = document.querySelector('#options_edit');
    const div_contacts = document.createElement("div");
    div_contacts.setAttribute('id', `${id_contact}`);
    const select_contact = document.createElement("select");
    const input_contact = document.createElement("input");
    const delete_contact = document.createElement("button");


    div_contacts.classList.add('div_contact');
    select_contact.setAttribute('class', 'contacts_type');

    input_contact.classList.add('contacts_select');
    input_contact.setAttribute('placeholder', 'Введите данные контакта');
    delete_contact.type = 'button';
    delete_contact.classList.add('btn', 'del_cont');
    delete_contact.setAttribute('onclick', `deleteContact(${id_contact})`);

    const optionTel = document.createElement("option");
    optionTel.value = 'mob';
    optionTel.innerText = 'Телефон';
    const optionEmail = document.createElement("option");
    optionEmail.value = 'email';
    optionEmail.innerText = 'Email';
    const optionVk = document.createElement("option");
    optionVk.value = 'vk';
    optionVk.innerText = 'VK';
    const optionFacebook = document.createElement("option");
    optionFacebook.value = 'facebook';
    optionFacebook.innerText = 'Facebook';
    const optionOther = document.createElement("option");
    optionOther.value = 'other';
    optionOther.innerText = 'Другое';

    select_contact.append(optionTel);
    select_contact.append(optionEmail);
    select_contact.append(optionVk);
    select_contact.append(optionFacebook);
    select_contact.append(optionOther);


    div_contacts.append(select_contact);
    div_contacts.append(input_contact);
    div_contacts.append(delete_contact);
    toadd.append(div_contacts);



    for (let k = 0; k < select_contact.options.length; k++) {


      input_contact.value = customer[1];
      if (select_contact.options[k].value == customer[0].toLowerCase()) {
        select_contact.selectedIndex = k;
        break;
      }
    }


  }


  btn_resave.onclick = async function () {

    let contacts = [];

    for (let i = 0; i < document.querySelectorAll('.contacts_select').length; i++) {
      const type = document.querySelectorAll('.contacts_type')[i].value.trim();
      const value = document.querySelectorAll('.contacts_select')[i].value.trim();
      const contactPush = Array();
      contactPush.push(type, value);
      contacts.push(contactPush);

    }

    const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: customer_name.value,
        surname: customer_surname.value,
        lastname: customer_lastname.value,
        contacts: contacts
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    document.getElementById("modal_edit").style.display = "none";
    removeContact();
    cleaningTable();
    renderCustomerTable();
  }


}

async function modalEditDelete(id) {



  document.getElementById("modal_edit").style.display = "none";

  const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
    method: 'DELETE'
  });


  cleaningTable();
  renderCustomerTable();



}



renderCustomerTable();

function cleaningTable() {
  let count_current = document.querySelector('#main_table')['tBodies'][0].childElementCount;

  if (count_current != 1) {
    while (count_current != 1) {
      document.querySelector('#main_table')['tBodies'][0].children[count_current - 1].remove();
      count_current = document.querySelector('#main_table')['tBodies'][0].childElementCount;
    }
  }
}


async function renderCustomerTable() {

  await fetch('http://localhost:3000/api/customers')
    .then((response) => {
      // Проверяем успешность запроса и выкидываем ошибку
      if (!response.ok) {
        throw new Error('Error occurred!')
      }

      return response.json()
    })
    // Теперь попадём сюда, т.к выбросили ошибку
    .catch((err) => {
      const error = 'Невозможно подключиться к серверу, повторите попытку'
      infoModal('Ошибка!', error, 'critical');
    }) // Error: Error occurred!

  const response = await fetch('http://localhost:3000/api/customers');
  const customerList = await response.json();
  customerList.forEach(student => {
    getCustomerItem(student);
  });


}


async function renderCustomer(id) {

  const response = await fetch(`http://localhost:3000/api/customers/${id}`);
  const customerList = await response.json();

  return customerList;


}


async function deleteCustomer(id) {
  const modal_delete = document.getElementById("modal_delete");
  const delete_button = document.querySelector('#btn_delete_customer');
  modal_delete.style.display = "block";

  delete_button.onclick = async function () {
    modal_delete.style.display = "none";

    const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
      method: 'DELETE'
    });


    cleaningTable();
    renderCustomerTable();
  }




}

// Этап 5. Создайте функцию сортировки массива студентов и добавьте события кликов на соответствующие колонки.
function sort_func(sort_name) {
  let id;

  const regular_birth = /(\d{2}).(\d{2}).(\d{4})/;
  const regular_learn = /(\d{4})-(\d{4})/gm;
  switch (sort_name) {
    case 'fio':
      id = 'sort_fio';
      break;
    case 'fakultet':
      id = 'sort_fak';
      break;
    case 'birth':
      id = 'sort_birth';
      break;
    case 'learn':
      id = 'sort_learn';
      break;
  }




  for (let i = 0; i < document.querySelector('#header_table').children.length; i++) {
    if (document.querySelector('#header_table').children[i].children[0].innerHTML == '▼') {
      if (id != document.querySelector('#header_table').children[i].id) {
        document.querySelector('#header_table').children[i].children[0].innerHTML = 'ᐁ';
      }
    }
  }

  if (sort_name == 'fio') {
    if (document.querySelector('#sort_fio_activity').innerHTML == 'ᐁ') {
      let table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("main_table");
      switching = true;

      while (switching) {

        switching = false;
        rows = table.getElementsByTagName("TR");

        for (i = 2; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          x = rows[i].getElementsByTagName("TH")[0];
          y = rows[i + 1].getElementsByTagName("TH")[0];
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
      document.querySelector('#sort_fio_activity').innerHTML = '▼'
    } else {
      if (document.getElementById("search_fio").value == '' &&
        document.getElementById("search_fakultet").value == '' &&
        document.getElementById("search_year_start").value == '' &&
        document.getElementById("search_year_end").value == '') {
        cleaningTable();
        renderCustomerTable();
        document.querySelector('#sort_fio_activity').innerHTML = 'ᐁ';
      } else {
        document.getElementById("search_fio").value = '';
        document.getElementById("search_fakultet").value = '';
        document.getElementById("search_year_start").value = '';
        document.getElementById("search_year_end").value = '';
        cleaningTable();
        renderCustomerTable();
        document.querySelector('#sort_fio_activity').innerHTML = 'ᐁ';
      }
    }
  } else if (sort_name == 'fakultet') {
    if (document.querySelector('#sort_fak_activity').innerHTML == 'ᐁ') {
      let table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("main_table");
      switching = true;

      while (switching) {

        switching = false;
        rows = table.getElementsByTagName("TR");

        for (i = 2; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          x = rows[i].getElementsByTagName("TD")[0];
          y = rows[i + 1].getElementsByTagName("TD")[0];
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
      document.querySelector('#sort_fak_activity').innerHTML = '▼'
    } else {
      if (document.getElementById("search_fio").value == '' &&
        document.getElementById("search_fakultet").value == '' &&
        document.getElementById("search_year_start").value == '' &&
        document.getElementById("search_year_end").value == '') {
        cleaningTable();
        renderCustomerTable();
        document.querySelector('#sort_fak_activity').innerHTML = 'ᐁ';
      } else {
        document.getElementById("search_fio").value = '';
        document.getElementById("search_fakultet").value = '';
        document.getElementById("search_year_start").value = '';
        document.getElementById("search_year_end").value = '';
        cleaningTable();
        renderCustomerTable();
        document.querySelector('#sort_fak_activity').innerHTML = 'ᐁ';
      }
    }
  } else if (sort_name == 'birth') {

    if (document.querySelector('#sort_birth_activity').innerHTML == 'ᐁ') {
      let table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("main_table");
      switching = true;

      while (switching) {

        switching = false;
        rows = table.getElementsByTagName("TR");

        for (i = 2; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          x = rows[i].getElementsByTagName("TD")[1];
          y = rows[i + 1].getElementsByTagName("TD")[1];
          let xDate = new Date(`${x.innerHTML.match(regular_birth)[2]},${x.innerHTML.match(regular_birth)[1]},${x.innerHTML.match(regular_birth)[3]}`).getTime();
          let yDate = new Date(`${y.innerHTML.match(regular_birth)[2]},${y.innerHTML.match(regular_birth)[1]},${y.innerHTML.match(regular_birth)[3]}`).getTime();

          if (xDate > yDate) {
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
      document.querySelector('#sort_birth_activity').innerHTML = '▼'
    } else {
      if (document.getElementById("search_fio").value == '' &&
        document.getElementById("search_fakultet").value == '' &&
        document.getElementById("search_year_start").value == '' &&
        document.getElementById("search_year_end").value == '') {
        cleaningTable();
        renderCustomerTable();
        document.querySelector('#sort_birth_activity').innerHTML = 'ᐁ';
      } else {
        document.getElementById("search_fio").value = '';
        document.getElementById("search_fakultet").value = '';
        document.getElementById("search_year_start").value = '';
        document.getElementById("search_year_end").value = '';
        cleaningTable();
        renderCustomerTable();
        document.querySelector('#sort_birth_activity').innerHTML = 'ᐁ';
      }


    }
  } else if (sort_name == 'learn') {
    if (document.querySelector('#sort_learn_activity').innerHTML == 'ᐁ') {
      let table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("main_table");
      switching = true;

      while (switching) {

        switching = false;
        rows = table.getElementsByTagName("TR");

        for (i = 2; i < (rows.length - 1); i++) {
          shouldSwitch = false;
          x = rows[i].getElementsByTagName("TD")[2];
          y = rows[i + 1].getElementsByTagName("TD")[2];
          let xDate = x.innerHTML.match(regular_learn);
          let yDate = y.innerHTML.match(regular_learn);
          if (xDate != null && yDate != null) {
            if (xDate > yDate) {
              shouldSwitch = true;
              break;
            }
          } else if (xDate != null && yDate == null) {
            shouldSwitch = true;
            break;
          }

        }
        if (shouldSwitch) {
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
      document.querySelector('#sort_learn_activity').innerHTML = '▼'
    } else {
      if (document.getElementById("search_fio").value == '' &&
        document.getElementById("search_fakultet").value == '' &&
        document.getElementById("search_year_start").value == '' &&
        document.getElementById("search_year_end").value == '') {
        cleaningTable();
        renderCustomerTable();
        document.querySelector('#sort_learn_activity').innerHTML = 'ᐁ';
      } else {
        document.getElementById("search_fio").value = '';
        document.getElementById("search_fakultet").value = '';
        document.getElementById("search_year_start").value = '';
        document.getElementById("search_year_end").value = '';
        cleaningTable();
        renderCustomerTable();
        document.querySelector('#sort_learn_activity').innerHTML = 'ᐁ';
      }
    }
  }




}




function search_func() {
  let fio_input, table, tr, i;
  fio_input = document.getElementById("search_fio");
  filter_fio = fio_input.value.toUpperCase();


  table = document.getElementById("main_table");
  tr = table.getElementsByTagName("tr");
  for (i = 1; i < tr.length; i++) {
    th_fio = tr[i].getElementsByTagName("th")[0];
    if (th_fio) {
      if (th_fio.innerHTML.toUpperCase().indexOf(filter_fio) > -1) {

        tr[i].style.display = "";
      }
      else {
        tr[i].style.display = "none";
      }
    }
  }

}