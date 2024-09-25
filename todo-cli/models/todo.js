<<<<<<< HEAD
// models/todo.js
'use strict';
const {
  Model
} = require('sequelize');
=======
"use strict";
const { Op } = require("sequelize");
const { Model } = require("sequelize");

>>>>>>> 0a2250f (batman)
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      // Overdue tasks
      const overdueTasks = await this.overdue();
      console.log("Overdue");
<<<<<<< HEAD
      const overdueTasks = await Todo.overdue();
      overdueTasks.forEach(task => console.log(task.displayableString()));

=======
      overdueTasks.forEach((task) => {
        console.log(task.displayableString());
      });
>>>>>>> 0a2250f (batman)
      console.log("\n");

      // Due today tasks
      const dueTodayTasks = await this.dueToday();
      console.log("Due Today");
<<<<<<< HEAD
      const dueTodayTasks = await Todo.dueToday();
      dueTodayTasks.forEach(task => console.log(task.displayableString()));

=======
      dueTodayTasks.forEach((task) => {
        console.log(task.displayableString());
      });
>>>>>>> 0a2250f (batman)
      console.log("\n");

      // Due later tasks
      const dueLaterTasks = await this.dueLater();
      console.log("Due Later");
<<<<<<< HEAD
      const dueLaterTasks = await Todo.dueLater();
      dueLaterTasks.forEach(task => console.log(task.displayableString()));
=======
      dueLaterTasks.forEach((task) => {
        console.log(task.displayableString());
      });
>>>>>>> 0a2250f (batman)
    }

    static async overdue() {
      const today = new Date();
      return await Todo.findAll({
        where: {
<<<<<<< HEAD
          dueDate: {
            [DataTypes.Op.lt]: today
          }
        }
=======
          dueDate: { [Op.lt]: today },
          completed: false,
        },
>>>>>>> 0a2250f (batman)
      });
    }

    static async dueToday() {
<<<<<<< HEAD
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
=======
      const today = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format
>>>>>>> 0a2250f (batman)
      return await Todo.findAll({
        where: {
          dueDate: {
            [DataTypes.Op.gte]: startOfDay,
            [DataTypes.Op.lt]: endOfDay
          }
        }
      });
    }

    static async dueLater() {
      const today = new Date();
      return await Todo.findAll({
        where: {
<<<<<<< HEAD
          dueDate: {
            [DataTypes.Op.gt]: today
          }
        }
=======
          dueDate: { [Op.gt]: today },
          completed: false,
        },
>>>>>>> 0a2250f (batman)
      });
    }

    static async markAsComplete(id) {
<<<<<<< HEAD
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
    paranoid: false
  });
=======
      const todo = await Todo.findByPk(id);
      if (todo) {
        todo.completed = true;
        await todo.save();
      }
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const formattedDate = this.dueDate;
      return `${this.id}. ${checkbox} ${this.title.trim()} ${formattedDate}`;
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

>>>>>>> 0a2250f (batman)
  return Todo;
};
