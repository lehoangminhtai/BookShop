import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def preprocess_data(data):
    df = pd.DataFrame(data)

    # Normalize visits và click_count
    scaler = MinMaxScaler()
    df[['click_norm']] = scaler.fit_transform(df[['click_count']])

    df['rating'] = pd.to_numeric(df['rating'], errors='coerce')
    
    # Tính toán điểm đánh giá cuối cùng
    df['final_rating'] = 0.7 * df['rating'] + 0.1 * df['click_norm']
    df['final_rating'] = df['final_rating'].clip(1, 5)

    return df
