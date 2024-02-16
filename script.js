//var requestURL= "https://robohash.org/John Doe?set=set4";
let requestURLTable= "http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}&position=[\"junior\",\"middle\",\"senior\"]&status=[\"archive\",\"onboarding\",\"active\",\"awaiting\"]&role=[\"Engineer\", \"Designer\", \"Product Manager\", \"System Analytic\",\"Consultant\"]&salary={numberLength|3}";
let dataTable = [];
let selectRows = [];
let arrOptionsStatus = ["active", "onboarding", "awaiting", "archive"];
let arrOptionsPosition = ["senior", "junior", "middle"];
let filterSelectStatus ="";
let sortTableName ="";


fetch(requestURLTable)
    .then(response => response.json())
    .then( arrRow=> {
        dataTable = arrRow;
        refreshTable(dataTable);
        fillStatusSearch();
        addEventsSortName();
    });

function refreshTable(arrRow) {
    const table = document.querySelector("tbody");

    table.textContent="";

    if  (arrRow[0].row === undefined) {

        let idRow = 0;

        for (const arrRowElement of arrRow) {

            createRowInTablePattern(idRow,`${arrRowElement.firstName} ${arrRowElement.lastName}`,arrRowElement.email,
                arrRowElement.role, arrRowElement.phone, arrRowElement.status, arrRowElement.position);

            idRow++;
        }
    } else {
        for (const element of arrRow) {

            createRowInTablePattern(element.id,`${element.row.firstName} ${element.row.lastName}`,element.row.email,
                element.row.role, element.row.phone, element.row.status, element.row.position);
        }
    }

}

function refreshEventInModifyCell(row) {
    const btnModify = row.querySelector(`.btn-modify`);
    const checkBoxRow = row.querySelector( "input[type='checkbox']");

    btnModify.addEventListener("click", (ev)=>{
        modifyRow(ev.target);
    });

    checkBoxRow.addEventListener("change", (ev)=>{
        selectRows = addSelectRow(selectRows ,ev.target);
    });
}


function createDocHTMLPattern(id, name, email,title,phone,status, position) {

    let patternHtml = createElement("tr", "id", id);
    patternHtml.innerHTML = createCellsTable( name, email,title,phone,status, position);

    refreshEventInModifyCell(patternHtml);

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
              <svg viewBox="0 0 16 16" width="16" height="16">
                <use xlink:href="#changeField"></use>
             </svg>          
            </button>
        </td>
    `;
    return cells;
}

function createRowInTablePattern(id, name, email,title,phone,status, position) {
    const table = document.querySelector("tbody");

    table.appendChild(createDocHTMLPattern(id, name, email,title,phone,status, position));
}

function createInput(name, label, value) {
    let input = `
        <div class="mb-1 form-floating">
            <input type="text" class="form-control " id="${name}" name="${name}" placeholder="" value="${value}" required>
            <label for="${name}" class="col-form-label">${label}</label>                        
        </div>`;

    return input;
}

function createInputPhone(name, label, value) {
    let input = `
        <div class="mb-1 form-floating">
            <input type="text" class="form-control " id="${name}" name="${name}" 
            maxlength="10" pattern="[0-9]{10}" placeholder="(454)328-2495" value="${value}" required>
            <label for="${name}" class="col-form-label">${label}</label>                        
        </div>`;

    return input;
}

function createSelect(name, label, value) {
    let select = `
        <div class="mb-1 form-floating">
            <select class="form-select" id="${name}" name="${name}">
                ${value}
            </select>
            <label for="${name}" class="col-form-label">${label}</label>
        </div>`;

    return select;
}

function modifyRow(element) {

        let elementRow = findParentRow(element);

        elementRow.classList.add("was-validated");

        elementRow.innerHTML = `        
        <td>
            <div class="d-flex flex-row align-items-center gap-2 ">
                <img class="rounded-circle border border-secondary-subtle" 
                src="https://robohash.org/${name}?set=set4" 
                alt="" style="height: 50px;">
                <div class="d-flex flex-column ">
                    ${createInput("firstName", "Имя", dataTable[elementRow.id].firstName)}
                    ${createInput("lastName", "Фамилия", dataTable[elementRow.id].lastName)}
                    ${createInput("email", "Email", dataTable[elementRow.id].email)}                                                       
                </div>
            </div>
        </td>
        <td> 
            ${createInput("role", "Должность", dataTable[elementRow.id].role)}
        </td>
        <td> 
            ${createInputPhone("phone", "Phone", phoneToNumer(dataTable[elementRow.id].phone))}
        </td>
        <td>
            ${createSelect("status", "Status", addSelectOption(arrOptionsStatus, dataTable[elementRow.id].status))}
        </td>
        <td>
            ${createSelect("position", "Position", addSelectOption(arrOptionsPosition, dataTable[elementRow.id].position))}
        </td>
        <td class="delete__checkBox"> <input type="checkbox"></td>
        <td> 
            <button type="button" class="btn btn-success btn-modifySuccess" id="btn-modifySuccess">
                  <svg viewBox="0 0 16 16" width="16" height="16">
                    <use xlink:href="#changeFieldSuccess"></use>
                 </svg>          
              </button>
              <button type="button" class="btn btn-outline-danger btn-modifyCancel" id="btn-modifyCancel">
                 <svg viewBox="0 0 16 16" width="16" height="16" >
                    <use xlink:href="#changeFieldCansel"></use>
                 </svg>                 
              </button>
        </td>` ;

        const btnCanselModify = elementRow.getElementsByClassName("btn-modifyCancel")[0];
        const btnModifySuccess = elementRow.getElementsByClassName("btn-modifySuccess")[0];

        btnCanselModify.addEventListener("click", (ev)=> {
            canselModify(ev.target);
        })

        btnModifySuccess.addEventListener("click", (ev)=> {
            successModify(ev.target)
        })
};

function canselModify(element) {

    let row = findParentRow(element);

    row.innerHTML = createCellsTable( `${dataTable[row.id].firstName} ${dataTable[row.id].lastName}`,dataTable[row.id].email,
        dataTable[row.id].role, dataTable[row.id].phone, dataTable[row.id].status, dataTable[row.id].position);

    refreshEventInModifyCell(row);
};

function successModify(element) {

    let row = findParentRow(element);

    const InputAll = row.querySelectorAll('input');

    if (checkAllInputFull(InputAll)) {
        let allValues = row.querySelectorAll("input, select");
        let employees = new Object();

        for (const inputElement of allValues) {
            employees[inputElement.name] = inputElement.value;
        }

        row.innerHTML = createCellsTable( `${employees.firstName} ${employees.lastName}`,employees.email,
            employees.role, employees.phone = toPhone(employees.phone), employees.status, employees.position);

        refreshEventInModifyCell(row);

        dataTable[row.id] = employees;

        return true;
    };
    return false;
};

function redrawingFieldById(id, employees) {
    let row = document.getElementById(id);

    row.innerHTML = createCellsTable( `${employees.firstName} ${employees.lastName}`,employees.email,
        employees.role, employees.phone = toPhone(employees.phone), employees.status, employees.position);

    refreshEventInModifyCell(row);
}

function addSelectOption(arrOption) {

    let listOptions = ``;

    for (const arrOptionElement of arrOption) {
        listOptions += `<option value="${arrOptionElement}">${formatFirstCharUp(arrOptionElement)}</option>`;
    };

    return listOptions;

};
function addSelectOption(arrOption, selectOption) {

    let listOptions = ``;

    for (const arrOptionElement of arrOption) {
        if (arrOptionElement === selectOption) {
            listOptions += `<option value="${arrOptionElement}" selected>${formatFirstCharUp(arrOptionElement)}</option>`;
        } else {
            listOptions += `<option value="${arrOptionElement}">${formatFirstCharUp(arrOptionElement)}</option>`;
        };
    };

    return listOptions;

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
    refreshEventInModifyCell(row);

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

        modalBodySelect[0].innerHTML = addSelectOption(arrOptionsStatus);
        modalBodySelect[1].innerHTML = addSelectOption(arrOptionsPosition);

        const btnAddEmployee = exampleModal.querySelector('.modal-footer  button.btn-primary');
        const btnClose = exampleModal.querySelector('.modal-footer  button.btn-secondary');

        btnAddEmployee.addEventListener("click", () => {

            let formData = new FormData(document.getElementById("addEmployee"));
            let dateForm = Object.fromEntries(formData);

            if (checkAllInputFull(modalBodyInputAll)) {

                dataTable.push(dateForm);
                findFieldInTable();

                for (const element of modalBodyInputAll) {
                    element.value="";
                }
                btnClose.click();

            }
        });

    });
};

function changeStatus(status) {

    switch (status) {

        case "active":
            return  ["bg-success-subtle","text-success"];
            break;

        case "archive":
            return ["text-bg-secondary"];
            break;

        case "onboarding":
            return ["bg-primary-subtle","text-primary-emphasis"];
            break;

        case "awaiting":
            return ["bg-warning-subtle","text-warning-emphasis"];
            break;

        default :
            return ["text-bg-secondary"];
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
inputRequiredValue.addEventListener("input", findFieldInTable);

function findFieldInTable() {

    let newDataTable = findField(dataTable, inputRequiredValue.value, filterSelectStatus, sortTableName);

    refreshTable(newDataTable);

}
function findField(dataTable, searchWord, searchStatus, ascendingDescending) {

    let requiredValue = searchWord.toLowerCase();
    let sortedDataTable = dataTable;
    let requiredRows = [];
    let tempRequiredRows = [];
    if (searchWord.value !== "") {

        sortedDataTable = sortedDataTable.filter((element, index) => {
            if (element.firstName.toLowerCase().includes(requiredValue) ||
                element.lastName.toLowerCase().includes(requiredValue) ||
                element.email.toLowerCase().includes(requiredValue) ||
                element.role.toLowerCase().includes(requiredValue) ||
                element.phone.toLowerCase().includes(requiredValue) ||
                element.status.toLowerCase().includes(requiredValue) ||
                element.position.toLowerCase().includes(requiredValue)) {

                let trueField = new Object();
                trueField["id"] = index;
                trueField["row"] = element;

                tempRequiredRows.push(trueField);
                return true;
            } else {
                return false;
            }
        });

        requiredRows = tempRequiredRows;
    };

    tempRequiredRows = [];

    if (searchStatus !== "") {

        sortedDataTable = sortedDataTable.filter((element, index) => {
            if (requiredRows.length !== 0) {
                for (const requiredRow of requiredRows) {
                    if (element.status.toLowerCase().includes(searchStatus) &&
                        requiredRow.row.status === element.status.toLowerCase()) {

                        let trueField = new Object();
                        trueField["id"] = index;
                        trueField["row"] = element;

                        tempRequiredRows.push(trueField);
                        return true
                    }
                }
                return false;

            } else  {
                if (element.status.toLowerCase().includes(searchStatus)) {

                    let trueField = new Object();
                    trueField["id"] = index;
                    trueField["row"] = element;

                    tempRequiredRows.push(trueField);

                    return true;
                } else {
                    return false;
                }
            }
        });
        requiredRows = tempRequiredRows;

    }

    if (ascendingDescending !== "") {
        if (requiredRows.length !==0) {
            requiredRows.sort((a, b) => a.row.firstName.localeCompare(b.row.firstName));
        } else  {
            requiredRows = sortedDataTable.sort((a, b) => a.firstName.localeCompare(b.firstName));
        }

        if (ascendingDescending === "descending") {
            requiredRows.reverse();
        }

    }

    return requiredRows;
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

function addSelectRow(arrRows, element) {

    if (element.checked){
        arrRows.push(findParentRow(element).id);
    } else {
        for (let i = 0; i<arrRows.length; i++) {
            if (arrRows[i] === findParentRow(element).id ) {
                arrRows.splice(i,1);
            };
        };
    };
    return arrRows;
};

const btnDelete = document.getElementById("delete__Row");
const btnSubmitDelete = document.getElementById("deleteSubmit");
const btnCancelDelete = document.getElementById("deleteCansel");

btnDelete.addEventListener("click", () => {
    changeStyleCSS('.delete__checkBox', 'display', '');
});

btnCancelDelete.addEventListener("click", () => {
    for (const selectRowElement of selectRows) {
        let selectCheckBox = document.getElementById(selectRowElement).querySelector( "input[type='checkbox']");
        selectCheckBox.checked = !selectCheckBox.checked;
    }
    selectRows = [];

    changeStyleCSS('.delete__checkBox', 'display', 'none');
});

btnSubmitDelete.addEventListener("click", () => {

    dataTable = deleteRows(dataTable, selectRows);

    findFieldInTable();;

    selectRows = []
    btnCancelDelete.click();
})

function deleteRows(dataTable, selectRows) {

    selectRows.sort(function (a, b) {
        return a - b;
    });

    for (const element of selectRows.reverse()) {
        dataTable.splice(element,1);
    }
    return dataTable;
}

function fillStatusSearch() {
    let dropdown = document.querySelector("thead div#sortStatus.dropdown-center ul.dropdown-menu");

    for (const status of arrOptionsStatus) {
        dropdown.innerHTML += `
        <button class="dropdown-item" value="${status}" > ${formatFirstCharUp(status)} </button>`;
    }

    let btnSort = dropdown.querySelectorAll("button");

    for (const btnSortElement of btnSort) {
        btnSortElement.addEventListener("click", (ev)=>{
            filterSelectStatus = ev.target.value;
            findFieldInTable();
        })
    }
}

function addEventsSortName() {

    let dropdown = document.querySelectorAll("thead div#sortName.dropdown-center ul.dropdown-menu button");

    for (const dropdownElement of dropdown) {
        dropdownElement.addEventListener("click", (ev)=>{
            sortTableName = ev.target.value;
            findFieldInTable();
        })
    }


}
