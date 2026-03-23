import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from tmdb import get_recommendations_from_seeds

app = FastAPI()

_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in _origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MovieRequest(BaseModel):
    favorite_movies: list[str]
    count: int = 10
    min_score: float = 0
    exclude_ids: list[int] = []
    decade_start: int = 0

@app.post("/generate-dna")
def generate_dna(request: MovieRequest):
    seeds = [m.strip() for m in request.favorite_movies if m.strip()]
    count = max(1, min(20, request.count))
    results, mode = get_recommendations_from_seeds(
        seeds,
        count=count,
        min_score=request.min_score,
        exclude_ids=request.exclude_ids,
        decade_start=request.decade_start,
    )
    return {"results": results, "mode": mode}
