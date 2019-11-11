FROM ubuntu:18.04
RUN apt-get update && apt-get install \
  -y --no-install-recommends python3 python3-virtualenv

# Setup virtualenv for python
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m virtualenv --python=/usr/bin/python3 $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy files and folders
WORKDIR /code
COPY app.py job.py update.py start.sh start.sh ./
ADD static/ /static/
ADD public/ /public/
ADD notebooks/ /notebooks/
ADD data/ /data/
RUN mkdir insights

# Run app
RUN ["chmod", "+x", "./start.sh"]
CMD ./start.sh
