const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// Get todo API with status = TO DO
app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const getTodoQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
    status LIKE '%${status}%'
    ORDER BY
      id;`;
  const todoArray = await db.all(getTodoQuery);
  response.send(todoArray);
});

// Get todo API with priority = HIGH
app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const getTodoWithPriorityHighQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
    priority LIKE '%${priority}%'
    ORDER BY
      id;`;
  const todoArrayPriorityHigh = await db.all(getTodoWithPriorityHighQuery);
  response.send(todoArrayPriorityHigh);
});

// Get todo API with priority = HIGH and status = TO DO
app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const getTodoWithPriorityHighAndStatusQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
    priority LIKE '%${priority}%'
    AND
    status LIKE '%${status}%'
    ORDER BY
      id;`;
  const todoArrayPriorityHighAndStatus = await db.all(
    getTodoWithPriorityHighAndStatusQuery
  );
  response.send(todoArrayPriorityHighAndStatus);
});

// Get todo API with todo = play
app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const getTodoWithPlayQuery = `
    SELECT
      *
    FROM
      todo
    WHERE
    todo LIKE '%${search_q}%'
    ORDER BY
      id;`;
  const todoArrayPlay = await db.all(getTodoWithPlayQuery);
  response.send(todoArrayPlay);
});

//Get todo API
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoQuery = `SELECT
      *
    FROM
      todo
    WHERE
      id = ${todoId};`;
  const todo = await db.get(getTodoQuery);
  response.send(todo);
});

//Post Todo API
app.post("/todos/", async (request, response) => {
  const todoDetails = request.body;
  const { id, todo, priority, status } = todoDetails;
  const addTodoQuery = `INSERT INTO
        todo (id,todo,priority,status)
        VALUES
        (
        '${id}',
         ${todo},
         ${priority},
         ${status},
         );`;
  await db.run(addTodoQuery);
  response.send("Todo Successfully Added");
});

//Put Todo API
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { status } = todoDetails;
  const updateTodoQuery = `UPDATE
      todo
    SET
      status='${status}'
    WHERE
      id = ${todoId};`;
  await db.run(updateTodoQuery);
  response.send("Status Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { priority } = todoDetails;
  const updateTodoPriorityQuery = `UPDATE
      todo
    SET
      priority='${priority}'
    WHERE
      id = ${todoId};`;
  await db.run(updateTodoPriorityQuery);
  response.send("Priority Updated");
});

app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoDetails = request.body;
  const { todo } = todoDetails;
  const updateTodoQuery = `UPDATE
      todo
    SET
      todo ='${todo}'
    WHERE
      id = ${todoId};`;
  await db.run(updateTodoQuery);
  response.send("Todo Updated");
});

//Delete Todo API
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodoQuery = `DELETE FROM 
      todo
    WHERE
      id = ${todoId};`;
  await db.run(deleteTodoQuery);
  response.send("Todo Deleted");
});

module.exports = app;
