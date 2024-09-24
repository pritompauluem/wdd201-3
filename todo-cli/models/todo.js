// models/todo.js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueTasks = await Todo.overdue();
      overdueTasks.forEach(task => console.log(task.displayableString()));

      console.log("\n");

      console.log("Due Today");
      const dueTodayTasks = await Todo.dueToday();
      dueTodayTasks.forEach(task => console.log(task.displayableString()));

      console.log("\n");

      console.log("Due Later");
      const dueLaterTasks = await Todo.dueLater();
      dueLaterTasks.forEach(task => console.log(task.displayableString()));
    }

    static async overdue() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [DataTypes.Op.lt]: today
          }
        },
        order: [
          ['dueDate', 'ASC']
        ]
      });
    }

    static async dueToday() {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      return await Todo.findAll({
        where: {
          dueDate: {
            [DataTypes.Op.gte]: startOfDay,
            [DataTypes.Op.lt]: endOfDay
          }
        },
        order: [
          ['dueDate', 'ASC']
        ]
      });
    }

    static async dueLater() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: {
            [DataTypes.Op.gt]: today
          }
        },
        order: [
          ['dueDate', 'ASC']
        ]
      });
    }

    static async markAsComplete(id) {
      return await Todo.update({ completed: true }, {
        where: {
          id
        }
      });
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let dueDate = "";
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      if (this.dueDate < startOfDay) {
        dueDate = this.dueDate.toLocaleDateString();
      } else if (this.dueDate >= startOfDay && this.dueDate < endOfDay) {
        dueDate = "";
      } else {
        dueDate = this.dueDate.toLocaleDateString();
      }
      return `${this.id}. ${checkbox} ${this.title} ${dueDate}`;
    }
  }
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};
