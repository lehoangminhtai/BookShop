# predict.py
from flask import Flask, request, jsonify
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime
import pandas as pd
import pickle
from surprise import Reader, Dataset

import os
from flask_cors import cross_origin
import requests
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

def preprocess_data(data):
    df = pd.DataFrame(data)

    # Normalize click_count
    scaler = MinMaxScaler()
    df[['click_norm']] = scaler.fit_transform(df[['click_count']])

    df['rating'] = pd.to_numeric(df['rating'], errors='coerce')

    # Tính toán điểm đánh giá cuối cùng
    df['final_rating'] = 0.7 * df['rating'] + 0.1 * df['click_norm']
    df['final_rating'] = df['final_rating'].clip(1, 5)

    return df

# Load mô hình đã huấn luyện
with open("svd_model.pkl", "rb") as f:
    model = pickle.load(f)

@app.route("/recommend", methods=["POST"])
@cross_origin(origins=["http://localhost:3000"], supports_credentials=True)
def recommend():
    userId = request.json.get("userId")

    BASE_API_URL = os.environ.get("BACKEND_URL")
    # print("BASE_API_URL:", BASE_API_URL)

    url = f"http://localhost:4000/api/interaction/suggestion"

    response = requests.get(url)
    print(response)
    if response:
        print("Data fetched successfully from the external service.")
    else:
        print("Failed to fetch data from the external service.")

    data = response.json()['data']

    # print(data) 

    df = preprocess_data(data)
    if userId:
        all_book_ids = df['bookId'].unique().tolist()
        # print("All doctor IDs:", all_book_ids)
        known_bookIds = df[df['userId'] == userId]['bookId'].tolist()
        unseen_bookIds = [doc_id for doc_id in all_book_ids if doc_id not in known_bookIds]

        specialty_df = df[df['userId'] == userId]
        top_specialty = None
        if not specialty_df.empty:
            top_specialty = specialty_df.groupby('categoryId')[['click_count']].sum().sum(axis=1).idxmax()
        print("Top specialty ID:", top_specialty)
        top_specialty_doctors = df[df['categoryId'] == top_specialty]['bookId'].unique().tolist()
    else:
        known_bookIds = []

    predictions = []
    for doc_id in all_book_ids:
        pred = model.predict(userId, doc_id)
        bonus = 0.0

        if doc_id in top_specialty_doctors:
            bonus += 0.4

        df['last_visit_date'] = pd.to_datetime(df['last_visit_date'], errors='coerce')
        recent_date = df[df['bookId'] == doc_id]['last_visit_date'].max()
        if pd.notnull(recent_date):
            recent_date = recent_date.tz_localize(None) 
            days_ago = (datetime.now() - recent_date).days
            recent_bonus = max(0, (30 - days_ago) / 30) * 0.1
            bonus += recent_bonus

        if doc_id not in known_bookIds:
            bonus += 0.15

        predictions.append((doc_id, pred.est + bonus))

    predictions.sort(key=lambda x: x[1], reverse=True)
    # plot_predictions(predictions[:8])  # Vẽ top 8 doctor được đề xuất

    results = [{'bookId': doc_id, 'predicted_rating': round(score, 2)} for doc_id, score in predictions[:8]]
    return jsonify({
        "status": 200,
        "success": True,
        "message": "Success",
        "data": results
    })

# import matplotlib.pyplot as plt

# def plot_predictions(predictions):
#     bookIds = [str(doc_id) for doc_id, _ in predictions]
#     scores = [round(score, 2) for _, score in predictions]

#     plt.figure(figsize=(10, 6))
#     bars = plt.bar(bookIds, scores, color='lightgreen')
#     plt.title('Top Recommended Doctors')
#     plt.xlabel('Doctor ID')
#     plt.ylabel('Predicted Rating')
#     plt.ylim(0, 6)

#     for bar, score in zip(bars, scores):
#         yval = bar.get_height()
#         plt.text(bar.get_x() + bar.get_width() / 2, yval + 0.1, f'{score}', ha='center', va='bottom')

#     plt.tight_layout()
#     plt.savefig("recommendation_chart.png")
#     plt.close()

from surprise import accuracy

@app.route("/evaluate", methods=["GET"])
def evaluate():
    BASE_API_URL = os.environ.get("BACKEND_URL")
    url = f"{BASE_API_URL}/user/suggestions?limit=100"
    response = requests.get(url)
    data = response.json()['data']

    df = preprocess_data(data)

    reader = Reader(rating_scale=(0, 5))
    df = df.dropna(subset=['rating'])
    dataset = Dataset.load_from_df(df[['userId', 'bookId', 'rating']], reader)
    trainset = dataset.build_full_trainset()

    predictions = model.test(trainset.build_testset())

    rmse = accuracy.rmse(predictions)
    mae = accuracy.mae(predictions)

    return jsonify({
        "status": 200,
        "message": "Evaluation success",
        "rmse": round(rmse, 4),
        "mae": round(mae, 4)
    })


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5050))
    app.run(host="0.0.0.0", port=port)
