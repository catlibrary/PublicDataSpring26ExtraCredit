import pandas as pd

# Load dataset
df = pd.read_csv("rent_bubble_chart.csv")

# Keep only needed columns
df = df[
    [
        "Community Reporting Area Name",
        "Year",
        "Tract Median Apartment Contract Rent per Unit",
        "Cost Category"
    ]
]

# Keep only most recent year
latest_year = df["Year"].max()
df = df[df["Year"] == latest_year]

# Rename columns for easier D3 use
df = df.rename(columns={
    "Community Reporting Area Name": "area",
    "Tract Median Apartment Contract Rent per Unit": "rent",
    "Year": "year",
    "Cost Category": "category"
})

# Remove missing values
df = df.dropna()

# Save cleaned file
df.to_csv("rent_bubble_clean.csv", index=False)

print(df.head())
print(f"Saved {len(df)} rows from year {latest_year}")