#!/bin/bash
source venv/Scripts/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
# run ./activate.sh here: or bash <file-name.sh>
# python -m venv venv