import os
import requests
from dotenv import load_dotenv

load_dotenv()

TMDB_API_KEY = os.getenv("TMDB_API_KEY")
BASE_URL = "https://api.themoviedb.org/3"

def get_headers():
    return {
        "Authorization": f"Bearer {TMDB_API_KEY}",
        "Content-Type": "application/json;charset=utf-8"
    }

def search_multi(query):
    """
    Search for movies, TV shows, and people.
    """
    url = f"{BASE_URL}/search/multi"
    params = {
        "api_key": TMDB_API_KEY,
        "query": query,
        "include_adult": "false",
        "language": "en-US",
        "page": 1
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        results = response.json().get("results", [])
        # Filter for only movie, tv, person
        return [r for r in results if r["media_type"] in ["movie", "tv", "person"]]
    return []

def get_details(tmdb_id, media_type):
    """
    Fetch full details for a movie or TV show, including credits and keywords.
    """
    append_to_response = "credits,keywords"
    if media_type == "tv":
        append_to_response = "credits,keywords,created_by" # created_by is in base response but good to check
        
    url = f"{BASE_URL}/{media_type}/{tmdb_id}"
    params = {
        "api_key": TMDB_API_KEY,
        "append_to_response": append_to_response,
        "language": "en-US"
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    return None

def extract_dna(details, media_type):
    """
    Extract DNA markers (Actors, Creators, Studios, Keywords) from details.
    """
    dna = {
        "actors": [],
        "creators": [],
        "studios": [],
        "genres": [],
        "keywords": []
    }
    
    # Actors (Cast - top 5)
    cast = details.get("credits", {}).get("cast", [])
    dna["actors"] = [member["name"] for member in cast[:5]]
    
    # Creators
    if media_type == "movie":
        crew = details.get("credits", {}).get("crew", [])
        directors = [member["name"] for member in crew if member["job"] == "Director"]
        dna["creators"] = directors
    elif media_type == "tv":
        creators = details.get("created_by", [])
        dna["creators"] = [c["name"] for c in creators]
        
    # Studios / Networks
    if media_type == "movie":
        companies = details.get("production_companies", [])
        dna["studios"] = [c["name"] for c in companies[:3]]
    elif media_type == "tv":
        networks = details.get("networks", [])
        dna["studios"] = [n["name"] for n in networks[:2]]
        
    # Genres
    genres = details.get("genres", [])
    dna["genres"] = [g["name"] for g in genres]
    
    # Keywords
    if media_type == "movie":
        keywords = details.get("keywords", {}).get("keywords", [])
    else:
        keywords = details.get("keywords", {}).get("results", [])
        
    dna["keywords"] = [k["name"] for k in keywords[:10]]
    
    return dna

def vectorize(tmdb_id, media_type):
    """
    Fetch details and return the full vector object for database.
    """
    details = get_details(tmdb_id, media_type)
    if not details:
        return None
        
    dna = extract_dna(details, media_type)
    
    return {
        "tmdb_id": details["id"],
        "title": details.get("title") or details.get("name"),
        "type": "Movie" if media_type == "movie" else "TV",
        "year": int((details.get("release_date") or details.get("first_air_date") or "0000")[:4]),
        "poster_url": f"https://image.tmdb.org/t/p/w500{details.get('poster_path')}" if details.get("poster_path") else None,
        "dna_vector": dna
    }

def get_watch_providers(tmdb_id, media_type):
    """
    Fetch 'flatrate' (subscription) providers for US region.
    Returns a list of dicts: {'name': str, 'logo_path': str}
    """
    url = f"{BASE_URL}/{media_type}/{tmdb_id}/watch/providers"
    params = {"api_key": TMDB_API_KEY}
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", {})
            us_data = results.get("US", {})
            
            # We only care about subscription (flatrate) for now
            providers = us_data.get("flatrate", [])
            
            # Return simplified list
            return [{
                "name": p["provider_name"],
                "logo_path": f"https://image.tmdb.org/t/p/w92{p['logo_path']}"
            } for p in providers]
            
    except Exception as e:
        print(f"Error fetching providers for {tmdb_id}: {e}")
        
    return []

def  get_recommendations_from_seeds(seeds, count=10, min_score=0, exclude_ids=None):
    """
    seeds: List of strings (titles)
    count: int
    min_score: float (0-10 mapped from inputs)
    Returns: (results, mode)
    """
    excluded = set(exclude_ids or [])
    seed_ids = []
    seed_genres = set()
    seed_keywords = set()
    
    # Budget Sniffer Data
    total_budget = 0
    budget_count = 0
    
    # 1. Resolve Seeds
    print(f"Resolving seeds: {seeds}")
    for title in seeds:
        if not title: continue
        results = search_multi(title)
        if results:
            # Picking first match
            match = results[0]
            seed_ids.append((match['id'], match['media_type']))
            
            # Fetch details for genes/keywords
            details = get_details(match['id'], match['media_type'])
            if details:
                # Accumulate Budget/Revenue (Only for movies really)
                if match['media_type'] == 'movie':
                    budget = details.get("budget", 0)
                    if budget > 0:
                        total_budget += budget
                        budget_count += 1
                        
                if 'genres' in details:
                    for g in details['genres']: seed_genres.add(g['id'])
                # Keywords structure varies
                k_results = details.get("keywords", {}).get("keywords", []) if match['media_type'] == 'movie' else details.get("keywords", {}).get("results", [])
                for k in k_results: seed_keywords.add(k['id'])

    if not seed_ids:
        return [], "Unknown"

    # Determine Mode (Budget Sniffer)
    avg_budget = (total_budget / budget_count) if budget_count > 0 else 0
    mode = "BALANCED" # Default
    if avg_budget > 50_000_000:
        mode = "BLOCKBUSTER"
    elif avg_budget < 20_000_000 and budget_count > 0:
        mode = "INDIE"
        
    print(f"Detected Mode: {mode} (Avg Budget: ${avg_budget:,.2f})")

    # 2. Discover Similar
    # Simplified approach: Use genres and keywords from seeds to discover new content
    # For a robust "Blend", we'd query for each seed's recommendations and merge, 
    # but 'discover' with explicit filters is also good for finding "In the middle"
    
    # Let's try blending recommendations from each seed first, as it's often higher quality "DNA" match
    candidate_pool = {} # id -> {score, data}
    
    for tmdb_id, media_type in seed_ids:
        url = f"{BASE_URL}/{media_type}/{tmdb_id}/recommendations"
        params = {
            "api_key": TMDB_API_KEY,
            "language": "en-US",
            "page": 1
        }
        resp = requests.get(url, params=params)
        if resp.status_code == 200:
            recs = resp.json().get("results", [])
            for item in recs:
                # Filter by score immediately
                if item.get("vote_average", 0) < min_score:
                    continue

                rid = item["id"]
                # Infer media_type: typed endpoints don't always include it in items
                item_media_type = item.get("media_type") or media_type

                if rid not in candidate_pool:
                    candidate_pool[rid] = {
                        "data": item,
                        "media_type": item_media_type,
                        "hits": 1,
                        "total_score": item.get("vote_average", 0),
                        "popularity": item.get("popularity", 0)
                    }
                else:
                    candidate_pool[rid]["hits"] += 1
                    candidate_pool[rid]["total_score"] += item.get("vote_average", 0)
    
    # 3. Adaptive Sorting (The Forked Logic)
    def sort_key(x):
        # x is the candidate dict provided above
        hits = x["hits"]
        score = x["total_score"] # This is sum of vote_averages from overlaps
        pop = x["popularity"]
        avg_score = x["data"].get("vote_average", 0)
        
        if mode == "BLOCKBUSTER":
            # Primary: Hits, Secondary: Popularity (Proxy for revenue/star power), Tertiary: Score
            # Boost popularity influence
            return (hits, pop, avg_score)
        elif mode == "INDIE":
            # Primary: Hits, Secondary: Critical Score (Vote Average)
            return (hits, avg_score, pop)
        else:
            # Balanced
            return (hits, avg_score, pop)

    sorted_candidates = sorted(
        candidate_pool.values(), 
        key=sort_key, 
        reverse=True
    )
    
    # Format for frontend
    final_results = []
    seen = set()
    for c in sorted_candidates:
        item = c["data"]
        # Avoid showing seeds in results
        if item["id"] in [s[0] for s in seed_ids]: continue
        if item["id"] in excluded: continue
        if item["id"] in seen: continue
        seen.add(item["id"])

        # Use tracked media_type (fixes TV recommendations defaulting to "movie")
        media_type = c.get("media_type") or item.get("media_type") or "movie"

        # Add Streaming Providers
        providers = get_watch_providers(item["id"], media_type)

        final_results.append({
            "id": item["id"],
            "title": item.get("title") or item.get("name"),
            "poster_path": item.get("poster_path"),
            "vote_average": item.get("vote_average"),
            "release_date": item.get("release_date") or item.get("first_air_date"),
            "media_type": media_type,
            "overview": item.get("overview", ""),
            "original_language": item.get("original_language", ""),
            "genre_ids": item.get("genre_ids", []),
            "providers": providers
        })
        
        if len(final_results) >= count:
            break
            
    return final_results, mode
