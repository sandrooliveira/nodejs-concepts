const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const validateIfRepositoryExists = (request, response, next) => {
  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryIndex < 0) {
    return response.status(400).json({ message: "This repository does not exist!" })
  }
  
  return next();
};

app.use('/repositories/:id', validateIfRepositoryExists); // We can put more middlewares here.

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const respositoryUpdated = {
    id,
    title,
    url,
    techs
  };
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const respository = {
    ...repositories[ repositoryIndex ],
    ...respositoryUpdated
  };

  repositories[ repositoryIndex ] = respository;

  return response.json(respository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  const repository = repositories[ repositoryIndex ]
  repository.likes++;

  return response.json(repository);
});

module.exports = app;
