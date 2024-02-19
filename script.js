//var requestURL= "https://robohash.org/John Doe?set=set4";
let requestURLTable= "http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}&position=[\"junior\",\"middle\",\"senior\"]&status=[\"archive\",\"onboarding\",\"active\",\"awaiting\"]&role=[\"Engineer\", \"Designer\", \"Product Manager\", \"System Analytic\",\"Consultant\"]&salary={numberLength|3}";

let arrOptionsStatus = ["active", "onboarding", "awaiting", "archive"];
let arrOptionsPosition = ["senior", "junior", "middle"];

let dataTable = {
    rows: [],
    selectRowsId: [],
    filterParams : {
        search: "",
        status: ""
    },
    sortParams : ""
};


fetch(requestURLTable)
    .then(response => response.json())
    .then( arrRow=> {
        dataTable.rows = arrRow;
        redrawTable(dataTable.rows);
        fillStatusSearch(arrOptionsStatus);
        addEventsSortName();
    });

function redrawTable(rows) {
    const table = document.querySelector("tbody");

    table.textContent="";

    for (const element of rows) {

        createRowInTablePattern(element);
    }

}

function updateTable(dataTable) {

    let rows = dataTable.rows.slice();
    let filteredRows = filterRows(rows, dataTable.filterParams);
    let sortedRows = sortRows(filteredRows, dataTable.sortParams);

    redrawTable(sortedRows);
}

function refreshEventInModifyCell(row) {
    const btnModify = row.querySelector(`.btn-modify`);
    const checkBoxRow = row.querySelector( "input[type='checkbox']");

    btnModify.addEventListener("click", (ev)=>{
        modifyRow(ev.target);
    });

    checkBoxRow.addEventListener("change", (ev)=>{
        dataTable.selectRowsId = addSelectRow(dataTable.selectRowsId, ev.target);
    });
}

function createRowInTablePattern(employee) {
    const table = document.querySelector("tbody");

    table.appendChild(createDocHTMLPattern(employee));
}

function createDocHTMLPattern(employee) {

    let patternHtml = createElement("tr", "id", employee.id);
    patternHtml.innerHTML = createCellsTable(employee);

    refreshEventInModifyCell(patternHtml);

    return patternHtml;
}

function createCellsTable(employee) {
    return `
        <td>
            <div class="d-flex flex-row align-items-center gap-2 ">
                <img class="rounded-circle border border-secondary-subtle" 
                src="https://robohash.org/${employee.firstName} ${employee.lastName}?set=set4" 
                alt="" style="height: 50px;">
                <div class="d-flex flex-column ">
                    <dt>${employee.firstName} ${employee.lastName}</dt>
                    <p class="m-0" >${employee.email}</p>
                </div>
            </div>
        </td>
        <td> <p class="m-0">${employee.role}</p></td>
        <td> <p class="m-0">${employee.phone}</p></td>
        <td> <p class="m-0 badge  text-center rounded-pill ${changeStatus(employee.status).join(" ")}" >${formatFirstCharUp(employee.status)}</p></td>
        <td> <p class="m-0 " >${formatFirstCharUp(employee.position)}</p></td>
        <td class="delete-checkBox"> <input type="checkbox"></td>
        <td> 
            <button type="button" class="btn btn-outline-primary btn-modify">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <use xlink:href="#changeField"></use>
             </svg>          
            </button>
        </td>
    `;
}

function createInput(name, label, value) {
    return `
        <div class="mb-1 form-floating">
            <input type="text" class="form-control " id="${name}" name="${name}" placeholder="" value="${value}" required>
            <label for="${name}" class="col-form-label">${label}</label>                        
        </div>`;
}

function createInputPhone(name, label, value) {
    return `
        <div class="mb-1 form-floating">
            <input type="text" class="form-control " id="${name}" name="${name}" 
            maxlength="10" pattern="[0-9]{10}" placeholder="(454)328-2495" value="${value}" required>
            <label for="${name}" class="col-form-label">${label}</label>                        
        </div>`;
}

function createSelect(name, label, value) {
    return `
        <div class="mb-1 form-floating">
            <select class="form-select" id="${name}" name="${name}">
                ${value}
            </select>
            <label for="${name}" class="col-form-label">${label}</label>
        </div>`;
}

function modifyRow(element) {

    let elementRow = findParentRow(element);

    elementRow.classList.add("was-validated");

    const rowValue = elementRow.querySelectorAll("p, dt");

    const name = rowValue[0].textContent.split(" ");
    const email = rowValue[1].textContent;
    const role = rowValue[2].textContent;
    const phone = rowValue[3].textContent;
    console.log(phone)
    const status = rowValue[4].textContent;
    const position = rowValue[5].textContent;

    elementRow.innerHTML = `        
    <td>
        <div class="d-flex flex-row align-items-center gap-2 ">
            <img class="rounded-circle border border-secondary-subtle" 
            src="https://robohash.org/${name.join(" ")}?set=set4" 
            alt="" style="height: 50px;">
            <div class="d-flex flex-column ">
                ${createInput("firstName", "Имя", name[0])}
                ${createInput("lastName", "Фамилия", name[1])}
                ${createInput("email", "Email", email)}                                                       
            </div>
        </div>
    </td>
    <td> 
        ${createInput("role", "Должность", role)}
    </td>
    <td> 
        ${createInputPhone("phone", "Phone", phoneToNumber(phone))}
    </td>
    <td>
        ${createSelect("status", "Status", addSelectOptionSelected(arrOptionsStatus, status))}
    </td>
    <td>
        ${createSelect("position", "Position", addSelectOptionSelected(arrOptionsPosition, position))}
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
        canselModify(dataTable.rows, ev.target);
    })

    btnModifySuccess.addEventListener("click", (ev)=> {

        let newRows = successModify(dataTable.rows, ev.target);

        dataTable.rows = newRows.employees;
    })
}

function canselModify(employees, element) {

    let row = findParentRow(element);

    employees.find((value)=>{
        if (value.id.toString() === row.id) {

            row.innerHTML = createCellsTable(value);
        }
    })
    
    refreshEventInModifyCell(row);
}

function successModify(employees, element) {

    let row = findParentRow(element);

    const InputAll = row.querySelectorAll('input');

    if (checkAllInputFull(InputAll)) {
        let allValues = row.querySelectorAll("input, select");
        let employee = {
            id: row.id,
        };

        for (const inputElement of allValues) {
            employee[inputElement.name] = inputElement.value;
        }
        employee.phone = toPhone(employee.phone);

        row.innerHTML = createCellsTable(employee);

        refreshEventInModifyCell(row);

        for (let i=0; i<employees.length; i++) {
            if (employees[i].id === employee.id) {
                employees[i] = employee;
                return {
                    employees: employees,
                    status: true,
                }
            }
        }
    }
    return {
        employees: employees,
        status: false,
    }
}

function addSelectOption(Options) {

    let listOptions = ``;

    for (const Option of Options) {
        listOptions += `<option value="${Option}">${formatFirstCharUp(Option)}</option>`;
    }

    return listOptions;

}
function addSelectOptionSelected(Options, selectOption) {

    let listOptions = ``;

    for (const Option of Options) {
        listOptions += `<option value="${Option}" ${(Option === selectOption) ? 'selected' : ''}>${formatFirstCharUp(Option)}</option>`;
    }

    return listOptions;
}

function createElement(nodeName, attributeName , attributeValue) {
    let elementHtml = document.createElement(nodeName);
    elementHtml.setAttribute(attributeName,attributeValue);
    return elementHtml;
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
            dateForm["id"] = Math.floor(Math.random() * (2000 - 1000) + 1000);
            dateForm.phone = toPhone(dateForm.phone);

            if (checkAllInputFull(modalBodyInputAll)) {

                dataTable.rows.push(dateForm);
                updateTable(dataTable);

                for (const element of modalBodyInputAll) {
                    element.value="";
                }

                btnClose.click();
            }
        });
    });
}

function changeStatus(status) {

    switch (status) {

        case "active":
            return  ["bg-success-subtle","text-success"];

        case "archive":
            return ["text-bg-secondary"];

        case "onboarding":
            return ["bg-primary-subtle","text-primary-emphasis"];

        case "awaiting":
            return ["bg-warning-subtle","text-warning-emphasis"];

        default :
            return ["text-bg-secondary"];
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
}

const inputRequiredValue = document.getElementById("findRow");
inputRequiredValue.addEventListener("input", (ev)=>{
    dataTable.filterParams.search = ev.target.value;
    updateTable(dataTable);
});

function filterRows(rows, filterParams) {

    let filteredRows = rows;

    if (filterParams.search !== "") {

        filteredRows = filteredRows.filter((element) => {

            return (employeeIncludes(element,filterParams.search.toLowerCase()))
        });
    }

    if (filterParams.status !== "") {

        filteredRows = filteredRows.filter((element) => {

           return  (element.status.toLowerCase() === filterParams.status)
        });
    }

    return filteredRows;
}

function sortRows(rows, sortParams) {

    let sortRows = rows;

    if (sortParams !== "") {

        sortRows.sort((a, b) => a.firstName.localeCompare(b.firstName));

        if (sortParams === "descending") {
            sortRows.reverse();
        }
    }
    return sortRows ;
}

function employeeIncludes(employee, parameter) {
    return (employee.firstName.toLowerCase().includes(parameter) ||
        employee.lastName.toLowerCase().includes(parameter) ||
        employee.email.toLowerCase().includes(parameter) ||
        employee.role.toLowerCase().includes(parameter) ||
        employee.phone.toLowerCase().includes(parameter) ||
        employee.status.toLowerCase().includes(parameter) ||
        employee.position.toLowerCase().includes(parameter))
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
function phoneToNumber(phone) {
    phone = `${phone.slice(1,4)}${phone.slice(5,8)}${phone.slice(9)}`
    return phone;
}

function addSelectRow(rows, element) {

    if (element.checked){
        rows.push(findParentRow(element).id);
    } else {
        for (let i = 0; i<rows.length; i++) {
            if (rows[i] === findParentRow(element).id ) {
                rows.splice(i,1);
            }
        }
    }
    return rows;
}

const btnDelete = document.getElementById("delete-row");
const btnSubmitDelete = document.getElementById("deleteSubmit");
const btnCancelDelete = document.getElementById("deleteCancel");

btnDelete.addEventListener("click", () => {
    changeStyleCSS('.delete-checkBox', 'display', '');
});

btnCancelDelete.addEventListener("click", () => {
    for (const id of dataTable.selectRowsId) {
        let selectCheckBox = document.getElementById(id).querySelector( "input[type='checkbox']");
        selectCheckBox.checked = !selectCheckBox.checked;
    }
    dataTable.selectRowsId = [];

    changeStyleCSS('.delete-checkBox', 'display', 'none');
});

btnSubmitDelete.addEventListener("click", () => {

    dataTable = deleteRows(dataTable);

    updateTable(dataTable);

    btnCancelDelete.click();
})

function deleteRows(dataTable) {

    for (let i = 0; i < dataTable.rows.length; i++) {

        for (const id of dataTable.selectRowsId) {

            if (dataTable.rows[i].id.toString() === id) {

                dataTable.rows.splice(i,1);
            }
        }
    }

    dataTable.selectRowsId = [];

    return dataTable;
}

function fillStatusSearch(OptionsStatus) {

    let dropdown = document.querySelector("thead div#sortStatus.dropdown-center ul.dropdown-menu");

    for (const status of OptionsStatus) {
        dropdown.innerHTML += `
        <button class="dropdown-item" value="${status}" > ${formatFirstCharUp(status)} </button>`;
    }

    let btnSort = dropdown.querySelectorAll("button");

    for (const btnSortElement of btnSort) {
        btnSortElement.addEventListener("click", (ev)=>{
            dataTable.filterParams.status = ev.target.value;
            updateTable(dataTable);
        })
    }
}

function addEventsSortName() {

    let dropdown = document.querySelectorAll("thead div#sortName.dropdown-center ul.dropdown-menu button");

    for (const dropdownBtn of dropdown) {
        dropdownBtn.addEventListener("click", (ev)=>{
            dataTable.sortParams = ev.target.value;
            updateTable(dataTable);
        })
    }
}

