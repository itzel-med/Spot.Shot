from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)  # <--- permite peticiones desde cualquier origen

@app.route("/api/reports")
def reports():
    try:
        url = "https://www.thereportoftheweekapi.com/api/v1/reports"
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
