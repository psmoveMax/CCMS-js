document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("#btn_add").addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("#main_add_form").classList.add("visible");
  });

  document.querySelector("#btn_form_close").addEventListener("click", () => {
    document.querySelector("#main_add_form").classList.remove("visible");
    document.querySelectorAll("input").forEach((el) => (el.value = ""));
  });





  // Поменять поля
  document.querySelector('#main_add_form').addEventListener("submit", async e => {
    e.preventDefault();
    let fio = document.getElementById('fio').value.trim();

    const regular_fio = /([А-Яа-я-.]+)\ ([А-Яа-я-.]+)\ ([А-Яа-я-.]+)/;
    fio = fio.match(regular_fio);

    const name = fio[1];
    const surname = fio[2];
    const lastname = fio[3];




    const response = await fetch('http://localhost:3000/api/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        surname: surname,
        lastname: lastname,
        contacts: {}
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const customer = await response.json();
    console.log(customer)


    e.target.reset();
    cleaningTable();
    renderCustomerTable();
    alert('Добавлен новый клиент');



  });






});

function removeExtendedIco() {
  console.log(this.id);
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

  let arrayInvisibleContacts = Array();
  console.log(customer.contacts);
  for (let i = 0; i < keysContacts.length; i++) {



    const info_text = customer.contacts[i][1];
    let contact = document.createElement("span");




    if (customer.contacts[i][0] == 'mob') {
      contact.setAttribute('id', '');
      contact.setAttribute('class', 'mob_ico');
      contact.setAttribute('info', info_text);
    } else if (customer.contacts[i][0] == 'email') {
      contact.setAttribute('class', 'email_ico');
      contact.setAttribute('info', info_text);
    } else if (customer.contacts[i][0] == 'facebook') {
      contact.setAttribute('class', 'facebook_ico');
      contact.setAttribute('info', info_text);
    } else if (customer.contacts[i][0] == 'vk') {
      contact.setAttribute('class', 'vk_ico');
      contact.setAttribute('info', info_text);
    } else if (customer.contacts[i][0] == 'other') {
      contact.setAttribute('class', 'other_ico');
      contact.setAttribute('info', info_text);
    }
    if (keysContacts.length > 5 && i >= 4) {
      contact.classList.add('invisible_ico');
      let extended_ico = document.createElement("span");

      if (i == 4) {
        extended_ico.classList.add('extended_ico');
        extended_ico.innerText = `+${keysContacts.length - i}`;
        extended_ico.setAttribute('onclick', `removeExtendedIco(${customer.id})`);

        contacts.append(extended_ico);
      }
    }



    // info.append(info_p);

    // contacts_div.append(contact);
    contacts.append(contact);
    console.log(contact);


  }


  const date_create = document.createElement("span");
  const time_create = document.createElement("span");

  const date_change = document.createElement("span");
  const time_change = document.createElement("span");



  change_btn.innerText = 'Изменить';

  change_btn.setAttribute('onclick', `alert('Тут будет изменение клиента')`);
  change_btn.setAttribute('class', 'change_customer');
  actions_td.append(change_btn);

  delete_btn.innerText = 'Удалить';
  delete_btn.setAttribute('class', 'delete_customer');
  delete_btn.setAttribute('onclick', `deleteCustomer(${customer.id})`);
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

  const response = await fetch('http://localhost:3000/api/customers');
  const customerList = await response.json();

  customerList.forEach(student => {
    getCustomerItem(student);
  });


}


async function deleteCustomer(id) {

  const response = await fetch(`http://localhost:3000/api/customers/${id}`, {
    method: 'DELETE'
  });
  cleaningTable();
  renderCustomerTable();
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