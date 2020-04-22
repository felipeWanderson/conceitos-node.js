const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0}
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'repository id is not valid.'});
  }

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository is not found.'});
  }

  const repository = { id, title, url, techs, likes: 0};

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'repository id is not valid.'});
  }

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository is not found.'});
  }

  repositories.splice(repositoryIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'repository id is not valid.'});
  }

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository is not found.'});
  }

  const likedRepository = repositories.find(repository => {
    if(repository.id === id) {
      repository.likes += 1
      return repository;
    }
  });
  console.log(likedRepository); 
  return response.json(likedRepository);
});

module.exports = app;
