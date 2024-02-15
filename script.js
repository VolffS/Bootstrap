//var requestURL= "https://robohash.org/John Doe?set=set4";
let requestURLTable= "http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}&position=[\"junior\",\"middle\",\"senior\"]&status=[\"archive\",\"onboarding\",\"active\",\"awaiting\"]&role=[\"Engineer\", \"Designer\", \"Product Manager\", \"System Analytic\",\"Consultant\"]&salary={numberLength|3}";
let dataTable = [];
let sortedTable = [];
let selectRow = [];
let arrOptionStatus = ["active", "onboarding", "awaiting", "archive"];
let arrOptionPosition = ["senior", "junior", "middle"];
let modifyCells = false;
let sortSelectStatus ="";


fetch(requestURLTable)
    .then(response => response.json())
    .then( arrRow=> {
        dataTable = arrRow;
        refreshTable(dataTable);
        fillStatusSearch();
    });

function refreshTable(arrRow) {
    const table = document.querySelector("tbody");

    table.textContent="";

    let idRow = 0;

    for (const arrRowElement of arrRow) {
        // creatRowInTable(idRow,`${arrRowElement.firstName} ${arrRowElement.lastName}`,arrRowElement.email,
        //     arrRowElement.role, arrRowElement.phone, arrRowElement.status, arrRowElement.position);
        createRowInTablePattern(idRow,`${arrRowElement.firstName} ${arrRowElement.lastName}`,arrRowElement.email,
            arrRowElement.role, arrRowElement.phone, arrRowElement.status, arrRowElement.position);
        idRow++;
    }
    addEventCheckBox();
    addEventBtnModify();
}

function refreshEventInModifyCells(row) {
    const btnModify = row.querySelector(`.btn-modify`);
    const checkBoxRow = row.querySelector( "input[type='checkbox']");

    btnModify.addEventListener("click", (ev)=>{
        modifyRow(ev.target);
    });

    checkBoxRow.addEventListener("change", (ev)=>{
        addSelectRow(ev.target);
    });
}

function addEventCheckBox() {
    const checkBoxRow = document.querySelectorAll("input[type='checkbox'] ");

    for (const checkBoxRowElement of checkBoxRow) {
        checkBoxRowElement.addEventListener("change", (ev)=>{
            addSelectRow(ev.target);
        });
    }
}

function addEventBtnModify() {
    const btnModify = document.getElementsByClassName("btn-modify");

    for (const btnModifyElement of btnModify) {
        btnModifyElement.addEventListener("click", (ev)=>{
            modifyRow(ev.target);
        });
    }
}

function createDocHTMLPattern(id, name, email,title,phone,status, position) {
    let patternHtml = `
    <tr id="${id}">
        ${createCellsTable( name, email,title,phone,status, position)}
    </tr>`;

    return patternHtml;
}

function createCellsTable( name, email,title,phone,status, position) {
    let cells = `
        <td>
                <div class="d-flex flex-row align-items-center gap-2 ">
                    <img class="rounded-circle border border-secondary-subtle" 
                    src="https://robohash.org/${name}?set=set4" 
                    alt="" style="height: 50px;">
                    <div class="d-flex flex-column ">
                        <dt>${name}</dt>
                        <p class="m-0" >${email}</p>
                    </div>
                </div>
            </td>
            <td> <p class="m-0">${title}</p></td>
            <td> <p class="m-0">${phone}</p></td>
            <td> <p class="m-0 badge  text-center rounded-pill ${changeStatus(status).join(" ")}" >${formatFirstCharUp(status)}</p></td>
            <td> <p class="m-0 " >${formatFirstCharUp(position)}</p></td>
            <td class="delete__checkBox"> <input type="checkbox"></td>
            <td> 
                <button type="button" class="btn btn-outline-primary btn-modify">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                  </svg>          
                </button>
            </td>
    `;
    return cells;
}

function createRowInTablePattern(id, name, email,title,phone,status, position) {
    const table = document.querySelector("tbody");

    modifyCells = false;

    table.innerHTML += createDocHTMLPattern(id, name, email,title,phone,status, position);
}

function modifyRow(element) {
    if (!modifyCells) {
        modifyCells = true;

        let elementRow = findParentRow(element);

        elementRow.classList.add("was-validated");

        elementRow.innerHTML = `        
        <td>
            <div class="d-flex flex-row align-items-center gap-2 ">
                <img class="rounded-circle border border-secondary-subtle" 
                src="https://robohash.org/${name}?set=set4" 
                alt="" style="height: 50px;">
                <div class="d-flex flex-column ">                
                    <div class="mb-1 form-floating">
                        <input type="text" class="form-control " id="first-name" name="firstName" placeholder="" value="${dataTable[elementRow.id].firstName}" required>
                        <label for="first-name" class="col-form-label">Имя</label>                        
                    </div>  
                    <div class="mb-1 form-floating">
                        <input type="text" class="form-control " id="last-name" name="lastName" placeholder="" value="${dataTable[elementRow.id].lastName}" required>
                        <label for="last-name" class="col-form-label">Фамилия</label>                        
                    </div>  
                    <div class="mb-1 form-floating">
                        <input type="text" class="form-control " id="email" name="email" placeholder="" value="${dataTable[elementRow.id].email}" required>
                        <label for="email" class="col-form-label">Email</label>                        
                    </div>                                     
                </div>
            </div>
        </td>
        <td> <div class="mb-1 form-floating">
                        <input type="text" class="form-control " id="title" name="role" placeholder="" value="${dataTable[elementRow.id].role}" required>
                        <label for="title" class="col-form-label">Должность</label>                        
                    </div></td>
        <td> <div class="mb-1 form-floating ">
                        <input type="text" class="form-control " id="phone" name="phone"
                               maxlength="10" pattern="[0-9]{10}" placeholder="(454)328-2495" value="${phoneToNumer(dataTable[elementRow.id].phone)}" required>
                        <label for="phone" class="col-form-label">Phone</label>                        
                    </div></td>
        <td> <div class="mb-1 form-floating">
                        <select class="form-select" id="status" name="status"">                        
                            ${addSelectOption(arrOptionStatus, dataTable[elementRow.id].status)}                            
                        </select>
                        <label for="status" class="col-form-label">Status</label>
                    </div></td>
        <td>  <div class="mb-1 form-floating">
                        <select class="form-select" id="position" name="position">
                            ${addSelectOption(arrOptionPosition, dataTable[elementRow.id].position)}
                        </select>
                        <label for="position" class="col-form-label">Position</label>
                    </div></td>
        <td class="delete__checkBox"> <input type="checkbox"></td>
        <td> 
            <button type="button" class="btn btn-success" id="btn-modifySuccess">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"></path>
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path>
                </svg>             
              </button>
              <button type="button" class="btn btn-outline-danger" id="btn-modifyCancel">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-x" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"></path>
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"></path>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"></path>
                </svg>               
              </button>
        </td>` ;

        changeStyleCSS('.btn-modify', 'opacity', '.4');

        const btnCanselModify = document.getElementById("btn-modifyCancel");
        const btnModifySuccess = document.getElementById("btn-modifySuccess");

        btnCanselModify.addEventListener("click", (ev)=> {
            canselModify(ev.target)
        })

        btnModifySuccess.addEventListener("click", (ev)=> {
            successModify(ev.target)
        })
    };
};

function canselModify(element) {
    modifyCells = false;

    let row = findParentRow(element);

    row.innerHTML = createCellsTable( `${dataTable[row.id].firstName} ${dataTable[row.id].lastName}`,dataTable[row.id].email,
        dataTable[row.id].role, dataTable[row.id].phone, dataTable[row.id].status, dataTable[row.id].position);

    refreshEventInModifyCells(row);
    changeStyleCSS('.btn-modify', 'opacity', '1');
};

function successModify(element) {
    modifyCells = false;

    let row = findParentRow(element);

    const InputAll = row.querySelectorAll('input');

    if (checkAllInputFull(InputAll)) {
        let allValue = row.querySelectorAll("input, select");
        let employees = new Object();

        for (const inputElement of allValue) {
            employees[inputElement.name] = inputElement.value;
        }

        row.innerHTML = createCellsTable( `${employees.firstName} ${employees.lastName}`,employees.email,
            employees.role, employees.phone = toPhone(employees.phone), employees.status, employees.position);

        dataTable[row.id] = employees;

        refreshEventInModifyCells(row);
        changeStyleCSS('.btn-modify', 'opacity', '1');
    };
};

function addSelectOption(arrOption) {

    let listOption = ``;

    for (const arrOptionElement of arrOption) {
        listOption += `<option value="${arrOptionElement}">${formatFirstCharUp(arrOptionElement)}</option>`;
    };

    return listOption;

};
function addSelectOption(arrOption, selectOption) {

    let listOption = ``;

    for (const arrOptionElement of arrOption) {
        if (arrOptionElement === selectOption) {
            listOption += `<option value="${arrOptionElement}" selected>${formatFirstCharUp(arrOptionElement)}</option>`;
        } else {
            listOption += `<option value="${arrOptionElement}">${formatFirstCharUp(arrOptionElement)}</option>`;
        };
    };

    return listOption;

};

function creatRowInTable(id, name, email,title,phone,status, position) {
    const table = document.querySelector("tbody");
    const row = createElement("tr", "id", id);
    const nameRow = createNameRow(name,email);
    const titleRow = createInformationInRow(title);
    const phoneRow = createInformationInRow(phone);
    const statusRow = createInformationStatusInRow(status);
    const positionRow = createInformationInRow(position);

    let tableDataCell = createElement("td","class", "delete__checkBox");
    const checkBoxRow = createElement("input","type", "checkbox");

    tableDataCell.appendChild(checkBoxRow);

    table.appendChild(row);
    row.appendChild(nameRow);
    row.appendChild(titleRow);
    row.appendChild(phoneRow);
    row.appendChild(statusRow);
    row.appendChild(positionRow);
    row.appendChild(tableDataCell);
    row.innerHTML+= `
    <td>
        <button type="button" class="btn btn-outline-primary btn-modify">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
          </svg>          
        </button>
    </td>
    `;
    refreshEventInModifyCells(row);

}

function createElement(nodeName, attributeName , attributeValue) {
    let elementHtml = document.createElement(nodeName);
    elementHtml.setAttribute(attributeName,attributeValue);
    return elementHtml;
}

function createNameRow(name, email) {
    const nameRow = document.createElement("td");
    const nameRowConteiner = createElement("div","class", "d-flex flex-row align-items-center gap-2");
    const nameRowConteinerText = createElement("div","class", "d-flex flex-column");
    const nameRowImg = createElement("img","style", "height: 50px;");
    nameRowImg.classList.add("rounded-circle", "border", "border-secondary-subtle");
    const nameRowName = document.createElement("dt");
    const nameRowEmail = createElement("p","class", "m-0");

    nameRowImg.src= `https://robohash.org/${name}?set=set4`;
    nameRowName.textContent = name;
    nameRowEmail.textContent = email;

    nameRow.appendChild(nameRowConteiner);
    nameRowConteiner.appendChild(nameRowImg);
    nameRowConteiner.appendChild(nameRowConteinerText);
    nameRowConteinerText.appendChild(nameRowName);
    nameRowConteinerText.appendChild(nameRowEmail);

    return nameRow;
}

function createInformationInRow(data) {
    let tableDataCell = document.createElement("td");
    let tableDataCellP = createElement("p","class", "m-0");

    tableDataCellP.textContent = data;

    tableDataCell.appendChild(tableDataCellP)
    return tableDataCell;
}

function createInformationStatusInRow(data) {
    let tableDataCell = document.createElement("td");
    let tableDataCellP = createElement("p","class", "m-0 badge  text-center rounded-pill");

    tableDataCellP.classList.add(...changeStatus(data));

    tableDataCellP.textContent = data[0].toUpperCase() + data.slice(1);

    tableDataCell.appendChild(tableDataCellP)

    return tableDataCell;
}

const exampleModal = document.getElementById('exampleModal');
if (exampleModal) {

    document.addEventListener("DOMContentLoaded", () => {
        const modalBodyInputAll = exampleModal.querySelectorAll('.modal-body input');
        const modalBodySelect = exampleModal.querySelectorAll('.modal-body select');

        modalBodySelect[0].innerHTML = addSelectOption(arrOptionStatus);
        modalBodySelect[1].innerHTML = addSelectOption(arrOptionPosition);

        const btnAddEmployee = exampleModal.querySelector('.modal-footer  button.btn-primary');
        const btnClose = exampleModal.querySelector('.modal-footer  button.btn-secondary');

        btnAddEmployee.addEventListener("click", () => {

            let formData = new FormData(document.getElementById("addEmployee"));
            let dateForm = Object.fromEntries(formData);

            if (checkAllInputFull(modalBodyInputAll)) {

                creatRowInTable(dataTable.length,`${dateForm.firstName} ${dateForm.lastName}`,
                    dateForm.email, dateForm.role,dateForm.phone = toPhone(dateForm.phone),
                    dateForm.status, dateForm.position);

                dataTable.push(dateForm);

                for (const element of modalBodyInputAll) {
                    element.value="";
                }
                btnClose.click();
            }
        });

    });
};

function changeStatus(status) {
    let classList;
    switch (status) {

        case "active":
            return classList = ["bg-success-subtle","text-success"];
            break;

        case "archive":
            return classList = ["text-bg-secondary"];
            break;

        case "onboarding":
            return classList = ["bg-primary-subtle","text-primary-emphasis"];
            break;

        case "awaiting":
            return classList = ["bg-warning-subtle","text-warning-emphasis"];
            break;

        default :
            return classList = ["text-bg-secondary"];
            break;
    }
}

function changeStyleCSS( selector, property, value ) {
    const stylesheet = document.styleSheets[1];
    let elementRules;

    for (const stylesheetElement of stylesheet.cssRules) {
        if(stylesheetElement.selectorText === selector) {
            elementRules = stylesheetElement;
        }
    }

    elementRules.style.setProperty( property, value);
}

function checkAllInputFull(arr) {
    for (const element of arr) {
        if (!element.checkValidity()) {
            return false;
        }
    }
    return true;
};

const inputRequiredValue = document.getElementById("findRow");
inputRequiredValue.addEventListener("input", findField);

function findField() {

    if (inputRequiredValue.value != "" || sortSelectStatus !== "") {
        modifyCells = false;
        let requiredValue = inputRequiredValue.value;
        sortedTable = dataTable;
        let requiredRow = [];

        if (inputRequiredValue.value != "") {
            requiredRow = sortedTable.filter((element) => {
                    return element.firstName.toLowerCase().includes(requiredValue.toLowerCase()) ||
                        element.lastName.toLowerCase().includes(requiredValue.toLowerCase()) ||
                        element.email.toLowerCase().includes(requiredValue.toLowerCase()) ||
                        element.role.toLowerCase().includes(requiredValue.toLowerCase()) ||
                        element.phone.toLowerCase().includes(requiredValue.toLowerCase()) ||
                        element.status.toLowerCase().includes(requiredValue.toLowerCase()) ||
                        element.position.toLowerCase().includes(requiredValue.toLowerCase());

                }
            );
            sortedTable = requiredRow;
        };

        if (sortSelectStatus !== "") {
            requiredRow = sortedTable.filter((element) => {
                    return element.status.toLowerCase().includes(sortSelectStatus);

                }
            );
            sortedTable = requiredRow;
        }

        refreshTable(sortedTable);

    } else {
        refreshTable(dataTable);
    };
}

function findParentRow(elementRow) {
    while (elementRow.nodeName!=="TR") {
        elementRow = elementRow.parentNode;
    }
    return elementRow;
}

function formatFirstCharUp(value) {
    return value[0].toUpperCase() + value.slice(1);
}

function toPhone(phone) {
    phone = `(${phone.slice(0,3)})${phone.slice(3,6)}-${phone.slice(6)}`
    return phone;
}
function phoneToNumer(phone) {
    phone = `${phone.slice(1,4)}${phone.slice(5,8)}${phone.slice(9)}`
    return phone;
}

function addSelectRow(element) {
    if (element.checked){
        selectRow.push(findParentRow(element));
    } else {
        for (let i = 0; i<selectRow.length; i++) {
            if (selectRow[i].id === findParentRow(element).id ) {
                selectRow.splice(i,1);
            };
        };
    };
};

const btnDelete = document.getElementById("delete__Row");
const btnSubmitDelete = document.getElementById("deleteSubmit");
const btnCancelDelete = document.getElementById("deleteCansel");

btnDelete.addEventListener("click", () => {
    changeStyleCSS('.delete__checkBox', 'display', '');
});

btnCancelDelete.addEventListener("click", () => {
    for (const selectRowElement of selectRow) {
        let selectCheckBox = selectRowElement.querySelector( "input[type='checkbox']")
        selectCheckBox.checked = !selectCheckBox.checked;
    }
    selectRow = [];

    changeStyleCSS('.delete__checkBox', 'display', 'none');
});

btnSubmitDelete.addEventListener("click", () => {

    deleteRow();
    btnCancelDelete.click();
})

function deleteRow() {

    selectRow.sort(function (a, b) {
        return a.id - b.id;
    });

    for (const element of selectRow.reverse()) {
        dataTable.splice(element.id,1);
    }

    selectRow = [];

    refreshTable(dataTable);
}

function fillStatusSearch() {
    let dropdown = document.querySelector("thead div.dropdown-center ul.dropdown-menu");

    for (const status of arrOptionStatus) {
        dropdown.innerHTML += `
        <button class="dropdown-item" value="${status}" > ${formatFirstCharUp(status)} </button>`;
    }

    let btnSort = dropdown.querySelectorAll("button");

    for (const btnSortElement of btnSort) {
        btnSortElement.addEventListener("click", (ev)=>{
            sortSelectStatus = ev.target.value;
            findField();
        })
    }
}