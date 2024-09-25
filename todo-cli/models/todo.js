"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueTasks = await Todo.overdue();
      overdueTasks.forEach((task) => console.log(task.displayableString()));
      console.log("\n");

      console.log("Due Today");
      const todayTasks = await Todo.dueToday();
      todayTasks.forEach((task) => console.log(task.displayableString()));
      console.log("\n");

      console.log("Due Later");
      const laterTasks = await Todo.dueLater();
      laterTasks.forEach((task) => console.log(task.displayableString()));
    }

    // Fix: Include completed tasks as well
    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [sequelize.Op.lt]: new Date().toISOString().split("T")[0],
          },
        },
        order: [["dueDate", "ASC"]],
      });
    }

    static async dueToday() {
      const today = new Date().toISOString().split("T")[0];
      return await Todo.findAll({
        where: {
          dueDate: today,
        },
        order: [["dueDate", "ASC"]],
      });
    }

    // Fix: Include completed tasks as well
    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: {
            [sequelize.Op.gt]: new Date().toISOString().split("T")[0],
          },
        },
        order: [["dueDate", "ASC"]],
      });
    }

    // Fix: Ensure the task is marked as complete
    static async markAsComplete(id) {
      const task = await Todo.findByPk(id);
      if (task) {
        task.completed = true;
        await task.save();
      }
    }

    // Fix displayableString method
    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const today = new Date().toISOString().split("T")[0];

      // If task is due today, don't show the date
      if (this.dueDate === today) {
        return `${this.id}. ${checkbox} ${this.title.trim()}`;
      }

      // Show the date for overdue or future tasks
      return `${this.id}. ${checkbox} ${this.title.trim()} ${this.dueDate}`;
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};
