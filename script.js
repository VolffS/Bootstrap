//var requestURL= "https://robohash.org/John Doe?set=set4";
var requestURLTable= "http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&address={addressObject}&description={lorem|32}&position=[\"junior\",\"middle\",\"senior\"]&status=[\"archive\",\"onboarding\",\"active\",\"awaiting\"]&role=[\"Engineer\", \"Designer\", \"Product Manager\", \"System Analytic\",\"Consultant\"]&salary={numberLength|3}";


//let response = await fetch(requestURLTable);
//let arrRow = await response.json();
fetch(requestURLTable)
    .then(response => response.json())
    .then( arrRow=> {
        for (const arrRowElement of arrRow) {
            creatRowInTable(`${arrRowElement.firstName} ${arrRowElement.firstName}`,arrRowElement.email,
                arrRowElement.role, arrRowElement.phone, arrRowElement.status, arrRowElement.position);
        }
    });

function creatRowInTable(name, email,title,phone,status, position) {
    const table = document.querySelector("tbody");
    const row = document.createElement("tr");
    const nameRow = createNameRow(name,email);
    const titleRow = createInformationInRow(title);
    const phoneRow = createInformationInRow(phone);
    const statusRow = createInformationStatusInRow(status);
    const positionRow = createInformationInRow(position);

    table.appendChild(row);
    row.appendChild(nameRow);
    row.appendChild(titleRow);
    row.appendChild(phoneRow);
    row.appendChild(statusRow);
    row.appendChild(positionRow);
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

function changeStatus(status) {
    var classList;
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
    exampleModal.addEventListener('show.bs.modal', () => {

        const modalBodyInputAll = exampleModal.querySelectorAll('.modal-body input');

        for (const modalBodyInputAllElement of modalBodyInputAll) {
            modalBodyInputAllElement.addEventListener("input", (evt)=> checkIsValid(evt));
        }

        const btnAddEmployee = exampleModal.querySelector('.modal-footer  button.btn-primary');
        const btnClose = exampleModal.querySelector('.modal-footer  button.btn-secondary');

        btnAddEmployee.addEventListener("click", () =>{

            var formData = new FormData(document.getElementById("addEmployee")) ;
            var dateForm = Object.fromEntries(formData);

            if (checkAllInputFull(modalBodyInputAll)) {

                creatRowInTable(`${dateForm.firstName} ${dateForm.lastName}`,
                    dateForm.email, dateForm.title, dateForm.phone,
                    dateForm.status, dateForm.position);
                for (const element of modalBodyInputAll) {
                    element.value="";
                    element.setAttribute("class","form-control");
                }
                btnClose.click();
            }
        });
    });
}

function checkIsValid(evt) {

    if (evt.target.value =="" ) {
        evt.target.classList.add("is-invalid");
        evt.target.classList.remove("is-valid");
    } else {
        evt.target.classList.add("is-valid");
        evt.target.classList.remove("is-invalid");
    }
}

function checkAllInputFull(arr) {
    for (const element of arr) {
        if (!element.classList.contains("is-valid")) {
            element.classList.replace("is-valid", "is-invalid");
            return false;
        }
    }
    return true;
}