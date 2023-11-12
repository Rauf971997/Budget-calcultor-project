const _isDone = false;

function Task(id, description, cost) {
  if (!(this instanceof Task)) {
    throw new Error('Нельзя вызывать без new');
  }

  if (new.target === Task) {
    throw new Error("Нельзя создавать экземпляры этого класса");
  }

  const _id = Math.random().toString(16).slice(2);
  const _description = description;
  const _cost = (cost >= 0) ? cost : "Недопустимое значение";


  Object.defineProperties(this, {
    'id': {
      get: function () {
        return _id;
      }
    },
    'description': {
      get: function () {
        return _description;
      }
    },
    'cost': {
      get: function () {
        return _cost;
      }
    },

    'isDone': {
      get: function () {
        return _isDone;
      }
    }

  });
}


// My First Part  end

// IncomeTask start
class IncomeTask {
  #budget; 

  constructor(id, description, cost, budget) {
    Task.call(this, id, description, cost);
    this.#budget = budget;
    this.isIncome = true; 
  }

  makeDone() {
    this.#budget.income += this.cost;
    this.isDone = true;
  }

  makeUnDone() {
    this.#budget.income -= this.cost;
    this.isDone = false;
  }
}

Object.setPrototypeOf(IncomeTask.prototype, Task.prototype);
// incomeTask end



// start class expenseTask
class ExpenseTask{
  #budget; 

  constructor(id, description, cost, budget) {
    Task.call(this, id, description, cost);
    this.#budget = budget;
    this.isIncome = false;  
  }

  makeDone() {
    this.#budget.expenses += this.cost;
    this.isDone = true;
  }

  makeUnDone() {
    this.#budget.expenses -= this.cost;
    this.isDone = false;
  }

}

Object.setPrototypeOf(ExpenseTask.prototype, Task.prototype);
// end class expenseTask


//   class Task controller starts
class TasksController {
  #tasks = [];
  constructor() {
   this.#tasks = [];
 }

//  add method start
  addTasks(...Tasks) {
    for (let i = 0; i < Tasks.length; i++) {
      const task = Tasks[i];
      let taskExists = false;

      for (let j = 0; j < this.#tasks.length; j++) {
        if (this.#tasks[j].id === task.id) {
          taskExists = true;
          break;
        }
      }

      if (!taskExists) {
        this.#tasks.push(task);
      }
    }
  }

//  add method end

// delete method start
  deleteTask(Task) {
    let taskIndex = -1;

    for (let i = 0; i < this.#tasks.length; i++) {
      if (this.#tasks[i].id === Task.id) {
        taskIndex = i;
        break;
      }
    }

    if (taskIndex !== -1) {
      this.#tasks.splice(taskIndex, 1);
      console.log(`Задача ${Task.id} удалена`);
    } else {
      console.log(`Задача ${Task.id} не найдена`);
      return;
    }
  }
// delete method end


  getTasks() {
    return [...this.#tasks];
  }



  getTasksSortedBy(string) {
   let tasks = [...this.#tasks];
    let sortingFunction;
    switch (string) {
      case 'description':{
        sortingFunction = function (a, b) {
          const descriptionA = a.description.toLowerCase();
          const descriptionB = b.description.toLowerCase();
          if (descriptionA < descriptionB) return -1;
          if (descriptionA > descriptionB) return 1;
          return 0;
        };
        break;
      }

      case 'status':{
        sortingFunction = function (a, b) {
          return b.status - a.status;
        };
        break;
      }
      
      case 'cost':{
        sortingFunction = function (a, b) {
          return b.cost - a.cost;
        };
        break;
      }
        
      default:{
        return tasks;
      }
      
    }

    tasks.sort(sortingFunction);

    return tasks;
  }




  getFilteredTasks(filterObject) {
    let description = filterObject.description;
    let isIncome = filterObject.isIncome;
    let isCompleted = filterObject.isCompleted;
    
    let filteredTasks = [...this.#tasks];
  
    if (description) {
      filteredTasks = filteredTasks.filter(function (task) {
        return task.description.includes(description);
      });
    }
  
    if (isIncome !== undefined) {
      filteredTasks = filteredTasks.filter(function (task) {
        return task instanceof IncomeTask === isIncome;
      });
    }
  
    if (isCompleted !== undefined) {
      filteredTasks = filteredTasks.filter(function (task) {
        return task.isDone === isCompleted;
      });
    }
  
    return filteredTasks;
  }
  
}


class BudgetController {
  #tasksController;
  #budget;

  constructor(initialBalance = 0) {
    this.#tasksController = new TasksController();
    this.#budget = {
      balance: initialBalance,
      income: 0,
      expenses: 0,
    };
  }

  get balance() {
    return this.#budget.balance;
  }

  get income() {
    return this.#budget.income;
  }

  get expenses() {
    return this.#budget.expenses;
  }

  calculateBalance() {
    return this.#budget.balance + this.#budget.income - this.#budget.expenses;
  }

  getTasks() {
    return this.#tasksController.getTasks();
  }

  addTasks(...tasks) {
    this.#tasksController.addTasks(...tasks);
  }


  deleteTask(task) {
    const tasks = this.#tasksController.getTasks();
    let taskIndex = -1;
  
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === task.id) {
        taskIndex = i;
        break;
      }
    }
  
    if (taskIndex === -1) {
      console.log(`Task ${task.id} isn't recognized`);
      return;
    }
  
    if (tasks[taskIndex].isDone) {
      this.#tasksController.makeUnDone(task);
      this.#budget.expenses -= tasks[taskIndex].cost;
    }
  
    this.#tasksController.deleteTask(task);
  }
  

  doneTask(task) {
    const tasks = this.#tasksController.getTasks();
    let foundTask;
  
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === task.id) {
        foundTask = tasks[i];
        break;
      }
    }
  
    if (!foundTask) {
      console.log("Task " + task.id + " isn't recognized");
      return;
    }
  
    if (foundTask.isDone) {
      console.log('Task is already done');
      return;
    }
  
    foundTask.makeDone();
  }
  

  unDoneTask(task) {
    const tasks = this.#tasksController.getTasks();
    let foundTask;
  
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === task.id) {
        foundTask = tasks[i];
        break;
      }
    }
  
    if (!foundTask) {
      console.log("Task " + task.id + " isn't recognized");
      return;
    }
  
    if (!foundTask.isDone) {
      console.log("Task " + task.id + " isn't done before");
      return;
    }
  
    foundTask.makeUnDone();
  }

}


