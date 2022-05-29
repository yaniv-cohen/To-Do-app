import { Say } from './shared/say.service';
import { Dialog } from './shared/dialog';

class Module {
  say = new Say();
  select = 'Dialog';
  listStartUp(): void {
    let outP = document.getElementById('localp');
    if (outP) {
      outP.innerHTML = "todos: " + localStorage.getItem('todos');
    }
    //on start 
    if (localStorage.getItem('todos') == null || localStorage.getItem('todos') == undefined) {
      localStorage.setItem('todos', '');
    }
    console.log("hi " + localStorage.getItem('todos'));

    let ul = document.createElement('ul');
    ul.id = "todoList";
    ul.innerHTML = `<li>
    <span>
      <span class="title-span ">Title: <input id="title-input" type="text"></span>
      <span>Text: <input id="text-input" type="text"></span>
      <span class="title-span ">Amount: <input id="amount-input" type="text"></span>
    </span>
    <button class="addBox" onclick="app.module.addTask()"></button>
  </li>`;
    document.getElementsByTagName('main')[0].append(ul);
    this.listUpdate();
  }
  //empty the user's list exept for the add li
  cleanList() {
    let ul = document.getElementById('todoList');
    while (ul && ul.firstChild && ul.firstChild != ul.lastChild) {
      if (ul.lastChild) {
        ul.removeChild(ul.lastChild);
      }
    }
  }
  listUpdate() {
    //empty the user's list 
    //TODO: probably shoud be moved 
    this.cleanList();

    if (localStorage.getItem('todos') == undefined || localStorage.getItem('todos') == null) {
      return;
    }
    let copy = new String(localStorage.getItem('todos'));
    //loop over all the todos
    for (let i =0 ; copy.includes(']') && i<800; i++) {
      let li = document.createElement('li');
      //add a span element for every part of the todo
      while (copy.indexOf('%') >= 0 && copy.indexOf('%') < copy.indexOf(']')) {
        let sub = "" + copy.substring(0, copy.indexOf('%'));
        li.innerHTML += ("<span>" + sub + "</span>");
        copy = copy.substring(copy.indexOf('%') + 1);
      }
      //after filling li with all the spans reset the ul
      let ul = document.getElementById('todoList');
      if (ul) {
        let div = document.createElement('div');
        div.className = "checkbox";
        div.onclick = () => {
          //todo: add saved state
          // let str = this.getTextFromLi(li.innerHTML);
          // let rCopy = localStorage.getItem('todos');
          //   if (rCopy) {

          //     localStorage.setItem('todos', rCopy.replace('', ''))
          //   }
          
          li.classList.toggle("checkedItem");
          div.classList.toggle("checkboxChecked");
        };
        if (li.innerHTML != "") {
          console.log('draw ' + li.innerHTML);
          li.append(div);
          div.className = "deleteTask";
          div.innerHTML += "X";
          div.onclick = () => {

            //todo: remove substring from localStorage
            let inn = li.innerHTML;
            let strToDelete = this.getTextFromLi(inn);
            console.log("todelete " + strToDelete);
            let rCopy = localStorage.getItem('todos');
            if (rCopy) {
              localStorage.setItem('todos', rCopy.replace(strToDelete, ''))
            }
            li.remove();
          };
          li.append(div);
          ul.append(li);
        }
      }
      let outP = document.getElementById('localp');
      if (outP) {
        outP.innerHTML = "todos: " + localStorage.getItem('todos');
      }
      //if there is a ']' cut the copy up to it
      console.log(copy);
      if (copy.includes(']')) {
        copy = copy.substring(copy.indexOf(']') + 1);
      }
      else {
        break;
      }
    }

  }
  getTextFromLi(inn:string) :string {
    // console.log("li text : "+ inn)
    let str = inn.substring(inn.indexOf("<span>") + 6, inn.indexOf("</span>"));
    str += '%';
    inn = inn.substring(inn.indexOf("</span>") + 7);
    // console.log(inn);
    str += inn.substring(inn.indexOf("<span>") + 6, inn.indexOf("</span>"));
    str += '%';
    inn = inn.substring(inn.indexOf("</span>") + 7);
    // console.log(inn);
    str += inn.substring(inn.indexOf("<span>") + 6, inn.indexOf("</span>"));
    str += '%]';
    inn = inn.substring(inn.indexOf("</span>") + 7);
    //console.log(inn);
    return str;
  }
  addTask(): void {

    let copy = localStorage.getItem('todos');
    const titleObj = document.getElementById('title-input') as HTMLInputElement;
    const title = titleObj.value;
    const textObj = document.getElementById('text-input') as HTMLInputElement;
    const text = textObj.value;
    const amountObj = document.getElementById('amount-input') as HTMLInputElement;
    const amount = amountObj.value;
    if ((title + text + amount).length > 0) {
      //add to localStorage and call listUpdate()
      let newTodo = title + '%' + text + '%' + amount + '%]'
      //update local storage and the list
      console.log('added, ls ' + (copy + newTodo));
      // alert('added, ls ' + (copy + newTodo));
      localStorage.setItem('todos', copy + newTodo);
      this.listUpdate();
    }

  }
  clearLocalStorage() {
    localStorage.setItem('todos', '');
    this.listUpdate();
  }


  //////
  updateSelect(): void {
    const select = document.getElementById('select') as HTMLSelectElement;
    this.select = select.value;
  }

  updateDisplay(msg: string): void {
    const display = document.getElementById('display') as HTMLDivElement;
    display.innerText = msg;
  }

  shout(): void {
    const input = document.getElementById('msg') as HTMLInputElement;
    switch (this.select) {
      case 'Alert': this.say.alert(input.value); break;
      case 'Console': this.say.console(input.value); break;
      case 'UI': this.updateDisplay(input.value); break;
      case 'Dialog': dialog.open(input.value); break;
    }
  }
}
export const module = new Module();
export const dialog = new Dialog();
