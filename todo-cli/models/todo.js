"use strict";
const { Op } = require("sequelize");
const { Model } = require("sequelize");

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
      overdueTasks.forEach((task) => {
        console.log(task.displayableString());
      });
      console.log("\n");

      // Due today tasks
      const dueTodayTasks = await this.dueToday();
      console.log("Due Today");
      dueTodayTasks.forEach((task) => {
        console.log(task.displayableString());
      });
      console.log("\n");

      // Due later tasks
      const dueLaterTasks = await this.dueLater();
      console.log("Due Later");
      dueLaterTasks.forEach((task) => {
        console.log(task.displayableString());
      });
    }

    static async overdue() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: today },
          completed: false,
        },
      });
    }

    static async dueToday() {
      const today = new Date().toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format
      return await Todo.findAll({
        where: {
          dueDate: today,
          completed: false,
        },
      });
    }

    static async dueLater() {
      const today = new Date();
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: today },
          completed: false,
        },
      });
    }

    static async markAsComplete(id) {
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

  return Todo;
};
