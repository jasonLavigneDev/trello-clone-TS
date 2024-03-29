let actualContainer : HTMLDivElement,
actualBtn: HTMLButtonElement,
actualUl: HTMLUListElement,
actualForm: HTMLFormElement,
actualTextInput : HTMLInputElement,
actualValidation: HTMLSpanElement

const itemsContainer = document.querySelectorAll(".items-container") as NodeListOf<HTMLDivElement>;

itemsContainer.forEach((container : HTMLDivElement) => {
    addContainerListeners(container)
});

function addContainerListeners(currentContainer : HTMLDivElement){

    const currentContainerDeletionBtn = currentContainer.querySelector(".delete-container-btn") as HTMLButtonElement;
    const currentAddItemBtn = currentContainer.querySelector(".add-item-btn")as HTMLButtonElement;
    const currentCloseformBtn = currentContainer.querySelector(".close-form-btn") as HTMLButtonElement;
    const currentForm = currentContainer.querySelector("form") as HTMLFormElement;

    deleteBtnListeners(currentContainerDeletionBtn)
    addItemBtnListeners(currentAddItemBtn)
    closingFormBtnListeners(currentCloseformBtn)
    addformSubmitListeners(currentForm)
    addDragAndDropListeners(currentContainer)
};

function deleteBtnListeners(btn: HTMLButtonElement){
    btn.addEventListener("click", handleContainerDeletion)
};
function addItemBtnListeners(btn: HTMLButtonElement){
    btn.addEventListener("click", handleAddItem)
};
function closingFormBtnListeners(btn: HTMLButtonElement){
    btn.addEventListener("click",()=> toggleForm(actualBtn,actualForm,false))
};
function addformSubmitListeners(form: HTMLFormElement){
    form.addEventListener("submit", createNewItem);
}
function addDragAndDropListeners(element: HTMLElement){
    element.addEventListener("dragstart", handleDragStart)
    element.addEventListener("dragover", handleDragOver)
    element.addEventListener("drop", handleDrop)
    element.addEventListener("dragend", handleDragEnd)
}

function handleContainerDeletion(e:MouseEvent){
    const btn = e.target as HTMLButtonElement;
    const btnsArray = [...document.querySelectorAll(".delete-container-btn")] as HTMLButtonElement [];
    const containers = [...document.querySelectorAll(".items-container")] as HTMLDivElement [];
    containers[btnsArray.indexOf(btn)].remove()
};

function handleAddItem(e:MouseEvent){
    const btn = e.target as HTMLButtonElement;
    if(actualContainer) toggleForm(actualBtn, actualForm, false);
    setContainerItems(btn);
    toggleForm(actualBtn,actualForm, true)
};

function setContainerItems(btn: HTMLButtonElement){
    actualBtn = btn;
    actualContainer = btn.parentElement as HTMLDivElement;
    actualUl = actualContainer.querySelector("ul") as HTMLUListElement;
    actualForm = actualContainer.querySelector("form") as HTMLFormElement;
    actualTextInput = actualContainer.querySelector("input") as HTMLInputElement;
    actualValidation = actualContainer.querySelector(".validation-msg") as HTMLSpanElement;
};

function toggleForm(btn: HTMLButtonElement, form: HTMLFormElement, action: Boolean){
    if(!action){
        form.style.display = "none";
        btn.style.display = "block";
    } else if(action) {
        form.style.display = "block";
        btn.style.display = "none";
    };
};

function createNewItem (e: Event){
    e.preventDefault();
    //Validation
    if(actualTextInput.value.length === 0){
        actualValidation.textContent = "Must be at least 1 character long !"
        return ;
    } else {
        actualValidation.textContent = ""
    }
    //Création item
    const itemContent = actualTextInput.value;
    const li = `
    <li class="item" draggable="true">
    <p>${itemContent}</p>
    <button>X</button>
    </li>
    `
    actualUl.insertAdjacentHTML("beforeend",li)

    const item = actualUl.lastElementChild as HTMLElement;
    const liBtn = item.querySelector("button") as HTMLButtonElement;
    handleItemDeletion(liBtn);
    addDragAndDropListeners(item)
    actualTextInput.value = "";

}

function handleItemDeletion(btn: HTMLButtonElement){
    btn.addEventListener("click", () => {
        const elToRemove = btn.parentElement as HTMLLIElement;
        elToRemove.remove()
    });
};

//Drag and Drop
let dragSrcEl : HTMLElement;
function handleDragStart(this: HTMLElement, e: DragEvent){
    e.stopPropagation();

    if(actualContainer)toggleForm(actualBtn, actualForm, false)
    dragSrcEl = this;
    e.dataTransfer?.setData("text/html", this.innerHTML)
}

function handleDragOver(e: DragEvent){
    e.preventDefault()
}
function handleDrop(this: HTMLElement, e: DragEvent){
    e.stopPropagation();
    const receptionEl = this ;

    if(dragSrcEl.nodeName === "LI" && receptionEl.classList.contains("items-container")){
        (receptionEl.querySelector("ul") as HTMLUListElement).appendChild(dragSrcEl);
        addDragAndDropListeners(dragSrcEl)
        handleItemDeletion(dragSrcEl.querySelector("button") as HTMLButtonElement)
    }

    if(dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]){
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML= e.dataTransfer?.getData("text/html") as string ;
        if(this.classList.contains("items-container")){
            addContainerListeners(this as HTMLDivElement)
            this.querySelectorAll("li").forEach((li: HTMLLIElement) => {
                handleItemDeletion(li.querySelector("button") as HTMLButtonElement)
                addDragAndDropListeners(li);
            })
        } else {
            addDragAndDropListeners(this);
            handleItemDeletion(this.querySelector("button") as HTMLButtonElement)
        }
    }
}

function handleDragEnd(this : HTMLElement, e: DragEvent){
    e.stopPropagation();
    if(this.classList.contains("items-container")){
        addContainerListeners(this as HTMLDivElement)
        this.querySelectorAll("li").forEach((li: HTMLLIElement) => {
            handleItemDeletion(li.querySelector("button") as HTMLButtonElement)
            addDragAndDropListeners(li);
        })
    } else {
        addDragAndDropListeners(this)
    }
}


//Add new container
const addContainerBtn = document.querySelector(".add-container-btn") as HTMLButtonElement;
const addContainerForm = document.querySelector(".add-new-container form") as HTMLFormElement;
const addContainerFormInput = document.querySelector(".add-new-container input") as HTMLInputElement;
const validationNewContainer = document.querySelector(".add-new-container .validation-msg") as HTMLSpanElement;
const addcontainerCloseBtn = document.querySelector(".close-add-list") as HTMLButtonElement;
const addNewContainer = document.querySelector(".add-new-container") as HTMLDivElement;
const containersList = document.querySelector(".main-content") as HTMLDivElement;

addContainerBtn.addEventListener("click" , ()=> {
    toggleForm(addContainerBtn, addContainerForm, true)
})
addcontainerCloseBtn.addEventListener("click", () => {
    toggleForm(addContainerBtn, addContainerForm, false)
})
addContainerForm.addEventListener("submit", createNewContainer);

function createNewContainer(e: Event) {
    e.preventDefault();
      //Validation
      if(addContainerFormInput.value.length === 0){
        validationNewContainer.textContent = "Must be at least 1 character long !"
        return ;
    } else {
        validationNewContainer.textContent = ""
    }

    const itemsContainer = document.querySelector(".items-container") as HTMLDivElement;
    const newContainer = itemsContainer.cloneNode() as HTMLDivElement;
    const newcontainerContent = `
            <div class="top-container">
                <h2>${addContainerFormInput.value}</h2>
                <button class="delete-container-btn">X</button>
            </div>
            <ul></ul>
            <button class="add-item-btn">Add an item</button>
            <form autocomplete ="off">
                <div class="top-form-container">
                    <label for="item">Add a new item</label>
                    <button type="button" class="close-form-btn">X</button>
                </div>
                <input type="text" id="item">
                <span class="validation-msg"></span>
                <button type="submit">Submit</button>
            </form>
    `
    newContainer.innerHTML = newcontainerContent;
    containersList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value= ""
    addContainerListeners(newContainer)
}