// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTask(params) {
      return await Todo.create(params);
    }

    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueItems = await Todo.overdue();
      overdueItems.forEach((item) => console.log(item.displayableString()));
      console.log("\n");

      console.log("Due Today");
      const dueTodayItems = await Todo.dueToday();
      dueTodayItems.forEach((item) => console.log(item.displayableString()));
      console.log("\n");

      console.log("Due Later");
      const dueLaterItems = await Todo.dueLater();
      dueLaterItems.forEach((item) => console.log(item.displayableString()));
    }

    static async overdue() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.lt]: new Date().toLocaleDateString("en-CA") },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      return await Todo.findAll({
        where: {
          dueDate: new Date().toLocaleDateString("en-CA"),
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueLater() {
      return await Todo.findAll({
        where: {
          dueDate: { [Op.gt]: new Date().toLocaleDateString("en-CA") },
          completed: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async markAsComplete(id) {
      await Todo.update({ completed: true }, { where: { id: id } });
    }

    displayableString() {
      const checkbox = this.completed ? "[x]" : "[ ]";
      const dateString =
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? ""
          : ` ${this.dueDate}`;
      return `${this.id}. ${checkbox} ${this.title.trim()}${dateString}`.trim();
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
