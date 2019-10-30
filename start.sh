#!/bin/bash

# Start redis server
echo "Starting REDIS"
./usr/bin/redis-server &
status=$?
echo "$status"

if [ $status -ne 0 ]; then
  echo "Failed to start redis: $status"
  exit $status
fi

# make sure redis is running
sleep 10

# Start the app
echo "Starting APP"
./opt/venv/bin/python app.py &
status=$?
echo "$status"
if [ $status -ne 0 ]; then
  echo "Failed to start app.py: $status"
  exit $status
fi

# Start the update
echo "Starting UPDATE"
./opt/venv/bin/python update.py &
status=$?
echo "$status"
if [ $status -ne 0 ]; then
  echo "Failed to start update.py: $status"
  exit $status
fi

# Naive check runs checks once a minute to see if either of the processes exited.
# This illustrates part of the heavy lifting you need to do if you want to run
# more than one service in a container. The container exits with an error
# if it detects that either of the processes has exited.
# Otherwise it loops forever, waking up every 60 seconds

while sleep 60; do
  ps aux |grep redis-server |grep -q -v grep
  PROCESS_1_STATUS=$?
  ps aux |grep app.py |grep -q -v grep
  PROCESS_2_STATUS=$?
  ps aux |grep update.py |grep -q -v grep
  PROCESS_3_STATUS=$?
  # If the greps above find anything, they exit with 0 status
  # If they are not both 0, then something is wrong
  if [ $PROCESS_1_STATUS -ne 0 -o $PROCESS_2_STATUS -ne 0 -o $PROCESS_3_STATUS -ne 0 ]; then
    echo "One of the processes has already exited."
    exit 1
  fi
done