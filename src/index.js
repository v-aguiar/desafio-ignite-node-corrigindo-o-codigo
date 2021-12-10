const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

// Middlewares
function validateId(request, response, next) {
  const { id } = request.params;

  const isUuid = validate( id );

  if ( !isUuid ) { return response.status(400).json({ error: 'Invalid id!' }) }

  const repository = repositories.find( repository => repository.id === id);

  if ( !repository ) { response.status(404).json({ error: 'Repository not found!' }) }

  request.repository = repository;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const techsArray = techs.split(`,\ `)

  techsArray.forEach( tech => {
    tech = tech.trim()
  });

  const repository = {
    id: uuid(),
    title,
    url,
    techs: techsArray,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", validateId, (request, response) => {
  const { title, url, techs } = request.body
  const { repository } = request;

  const techsArray = techs.split(`,\ `)

  techsArray.forEach( tech => {
    tech = tech.trim()
  });

  repository.title = title;
  repository.url = url;
  repository.techs = techsArray;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex > 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repositories[repositoryIndex].likes;

  return response.json('likes');
});

module.exports = app;
