from celery import Celery
import subprocess
import json

app = Celery('tasks', broker='pyamqp://guest@localhost//')


@app.task
def run_mosca_task(config):
    try:
        # Create a temporary config file
        temp_config_file = 'temp_config.json'
        with open(temp_config_file, 'w') as temp_file:
            json.dump(config, temp_file)

        # Run the mosca command with the temporary config file
        command = ['mosca', '-c', temp_config_file]
        result = subprocess.run(command, capture_output=True, text=True)

        # Remove the temporary config file
        subprocess.run(['rm', temp_config_file])

        return {'output': result.stdout, 'error': result.stderr}

    except Exception as e:
        return {'error': str(e)}
