//найти элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];


if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach((task) => renderTask(task));

}


checkEmptyList();



// добавление задачи
form.addEventListener('submit', addTask);  //передаем функцию addTask без () - запуска, только название, для запуска после submit


// удаление задачи  (клик будет слушатся не по кнопке, а по всему тегу задачь tasksList - по кнопке удалить)
tasksList.addEventListener('click', deleteTask);

// Отмечаем задачу как завершонную
tasksList.addEventListener('click', doneTask)





// функции
function addTask(event) {                 //function declaration - вызов до объявления в коде
  const taskText = taskInput.value

  const newTask = {
    id: Date.now(), //формирует время в милисек
    text: taskText,
    done: false,
  };

    //дабавить задачу в массив
  tasks.push(newTask)
    
    //добавить задачу в хранилеще браузера LocalStorage
  saveToLocalStorage();

  renderTask(newTask);

    // очистить поле ввода и вернем на него фокус
    taskInput.value = '';
    taskInput.focus();  //сейчас не отрабатывает - поправить

    checkEmptyList();
    
 
}

//видим элемент по которому происходит клик (если клик идет по картинке, в css прописан pointer-events: none; - снимает события с пикчи)
function deleteTask(event) {
 
  
  //Проверит, если клик был НЕ по кнопке "удалить задачу"
  if (event.target.dataset.action !== 'delete') return;

    if (event.target.dataset.action === 'delete') {
      const parenNode = event.target.closest('.list-group-item');    //ищет родителей кнопки
     
      //отпределяем id задачи
      const id = Number(parenNode.id);
      
      //находим индекс задачи в массиве
      const index = tasks.findIndex( (task) => task.id === id);

      //удалить задачу из массива
      tasks.splice(index, 1)

      //добавить задачу в хранилеще браузера LocalStorage
      saveToLocalStorage();


      parenNode.remove()  //вызов метода remove
      
    }
      checkEmptyList();
}


function doneTask(event) {
  //Проверем что клик был НЕ по кнопке задача выполнена
  if (event.target.dataset.action !== "done") return;


  //проверить, что клик был по кнопке выполнить задачу
  if (event.target.dataset.action === "done") {
    const parentNode = event.target.closest('.list-group-item');

  //Определим id задачи
    const id = Number(parentNode.id);
    const task = tasks.find( (task) => task.id === id)
    task.done =!task.done


    //добавить задачу в хранилеще браузера LocalStorage
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');  //уже работаем с classList - точку не ставим. toggle - добавит или уберет 
  
  }

  
}


function saveHTMLtoLS() {
  localStorage.setItem('tasksHTML', tasksList.innerHTML);
}

function checkEmptyList() {
  if (tasks.length === 0) {         //length - покажет количество елементов в массиве
      const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Ваш список дел пуст</div>
				</li>`;
      tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector(`#emptyList`);
    emptyListEl ? emptyListEl.remove() : null;


  }
}


function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}


function renderTask(task) {
  //формируем css класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    //формирует разметку под новую задачу
  const taskHTML = `
          <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
              <button type="button" data-action="done" class="btn-action">
                <img src="./img/tick.svg" alt="Done" width="18" height="18">
              </button>
              <button type="button" data-action="delete" class="btn-action">
                <img src="./img/cross.svg" alt="Done" width="18" height="18">
              </button>
            </div>
          </li>`;

    // Добавление задачи на страницу, в тег ul
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
