import pandas as pd
import os

def clean_data_file(input_path, output_path):
    # Read the data
    df = pd.read_csv(input_path, delimiter=',', skipinitialspace=True)
    
    # Drop unwanted columns
    columns_to_drop = [
        'QUOTE_UNIXTIME', 
        'QUOTE_READTIME', 
        'QUOTE_TIME_HOURS', 
        'EXPIRE_UNIX'
    ]
    df = df.drop(columns=columns_to_drop, errors='ignore')
    
    # Convert numeric columns to proper float type
    float_cols = [
        'UNDERLYING_LAST', 'DTE',
        'C_DELTA', 'C_GAMMA', 'C_VEGA', 'C_THETA', 'C_RHO', 'C_IV',
        'C_VOLUME', 'C_LAST', 'C_BID', 'C_ASK', 'STRIKE',
        'P_BID', 'P_ASK', 'P_LAST', 'P_DELTA', 'P_GAMMA',
        'P_VEGA', 'P_THETA', 'P_RHO', 'P_IV', 'P_VOLUME',
        'STRIKE_DISTANCE', 'STRIKE_DISTANCE_PCT'
    ]
    
    for col in float_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Clean up the size columns (they contain 'x' characters)
    size_cols = ['C_SIZE', 'P_SIZE']
    for col in size_cols:
        df[col] = df[col].str.extract('(\d+)').astype('float')
    
    # Convert all column names to lowercase
    df.columns = df.columns.str.lower()
    
    # Save to CSV
    df.to_csv(output_path, index=False)
    print(f"Processed {input_path} -> {output_path}")

def main():
    # Create data directory if it doesn't exist
    if not os.path.exists('cleaned'):
        os.makedirs('cleaned')
    
    # Process all txt files in raw directory
    raw_dir = 'raw'
    data_dir = 'cleaned'
    
    for filename in os.listdir(raw_dir):
        if filename.endswith('.txt'):
            input_path = os.path.join(raw_dir, filename)
            output_path = os.path.join(data_dir, filename.replace('.txt', '.csv'))
            
            try:
                clean_data_file(input_path, output_path)
            except Exception as e:
                print(f"Error processing {filename}: {str(e)}")

if __name__ == "__main__":
    main() 