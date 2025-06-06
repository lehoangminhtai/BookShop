# train_model.py
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from surprise import Dataset, Reader, SVD
import json
import pickle

# Hàm xử lý dữ liệu
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

# Đọc dữ liệu từ file JSON
with open("book_train_data.json", "r") as f:
    data = json.load(f)

# Tiền xử lý dữ liệu
df = preprocess_data(data)

# Tạo dataset cho Surprise
reader = Reader(rating_scale=(1, 5))
dataset = Dataset.load_from_df(df[['userId', 'bookId', 'final_rating']], reader)
trainset = dataset.build_full_trainset()

# Huấn luyện mô hình SVD
model = SVD()
model.fit(trainset)

# Lưu mô hình đã huấn luyện
with open("svd_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("Model training completed and saved as 'svd_model.pkl'.")
