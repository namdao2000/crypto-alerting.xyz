FROM python:3.7

WORKDIR /app/worker

COPY requirements.txt /app/worker

RUN pip3 install -r requirements.txt

COPY src/ .

CMD ["python" , "-u", "src/main.py"]
