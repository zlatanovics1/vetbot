# Vetbot - Vet Clinic

FastAPI+Next.js+Llamaindex (RAG) based app.

## Tech stack

Tech stack/pattern choice - why?

### Frontend

1. Next.js - ease of routing, SSR(slightly irrelevant for this project)
2. React query - automatic revalidation, easy management of global async state
3. TailwindCSS - easy and fast styling

### Backend

1. FastAPI - fast and easy to spin up, prod-ready

2. Postgres - robust, reliable, JSONB support, full-text search (you will see why this is beneficial later), strong cloud support

3. PG Vector (hnsw) for storing embeddings - keep data at the same point (do joins, combine queries and semantic searches), attach metadata, retrieve entities along with an embedding for > context accuracy. Works well under 2000dim (set it to 1536 since it's most optimal for an openai embedding model), and you get all the native PG pros. Of course, for extremely large scale projects you would be better off with Qdrant - with extra db management

4. LlamaIndex - Started off the project with custom RAG (left some commented code on purpose), but quickly realized that llama pros outweight an extra library "bloat". Llama worked extremely well with my exisiting PG setup, offered pg_vector support out of the box, and most importantly - provided hybrid search capabilities. Markdown chunking worked great for our use case.

5. Hybrid Search - Based on the "Retrieval Relevance" Eval I've put out there, using hybrid approach greatly impacted the context relevance. Why? I would say it's rather specific to this project. The nature of VetBot queries - a high change that they will contain a lot of keywords. Since this is FAQ based doc (and chunks), choosing this approach is benefical. Before hybrid, due to the somewhat irrelevant contexts, model answered using its own knowledge.

6. Evals - the RR eval is the most imporant one here (nature of the docs and project itself), altough in the future I would add Groundedness evals and automate scoring - for better prompt, chunking, and other iterations

### GenAI

Data -> Chunking -> Embedding -> PG Vector <- Query Engine (LlamaIndex) <- Chat Engine (LlamaIndex) -> ChatStore (Postgres) -> Streaming to Frontend

1. **Data**

   You can find the RAG data in src/rag/data. It's a generated document that includes different fields in Pet Care. QA pairs are short to simulate FAQ based doc.

2. **Chunking / Embedding**

   Chunking is done via Llama's MarkdownNodeParser (NodeParser, not Splitters, can attach metadata along with some other properties). If FAQ docs start using images, and tables - use unstructured (commented out)

   Embedding is handled by OpenAI Embedding Model that works great with our HNSW index we set up in PGSQL.

3. **Retrieval**

   Llama's ChatEngine uses retrieval tool behind the scenes, builds out messages and saves them under ChatStore in PGSQL. It is configured to use Hybrid Search (by utilizing pgsql's full-text search capabilites). The whole flow of this system is saved in ChatStore, and is linked to the Feedback table. Users can click thumbs up/down and give feedback for the given chat. This allows us to focus on negatives, and look up the whole RAG flow, find bottlenecks, and reverse-engineer our way into optimizing it, after pushing to production.

4. **Integration with the frontend**

   Responses are streamed using fastapi's StreamingResponse. On the first message, the first chunk that is yieled is the chatID itself.

## How to run locally

### Clone the repo

```
git clone https://github.com/zlatanovics1/vetbot.git
cd vetbot
```

### Backend Setup

This project is configured to work with UV - extra fast python package manager.

1. Please visit [this site](https://docs.astral.sh/uv/getting-started/installation/#installation-methods) and download uv first.

```
cd backend
uv init
```

2. Create and populate .env file.
   Example:

```
# used by sqlmodel/llamaindex/alembic
DATABASE_URL = postgresql://postgres:postgres@postgres:5432/postgres
OPENAI_API_KEY = <insert your api key>
APP_ENV = local
# needed for pgsql init
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
# optional - if app env != production
SENTRY_DSN = <>
```

3. Run the services from docker-compose.yaml

Make sure Docker Desktop is running on your machine. Then, hop into /backend dir and run:
`docker compose up`

4. Set up migrations

Either run your migrations directly from fast-api container, or change the db_url from:

`postgresql://postgres:postgres@postgres:5432/postgres`

to

`postgresql://postgres:postgres@localhost:5432/postgres`

because your machine won't be able to resolve "postgres" to any address.

**NOTE**: You MUST add pg_vector extension before you run any other migrations. To do so, run:

```
uv run alembic revision --autogenerate -m "Initial migration"
```

Then, open the generated migration file under migrations/versions, and add this line in `upgrade` function:

`op.execute("CREATE EXTENSION IF NOT EXISTS vector")` (you must use op!)

If you reset the migrations (i.e. do alembic init migrations again), please import all your models at the top of `migrations/env.py`, and sqlmodel, pgvector at the top of `migrations/script.py.mako`.

5. Set up DB

Use ingest_data function from `src/rag/ingestion.py` to populate the pg_vector table. Please make sure your .envs are loaded - openai api key is needed for this step.

Table naming conventions from Llamaindex can be confusing. If you want to `psql` into your db and explore the data, run this query for easy table name lookup:

```
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE';
```

6. All done

Visit 0.0.0.0:8080/docs, explore the backend structure and feel free to modify it as you like.

Change FAQ Data, Generate new QA pairs for evals, try out different evals. It all comes down to the same logic used in `src/rag/evals`

### Frontend setup

From the root directory:

```
cd frontend
npm install
...
npm run dev
```

You can visit the app at: localhost:3000
