FROM python:3

WORKDIR /api_act

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 4786

CMD [ "python", "./api_act.py" ]
