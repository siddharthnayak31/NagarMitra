from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from firebase_admin import credentials, firestore, initialize_app
import datetime
import uvicorn

app = FastAPI()

# Initialize Firebase Admin SDK
cred = credentials.Certificate("serviceAccountKey.json")
initialize_app(cred)
db = firestore.client()  # Firestore client

# Serve the HTML form (user page)
@app.get("/", response_class=HTMLResponse)
async def get_form():
    return """
    <html>
    <head>
        <title>Submit Complaint</title>
    </head>
    <body>
        <h2>Submit a Complaint</h2>
        <form id="complaintForm">
          <input type="text" id="message" placeholder="Enter complaint" required />
          <button type="submit">Submit</button>
        </form>

        <script>
        document.getElementById("complaintForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const message = document.getElementById("message").value;

            const res = await fetch("/notify", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ message })
            });

            const data = await res.json();
            alert(data.message);
            document.getElementById("complaintForm").reset();
        });
        </script>
    </body>
    </html>
    """

# Endpoint to receive complaints
@app.post("/notify")
async def notify(request: Request):
    data = await request.json()  # Get JSON from frontend
    data["createdAt"] = datetime.datetime.utcnow().isoformat()  # Add timestamp
    db.collection("notifications").add(data)  # Save to Firestore
    return {"status": "ok", "message": "Complaint submitted successfully!"}

# Run the server
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)