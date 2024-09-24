// __tests__/todo.js
const db = require("../models/index");
const Todo = db.Todo;
const sequelize = db.sequelize;

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});

describe("Todo model", () => {
  beforeEach(async () => {
    await Todo.destroy({ where: {} });
  });

  it("should create a new Todo item", async () => {
    const todo = await Todo.create({
      title: "Test Todo",
      dueDate: "2024-09-24",
      completed: false,
    });
    expect(todo.id).toBeGreaterThan(0);
    expect(todo.title).toBe("Test Todo");
    expect(todo.dueDate).toBe("2024-09-24");
    expect(todo.completed).toBe(false);
  });

  it("should retrieve all Todo items", async () => {
    await Todo.create({
      title: "Todo 1",
      dueDate: "2024-09-24",
      completed: false,
    });
    await Todo.create({
      title: "Todo 2",
      dueDate: "2024-09-25",
      completed: false,
    });
    const todos = await Todo.findAll();
    expect(todos.length).toBe(2);
  });

  it("should update a Todo item", async () => {
    const todo = await Todo.create({
      title: "Test Todo",
      dueDate: "2024-09-24",
      completed: false,
    });
    await todo.update({ title: "Updated Todo" });
    const updatedTodo = await Todo.findByPk(todo.id);
    expect(updatedTodo.title).toBe("Updated Todo");
  });

  it("should delete a Todo item", async () => {
    const todo = await Todo.create({
      title: "Test Todo",
      dueDate: "2024-09-24",
      completed: false,
    });
    await todo.destroy();
    const deletedTodo = await Todo.findByPk(todo.id);
    expect(deletedTodo).toBeNull();
  });

  it("should mark a Todo item as complete", async () => {
    const todo = await Todo.create({
      title: "Test Todo",
      dueDate: "2024-09-24",
      completed: false,
    });
    await Todo.markAsComplete(todo.id);
    const completedTodo = await Todo.findByPk(todo.id);
    expect(completedTodo.completed).toBe(true);
  });
});
