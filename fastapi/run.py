import os
import subprocess
import time
import signal

def run_command(command):
    """Runs a shell command and ensures it completes before continuing."""
    print(f"🔹 Running: {command}")
    result = subprocess.run(command, shell=True, text=True)
    if result.returncode == 0:
        print("✅ Success")
    else:
        print(f"❌ Failed ({result.returncode})")

def stop_uvicorn():
    """Stops any running Uvicorn process on port 8000."""
    print("🛑 Checking for running Uvicorn processes...")
    
    # Find any process using port 8000
    result = subprocess.run("lsof -t -i:8000", shell=True, text=True, capture_output=True)
    
    if result.stdout.strip():
        pids = result.stdout.strip().split("\n")
        for pid in pids:
            print(f"🔹 Stopping process {pid} (Uvicorn)...")
            os.kill(int(pid), signal.SIGTERM)  # Sends a termination signal
        time.sleep(2)  # Give it time to fully stop

if __name__ == "__main__":
    # ✅ Step 1: Remove old database
    run_command('rm -rf test.db')

    # ✅ Step 2: Stop any running Uvicorn processes (Fix "Address already in use" error)
    stop_uvicorn()

    # ✅ Step 3: Start Uvicorn (only to initialize tables)
    print("🚀 Starting Uvicorn to initialize database tables...")
    uvicorn_process = subprocess.Popen(
        "uvicorn app.main:app --log-level debug --reload",
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # ✅ Step 4: Wait for Uvicorn to initialize (Give time for DB to create tables)
    time.sleep(5)

    # ✅ Step 5: Stop Uvicorn after tables are created
    print("🛑 Stopping Uvicorn after database initialization...")
    uvicorn_process.terminate()
    uvicorn_process.wait()

    # ✅ Step 6: Load Mock Data
    run_command('python3 app/scripts/upload_mock_data.py')

    # ✅ Step 7: Restart Uvicorn for actual API serving
    print("\n🚀 Restarting Uvicorn for production...")
    stop_uvicorn()  # Ensure no previous process is running
    run_command('uvicorn app.main:app --log-level debug --reload')
