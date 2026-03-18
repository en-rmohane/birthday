from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    """Render the main birthday profile page."""
    return render_template('index.html')

if __name__ == '__main__':
    # Set debug=True for local development as requested
    app.run(debug=True, port=5000)
