from tasks import run_mosca_task
from flask import Flask, jsonify, request
from logging.config import dictConfig

app = Flask(__name__)

dictConfig(
    {
        "version": 1,
        "formatters": {
            "default": {
                "format": "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "stream": "ext://sys.stdout",
                "formatter": "default",
            }
        },
        "root": {"level": "DEBUG", "handlers": ["console"]},
    }
)


@app.route('/run_mosca', methods=['POST'])
def run_mosca():
    try:
        # Get JSON data from the request
        data = request.get_json()

        # Check if 'config' key exists in the JSON data
        if 'config' not in data:
            return jsonify({'error': 'Missing "config" key in the request'}), 400

        # Run the Celery task asynchronously
        result = run_mosca_task.delay(data['config'])

        return jsonify({'task_id': result.id}), 202

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
