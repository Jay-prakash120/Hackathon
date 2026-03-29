from pymongo import MongoClient
try:
    client = MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=2000)
    client.server_info()
    print("✅ MongoDB is reachable!")
except Exception as e:
    print(f"❌ MongoDB unreachable: {e}")
