from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import pandas as pd
from shopkeeper_model import run_inventory_analysis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # allow_origins=["*"],
    # allow_methods=["*"],
    # allow_headers=["*"],
    allow_origins=["http://localhost:3000"],  # or "*" for all origins (not recommended in prod)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload/")
async def upload_files(final_data: UploadFile = File(...), sales_data: UploadFile = File(...)):
    os.makedirs("files", exist_ok=True)

    final_path = f"files/{final_data.filename}"
    sales_path = f"files/{sales_data.filename}"

    with open(final_path, "wb") as f:
        shutil.copyfileobj(final_data.file, f)

    with open(sales_path, "wb") as f:
        shutil.copyfileobj(sales_data.file, f)

    run_inventory_analysis(final_path, sales_path)

    result_csv = "output/inventory_recommendations.csv"
    if not os.path.exists(result_csv):
        return {"error": "Prediction failed"}

    df = pd.read_csv(result_csv)
    return df.to_dict(orient="records")
