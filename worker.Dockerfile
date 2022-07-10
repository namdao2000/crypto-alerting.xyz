FROM python:3.7

WORKDIR /app/

COPY worker/requirements.txt /app/

RUN pip3 install -r requirements.txt

COPY worker/ .

CMD ["python" , "-u", "src/main.py"]
